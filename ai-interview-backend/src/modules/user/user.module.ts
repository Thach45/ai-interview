import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AdminUserController } from './admin-user.controller';
import { UserService } from './user.service';
import { AdminUserService } from './admin-user.service';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController, AdminUserController],
  providers: [UserService, AdminUserService, UserRepository],
  exports: [UserService, AdminUserService, UserRepository],
})
export class UserModule {}
