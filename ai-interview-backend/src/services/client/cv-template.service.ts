import { PrismaClient } from '@prisma/client';
import prisma from '../../config/prisma';

export class CvTemplateClientService {
  constructor(private readonly _prisma: PrismaClient) {}

  async getTemplates() {
    return this._prisma.cvTemplate.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTemplateById(id: string) {
    return this._prisma.cvTemplate.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }
}

export const cvTemplateClientService = new CvTemplateClientService(prisma);
