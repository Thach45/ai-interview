import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@Controller('admin/authorization/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
  ) {
    const activeFilter =
      isActive === undefined ? undefined : isActive.toLowerCase() === 'true';

    return this.roleService.findAll(
      page ? Number.parseInt(page, 10) : 1,
      limit ? Number.parseInt(limit, 10) : 20,
      activeFilter,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
