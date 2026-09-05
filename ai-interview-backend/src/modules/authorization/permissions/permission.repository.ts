import { Injectable } from '@nestjs/common';
import { HttpMethod, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  findByMethodAndPath(method: HttpMethod, path: string) {
    return this.prisma.permission.findUnique({
      where: { method_path: { method, path } },
    });
  }

  findMany(where: Prisma.PermissionWhereInput, skip: number, take: number) {
    return this.prisma.permission.findMany({
      where,
      skip,
      take,
      orderBy: [{ path: 'asc' }, { method: 'asc' }],
    });
  }

  count(where: Prisma.PermissionWhereInput) {
    return this.prisma.permission.count({ where });
  }

  create(data: Prisma.PermissionCreateInput) {
    return this.prisma.permission.create({ data });
  }

  update(id: string, data: Prisma.PermissionUpdateInput) {
    return this.prisma.permission.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
