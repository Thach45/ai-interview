import prisma from '../config/prisma';

export const findUserByEmail = async (email: string): Promise<any | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string): Promise<any | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (userData: any) => {
  return await prisma.user.create({
    data: userData,
  });
};
