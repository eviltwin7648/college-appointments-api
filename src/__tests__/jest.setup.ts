import { PrismaClient } from '@prisma/client';
import { cleanDb } from '../db/prisma/test-utils';

const prisma = new PrismaClient();

beforeAll(async () => {
  await cleanDb();
});

afterAll(async () => {
  await prisma.$disconnect();
  await cleanDb()
});
