import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private firebaseApp: admin.app.App | null = null;
  private missingCredentials: string[] = [];

  onModuleInit() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    this.missingCredentials = [
      ['FIREBASE_PROJECT_ID', projectId],
      ['FIREBASE_CLIENT_EMAIL', clientEmail],
      ['FIREBASE_PRIVATE_KEY', privateKeyRaw],
    ]
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (this.missingCredentials.length > 0) {
      this.logger.error(
        `Missing Firebase Admin credentials: ${this.missingCredentials.join(', ')}`,
      );
      return;
    }

    try {
      // Parse private key formatting (replaces string literal \n with actual newlines)
      const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

      this.firebaseApp = admin.apps.length > 0
        ? admin.app()
        : admin.initializeApp({
            credential: admin.credential.cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          });

      this.logger.log(`Firebase Admin SDK initialized for project: ${projectId}`);
    } catch (e: any) {
      this.logger.error(`Failed to initialize Firebase Admin SDK: ${e.message}`);
    }
  }

  getMissingCredentials(): string[] {
    return this.missingCredentials;
  }

  isInitialized(): boolean {
    return this.firebaseApp !== null;
  }

  /**
   * Securely verify a Firebase JWT ID Token passed from the frontend
   */
  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.firebaseApp) {
      const missing = this.missingCredentials.length
        ? ` Missing env vars: ${this.missingCredentials.join(', ')}.`
        : '';
      throw new Error(`Firebase Admin SDK is not initialized.${missing}`);
    }

    try {
      this.logger.debug(`Verifying Firebase ID token. tokenLength=${token.length}`);
      const decodedToken = await admin.auth().verifyIdToken(token);
      this.logger.log(`Firebase token verified for uid=${decodedToken.uid}, email=${decodedToken.email || 'unknown'}`);
      return decodedToken;
    } catch (e: any) {
      this.logger.error(`Firebase token verification failed: ${e.message}`);
      throw new Error(`Firebase token verification failed: ${e.message}`);
    }
  }
}
