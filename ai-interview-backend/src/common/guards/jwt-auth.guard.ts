import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  // Support token in query param (for SSE)
  getRequest(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest();
    if (request.query?.token && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${request.query.token}`;
    }
    return request;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Token đã hết hạn, vui lòng đăng nhập lại',
        );
      }
      throw err || new UnauthorizedException('Vui lòng đăng nhập để truy cập');
    }
    return user;
  }
}
