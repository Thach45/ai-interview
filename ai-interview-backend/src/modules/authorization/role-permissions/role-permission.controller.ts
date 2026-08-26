import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SyncRolePermissionsDto } from './dto/role-permission.dto';
import { RolePermissionService } from './role-permission.service';

@Controller('admin/authorization')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Get('roles/:roleId/permissions')
  findPermissionsForRole(@Param('roleId') roleId: string) {
    return this.rolePermissionService.findPermissionsForRole(roleId);
  }

  @Post('roles/:roleId/permissions/:permissionId')
  assign(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolePermissionService.assign(roleId, permissionId);
  }

  @Patch('roles/:roleId/permissions')
  replace(
    @Param('roleId') roleId: string,
    @Body() dto: SyncRolePermissionsDto,
  ) {
    return this.rolePermissionService.replace(roleId, dto);
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  unassign(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolePermissionService.unassign(roleId, permissionId);
  }

  @Get('permissions/:permissionId/roles')
  findRolesForPermission(@Param('permissionId') permissionId: string) {
    return this.rolePermissionService.findRolesForPermission(permissionId);
  }
}
