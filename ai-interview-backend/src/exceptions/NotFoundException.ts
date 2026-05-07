import { AppException } from './AppException';

export class NotFoundException extends AppException {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}
