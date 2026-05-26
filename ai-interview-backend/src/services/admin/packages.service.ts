import prisma from '../../config/prisma';
import { NotFoundException } from '../../exceptions';

export class AdminPackagesService {
  async getAllPackages() {
    return await prisma.subscriptionPackage.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async getPackageById(id: string) {
    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id },
    });
    if (!pkg) {
      throw new NotFoundException('Package not found');
    }
    return pkg;
  }

  async createPackage(data: any) {
    const {
      name,
      tagline,
      price,
      oldPrice,
      durationDays,
      credits,
      isPopular,
      features,
      icon,
      isActive,
    } = data;
    return await prisma.subscriptionPackage.create({
      data: {
        name,
        tagline: tagline || null,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        durationDays: Number(durationDays),
        credits: Number(credits),
        isPopular: !!isPopular,
        features: features || [],
        icon: icon || 'rocket_launch',
        isActive: isActive !== undefined ? !!isActive : true,
      },
    });
  }

  async updatePackage(id: string, data: any) {
    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id },
    });
    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    const {
      name,
      tagline,
      price,
      oldPrice,
      durationDays,
      credits,
      isPopular,
      features,
      icon,
      isActive,
    } = data;
    return await prisma.subscriptionPackage.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        tagline: tagline !== undefined ? tagline : undefined,
        price: price !== undefined ? Number(price) : undefined,
        oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : undefined,
        durationDays: durationDays !== undefined ? Number(durationDays) : undefined,
        credits: credits !== undefined ? Number(credits) : undefined,
        isPopular: isPopular !== undefined ? !!isPopular : undefined,
        features: features !== undefined ? features : undefined,
        icon: icon !== undefined ? icon : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
      },
    });
  }

  async deletePackage(id: string) {
    const pkg = await prisma.subscriptionPackage.findUnique({
      where: { id },
    });
    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    await prisma.subscriptionPackage.delete({
      where: { id },
    });
    return { message: 'Package deleted successfully' };
  }
}

export const adminPackagesService = new AdminPackagesService();
