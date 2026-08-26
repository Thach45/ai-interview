import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  BadRequestException,
  NotFoundException,
} from '../../../common/exceptions/AppException';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll(page = 1, limit = 20, isActive?: boolean) {
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(Math.max(1, limit), 100);
    const where: Prisma.RoleWhereInput =
      isActive === undefined ? {} : { isActive };

    const [data, total] = await Promise.all([
      this.roleRepository.findMany(
        where,
        (normalizedPage - 1) * normalizedLimit,
        normalizedLimit,
      ),
      this.roleRepository.count(where),
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
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Không tìm thấy role');
    }
    return role;
  }

  async create(dto: CreateRoleDto) {
    const duplicate = await this.roleRepository.findByCode(dto.code);
    if (duplicate) {
      throw new BadRequestException(`Role ${dto.code} đã tồn tại`);
    }

    return this.roleRepository.create({
      code: dto.code,
      displayName: dto.displayName,
      description: dto.description || null,
      isSystem: dto.isSystem ?? false,
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findById(id);

    return this.roleRepository.update(id, {
      ...(dto.displayName !== undefined && { displayName: dto.displayName }),
      ...(dto.description !== undefined && {
        description: dto.description || null,
      }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });
  }

  async delete(id: string) {
    const role = await this.findById(id);

    if (role.isSystem) {
      throw new BadRequestException('Không thể xóa role hệ thống');
    }

    if (role._count.userRoles > 0) {
      throw new BadRequestException(
        'Không thể xóa role đang được gán cho người dùng',
      );
    }

    await this.roleRepository.delete(id);
    return { deleted: true, id };
  }
}
