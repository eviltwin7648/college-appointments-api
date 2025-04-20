import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cleanDb = async () => {
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.user.deleteMany();
};
