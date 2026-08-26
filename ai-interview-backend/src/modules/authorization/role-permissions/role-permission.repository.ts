import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRoleById(id: string) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  findPermissionById(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  countPermissionsByIds(permissionIds: string[]) {
    return this.prisma.permission.count({
      where: { id: { in: permissionIds } },
    });
  }

  findPermissionsForRole(roleId: string) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
      orderBy: {
        permission: {
          path: 'asc',
        },
      },
    });
  }

  findRolesForPermission(permissionId: string) {
    return this.prisma.rolePermission.findMany({
      where: { permissionId },
      include: { role: true },
      orderBy: {
        role: {
          createdAt: 'asc',
        },
      },
    });
  }

  findAssignment(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
  }

  create(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.create({
      data: { roleId, permissionId },
      include: { permission: true },
    });
  }

  delete(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
  }

  async replacePermissions(roleId: string, permissionIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });

      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
        });
      }

      return tx.rolePermission.findMany({
        where: { roleId },
        include: { permission: true },
        orderBy: {
          permission: {
            path: 'asc',
          },
        },
      });
    });
  }
}
