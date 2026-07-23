import { Global, Module } from '@nestjs/common';
import { CreditsService } from './credits.service';

import { UserRepository } from '../user/user.repository';

@Global()
@Module({
  providers: [CreditsService, UserRepository],
  exports: [CreditsService],
})
export class CreditsModule {}
