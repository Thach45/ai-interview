import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserCvRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.UserCvWhereUniqueInput;
      include?: Prisma.UserCvInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.findUnique(params);
  }

  async findFirst(
    params: {
      where?: Prisma.UserCvWhereInput;
      include?: Prisma.UserCvInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.findFirst(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.UserCvWhereInput;
      orderBy?: Prisma.UserCvOrderByWithRelationInput;
      include?: Prisma.UserCvInclude;
      select?: Prisma.UserCvSelect;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.findMany(params);
  }

  async count(
    params?: { where?: Prisma.UserCvWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.count(params);
  }

  async create(
    params: {
      data: Prisma.UserCvUncheckedCreateInput | Prisma.UserCvCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.create(params);
  }

  async update(
    params: {
      where: Prisma.UserCvWhereUniqueInput;
      data: Prisma.UserCvUncheckedUpdateInput | Prisma.UserCvUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.update(params);
  }

  async updateMany(
    params: {
      where: Prisma.UserCvWhereInput;
      data:
        | Prisma.UserCvUncheckedUpdateManyInput
        | Prisma.UserCvUpdateManyMutationInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.updateMany(params);
  }

  async delete(
    params: { where: Prisma.UserCvWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).userCv.delete(params);
  }
}
