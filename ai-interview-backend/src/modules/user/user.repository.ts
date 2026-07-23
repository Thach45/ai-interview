import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findById(
    id: string,
    select?: Prisma.UserSelect,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).user.findUnique({
      where: { id },
      select,
    });
  }

  async findByEmail(
    email: string,
    select?: Prisma.UserSelect,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).user.findUnique({
      where: { email },
      select,
    });
  }

  async findFirst(
    where: Prisma.UserWhereInput,
    select?: Prisma.UserSelect,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).user.findFirst({
      where,
      select,
    });
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
      select?: Prisma.UserSelect;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).user.findMany(params);
  }

  async count(where?: Prisma.UserWhereInput, tx?: Prisma.TransactionClient) {
    return this.getClient(tx).user.count({ where });
  }

  async create(
    data: Prisma.UserCreateInput,
    select?: Prisma.UserSelect,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).user.create({
      data,
      select,
    });
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    select?: Prisma.UserSelect,
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).user.update({
      where: { id },
      data,
      select,
    });
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    return this.getClient(tx).user.delete({
      where: { id },
    });
  }
}
