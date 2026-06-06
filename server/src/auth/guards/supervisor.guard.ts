import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SupervisorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'RESEARCH_SUPERVISOR') {
      throw new ForbiddenException('Access denied. Supervisor role required.');
    }

    return true;
  }
}
