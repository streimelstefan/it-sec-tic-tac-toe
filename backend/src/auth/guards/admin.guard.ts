import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NEEDS_ADMIN_KEY } from '../decorators/admin.decorator';
import { AuthContextDto } from '../dto/authContext.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const needsAdmin = this.reflector.getAllAndOverride<boolean>(
      NEEDS_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!needsAdmin) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as AuthContextDto;

    return user.isAdmin;
  }
}
