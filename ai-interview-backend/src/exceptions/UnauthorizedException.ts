import { AppException } from './AppException';

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
