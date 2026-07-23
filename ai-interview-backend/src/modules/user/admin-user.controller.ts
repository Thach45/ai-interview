import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { HasRole } from '../../common/decorators/has-role.decorator';
import { AdminUserService } from './admin-user.service';
import { AdminCreateUserDto, AdminUpdateUserDto } from './dto/user.dto';

@Controller('admin/users')
@HasRole(Role.ADMIN)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminUserService.getAllUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.adminUserService.getUserById(id);
  }

  @Post()
  async createUser(@Body() dto: AdminCreateUserDto) {
    return this.adminUserService.createUser(dto);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.adminUserService.updateUser(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.adminUserService.deleteUser(id);
  }
}
