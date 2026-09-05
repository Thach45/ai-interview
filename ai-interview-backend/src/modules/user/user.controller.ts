import { Controller, Get, Put, Body } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TokenPayload } from '../../common/types/jwt.type';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: TokenPayload) {
    return this.userService.getUserById(user.id);
  }

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: TokenPayload) {
    return this.userService.getDashboardData(user.id);
  }

  @Put('me')
  async updateProfile(
    @CurrentUser() user: TokenPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateUser(user.id, dto);
  }
}
