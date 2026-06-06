import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseAdminService } from './firebase-admin.service';

// Email-pattern detection removed in favor of standard verification flow.
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private prisma: PrismaService,
    private firebaseAdmin: FirebaseAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      throw new UnauthorizedException('Authorization Bearer ID token is required.');
    }

    try {
      let decodedToken: any;

      this.logger.debug(`Received Firebase bearer token for verification. tokenLength=${token.length}`);
      decodedToken = await this.firebaseAdmin.verifyToken(token);

      const email = decodedToken.email || '';
      if (!email) {
        throw new Error('Firebase token is valid but does not contain an email claim.');
      }

      this.logger.log(`Authenticated Firebase user uid=${decodedToken.uid}, email=${email}`);
      const normalizedEmail = email.toLowerCase();

      let roleSource = 'Database';
      let user = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          interests: {
            include: {
              interest: true
            }
          }
        }
      });

      if (!user) {
        roleSource = 'Default / Main Admin Check';
        
        const mainAdminEmail = process.env.MAIN_ADMIN_EMAIL || 'curiousbees@srmist.edu.in';
        const isMainAdmin = normalizedEmail === mainAdminEmail.toLowerCase();
        const role = isMainAdmin ? 'INSTITUTION_ADMIN' : 'RESEARCH_SCHOLAR';
        const approved = isMainAdmin;
        const status = isMainAdmin ? 'APPROVED' : 'PENDING_SUPERVISOR';

        this.logger.log(`Creating CuriousBees user for ${normalizedEmail}: Assigned role=${role}, status=${status}`);
        user = await this.prisma.user.create({
          data: {
            firebaseUid: decodedToken.uid,
            email: normalizedEmail,
            name: decodedToken.name || email.split('@')[0],
            image: decodedToken.picture || null,
            role: role as any,
            approved: approved,
            status: status,
            emailVerified: new Date(),
          },
          include: {
            interests: {
              include: {
                interest: true
              }
            }
          }
        });
      } else {
        const needsUpdate =
          (decodedToken.name && decodedToken.name !== user.name) ||
          (decodedToken.picture && decodedToken.picture !== user.image) ||
          !user.emailVerified;

        if (needsUpdate) {
          this.logger.log(`Existing CuriousBees user found for ${normalizedEmail}; syncing profile fields.`);
          
          const updateData: any = {
            name: decodedToken.name || user.name,
            image: decodedToken.picture || user.image,
            emailVerified: user.emailVerified || new Date(),
          };

          user = await this.prisma.user.update({
            where: { id: user.id },
            data: updateData,
            include: {
              interests: {
                include: {
                  interest: true
                }
              }
            }
          });
        }
      }

      this.logger.log(`CuriousBees user sync complete for ${normalizedEmail}: id=${user.id}, role=${user.role}, approved=${user.approved}`);
      
      // ── Structured [AUTH] audit logs ──────────────────────────────────────
      this.logger.log(`[AUTH] User Email: ${normalizedEmail}`);
      this.logger.log(`[AUTH] User UID: ${decodedToken.uid}`);
      this.logger.log(`[AUTH] Retrieved Role: ${user.role}`);
      this.logger.log(`[AUTH] Role Source: ${roleSource}`);
      
      const redirectRoute = 
        (!user.approved || user.status !== 'APPROVED') ? '/verification-pending' :
        user.role === 'INSTITUTION_ADMIN' ? '/admin/dashboard' : '/dashboard';
        
      this.logger.log(`[AUTH] Expected Redirect Target: ${redirectRoute}`);
      
      request.user = user;
      return true;
    } catch (e: any) {
      this.logger.error(`Authentication failed: ${e.message}`);
      throw new UnauthorizedException({
        message: e.message || 'Authentication failed.',
        code: 'FIREBASE_AUTH_SYNC_FAILED',
        details: this.firebaseAdmin.getMissingCredentials?.() || [],
      });
    }
  }
}
