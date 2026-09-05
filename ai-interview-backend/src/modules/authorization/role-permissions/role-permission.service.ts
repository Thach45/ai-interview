import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '../../../common/exceptions/AppException';
import { SyncRolePermissionsDto } from './dto/role-permission.dto';
import { RolePermissionRepository } from './role-permission.repository';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async findPermissionsForRole(roleId: string) {
    await this.assertRoleExists(roleId);
    const assignments =
      await this.rolePermissionRepository.findPermissionsForRole(roleId);
    return assignments.map(({ permission }) => permission);
  }

  async findRolesForPermission(permissionId: string) {
    await this.assertPermissionExists(permissionId);
    const assignments =
      await this.rolePermissionRepository.findRolesForPermission(permissionId);
    return assignments.map(({ role }) => role);
  }

  async assign(roleId: string, permissionId: string) {
    await Promise.all([
      this.assertRoleExists(roleId),
      this.assertPermissionExists(permissionId),
    ]);

    const assignment = await this.rolePermissionRepository.findAssignment(
      roleId,
      permissionId,
    );
    if (assignment) {
      throw new BadRequestException('Permission đã được gán cho role');
    }

    return this.rolePermissionRepository.create(roleId, permissionId);
  }

  async replace(roleId: string, dto: SyncRolePermissionsDto) {
    await this.assertRoleExists(roleId);

    const permissionIds = [...new Set(dto.permissionIds)];
    const existingPermissionCount =
      await this.rolePermissionRepository.countPermissionsByIds(permissionIds);
    if (existingPermissionCount !== permissionIds.length) {
      throw new NotFoundException(
        'Một hoặc nhiều permission không tồn tại hoặc đã bị xóa',
      );
    }

    const assignments = await this.rolePermissionRepository.replacePermissions(
      roleId,
      permissionIds,
    );
    return assignments.map(({ permission }) => permission);
  }

  async unassign(roleId: string, permissionId: string) {
    await Promise.all([
      this.assertRoleExists(roleId),
      this.assertPermissionExists(permissionId),
    ]);

    const assignment = await this.rolePermissionRepository.findAssignment(
      roleId,
      permissionId,
    );
    if (!assignment) {
      throw new NotFoundException('Permission chưa được gán cho role');
    }

    await this.rolePermissionRepository.delete(roleId, permissionId);
    return { deleted: true, roleId, permissionId };
  }

  private async assertRoleExists(roleId: string) {
    const role = await this.rolePermissionRepository.findRoleById(roleId);
    if (!role) {
      throw new NotFoundException('Không tìm thấy role');
    }
  }

  private async assertPermissionExists(permissionId: string) {
    const permission =
      await this.rolePermissionRepository.findPermissionById(permissionId);
    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }
  }
}
