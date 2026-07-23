import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Bypass transform for SSE endpoints
    if (request.headers.accept === 'text/event-stream') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Success',
        data: data ?? null,
      })),
    );
  }
}
