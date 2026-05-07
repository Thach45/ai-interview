import { AppException } from './AppException';

export class BadRequestException extends AppException {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}
