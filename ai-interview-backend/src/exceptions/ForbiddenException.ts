import { AppException } from './AppException';

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
