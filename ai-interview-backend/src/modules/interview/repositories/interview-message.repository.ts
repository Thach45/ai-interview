import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InterviewMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx || this.prisma;
  }

  async findUnique(
    params: {
      where: Prisma.InterviewMessageWhereUniqueInput;
      include?: Prisma.InterviewMessageInclude;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.findUnique(params);
  }

  async findMany(
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.InterviewMessageWhereInput;
      orderBy?: Prisma.InterviewMessageOrderByWithRelationInput;
      include?: Prisma.InterviewMessageInclude;
      select?: Prisma.InterviewMessageSelect;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.findMany(params);
  }

  async count(
    params?: { where?: Prisma.InterviewMessageWhereInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.count(params);
  }

  async aggregate(
    params: {
      _count?: Prisma.InterviewMessageCountAggregateInputType | true;
      _avg?: Prisma.InterviewMessageAvgAggregateInputType;
      _sum?: Prisma.InterviewMessageSumAggregateInputType;
      _min?: Prisma.InterviewMessageMinAggregateInputType;
      _max?: Prisma.InterviewMessageMaxAggregateInputType;
      where?: Prisma.InterviewMessageWhereInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.aggregate(params);
  }

  async create(
    params: {
      data:
        | Prisma.InterviewMessageUncheckedCreateInput
        | Prisma.InterviewMessageCreateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.create(params);
  }

  async update(
    params: {
      where: Prisma.InterviewMessageWhereUniqueInput;
      data: Prisma.InterviewMessageUpdateInput;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.update(params);
  }

  async delete(
    params: { where: Prisma.InterviewMessageWhereUniqueInput },
    tx?: Prisma.TransactionClient,
  ) {
    return this.getClient(tx).interviewMessage.delete(params);
  }
}
