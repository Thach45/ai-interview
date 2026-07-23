import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HAS_ROLE_KEY } from '../decorators/has-role.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Role } from '@prisma/client';

/**
 * Role-based authorization guard.
 * Reads @HasRole() metadata from the route handler/controller.
 * Must be used together with JwtAuthGuard (or a global auth guard) so req.user exists.
 *
 * @example
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @HasRole(Role.ADMIN)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      HAS_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }

    return true;
  }
}
