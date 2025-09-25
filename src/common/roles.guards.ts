import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
