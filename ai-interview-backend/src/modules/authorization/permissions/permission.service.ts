import { Injectable } from '@nestjs/common';
import { HttpMethod, Prisma } from '@prisma/client';
import {
  BadRequestException,
  NotFoundException,
} from '../../../common/exceptions/AppException';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PermissionRepository } from './permission.repository';
import { PermissionDiscoveryService } from './permission-discovery.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly permissionDiscoveryService: PermissionDiscoveryService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(page = 1, limit = 20, isActive?: boolean) {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(Math.max(1, limit), 100);
    const where: Prisma.PermissionWhereInput =
      isActive === undefined ? {} : { isActive };

    const [data, total] = await Promise.all([
      this.permissionRepository.findMany(
        where,
        (normalizedPage - 1) * normalizedLimit,
        normalizedLimit,
      ),
      this.permissionRepository.count(where),
    ]);

    return {
      data,
      meta: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages: Math.ceil(total / normalizedLimit),
      },
    };
  }

  async findById(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException('Không tìm thấy permission');
    }
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const path = this.normalizePath(dto.path);
    await this.assertMethodAndPathAvailable(dto.method, path);

    return this.permissionRepository.create({
      method: dto.method,
      path,
      displayName: dto.displayName,
      description: dto.description || null,
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    const existing = await this.findById(id);
    const method = dto.method ?? existing.method;
    const path =
      dto.path === undefined ? existing.path : this.normalizePath(dto.path);

    await this.assertMethodAndPathAvailable(method, path, id);

    return this.permissionRepository.update(id, {
      ...(dto.method !== undefined && { method }),
      ...(dto.path !== undefined && { path }),
      ...(dto.displayName !== undefined && { displayName: dto.displayName }),
      ...(dto.description !== undefined && {
        description: dto.description || null,
      }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.permissionRepository.delete(id);
    return { deleted: true, id };
  }

  async sync() {
    const discovered = this.permissionDiscoveryService
      .discover()
      .filter((permission) => !permission.isPublic)
      .map(({ method, path }) => ({
        method,
        path,
        displayName: `${method} ${path}`,
        isActive: true,
      }));
    const result = await this.prisma.permission.createMany({
      data: discovered,
      skipDuplicates: true,
    });
    const adminRole = await this.prisma.role.findUnique({
      where: { code: 'ADMIN' },
      select: { id: true },
    });
    if (!adminRole) {
      throw new BadRequestException(
        'Không tìm thấy role ADMIN để bootstrap permission',
      );
    }

    const permissions = await this.prisma.permission.findMany({
      select: { id: true, method: true, path: true },
    });
    const granted = await this.prisma.rolePermission.createMany({
      data: permissions.map(({ id: permissionId }) => ({
        roleId: adminRole.id,
        permissionId,
      })),
      skipDuplicates: true,
    });

    return {
      discovered: discovered.length,
      created: result.count,
      skipped: discovered.length - result.count,
      grantedToAdmin: granted.count,
    };
  }

  private normalizePath(path: string) {
    const normalized = path.trim();
    return normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized;
  }

  private async assertMethodAndPathAvailable(
    method: HttpMethod,
    path: string,
    excludedId?: string,
  ) {
    const duplicate = await this.permissionRepository.findByMethodAndPath(
      method,
      path,
    );

    if (duplicate && duplicate.id !== excludedId) {
      throw new BadRequestException(
        `Permission cho ${method} ${path} đã tồn tại`,
      );
    }
  }
}
