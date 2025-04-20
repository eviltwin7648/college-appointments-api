import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
import professorRouter from './routes/professorRouter';
import studentRouter from './routes/studentRouter';


import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient()

export const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.use('/api/auth', authRouter);
app.use('/api/professor', professorRouter);  
app.use('/api/student', studentRouter);

export default app;