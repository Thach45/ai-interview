import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Something went very wrong!';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as any;
        // class-validator errors
        if (Array.isArray(resp.message)) {
          message = resp.message[0] || 'Validation failed';
        } else {
          message = resp.message || exception.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // In development, expose full error
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR:', exception);
    }
    Sentry.withScope((scope) => {
      scope.setTag('http.status_code', String(status));
      scope.setTag('error.source', 'global_exception_filter');

      Sentry.captureException(exception);
    });
    response.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}
