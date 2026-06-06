import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ScholarGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'RESEARCH_SCHOLAR') {
      throw new ForbiddenException('Access denied. Scholar role required.');
    }
    
    if (!user.approved) {
      throw new ForbiddenException('Access denied. Account is pending supervisor approval.');
    }

    return true;
  }
}
