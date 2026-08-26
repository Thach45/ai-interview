import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { HttpMethod } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const roles: string[] = request.user?.roles ?? [];

    const method = request.method as HttpMethod;
    if (!Object.values(HttpMethod).includes(method)) {
      throw new ForbiddenException('Phương thức request không được cấp quyền');
    }

    const path = this.resolveRoutePath(request);
    const permission = await this.prisma.rolePermission.findFirst({
      where: {
        role: { code: { in: roles }, isActive: true },
        permission: { method, path, isActive: true },
      },
      select: { roleId: true },
    });
    if (!permission) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này',
      );
    }
    return true;
  }

  private resolveRoutePath(request: {
    baseUrl?: string;
    route?: { path?: string };
  }): string {
    const routePath = request.route?.path ?? '';
    const path = `${request.baseUrl ?? ''}/${routePath}`
      .replace(/\/+/g, '/')
      .replace(/^\/api\/v1(?=\/|$)/, '');
    return path.length > 1 ? path.replace(/\/+$/, '') : path || '/';
  }
}
