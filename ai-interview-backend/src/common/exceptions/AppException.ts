import { HttpException } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}

export class BadRequestException extends AppException {
  constructor(message: string = 'Bad request') {
    super(message, 400);
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = 'Not found') {
    super(message, 404);
  }
}
