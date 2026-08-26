import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });
  }

  findByCode(code: string) {
    return this.prisma.role.findUnique({ where: { code } });
  }

  findMany(where: Prisma.RoleWhereInput, skip: number, take: number) {
    return this.prisma.role.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });
  }

  count(where: Prisma.RoleWhereInput) {
    return this.prisma.role.count({ where });
  }

  create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data });
  }

  update(id: string, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
}
