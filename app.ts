import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import simulateRoutes from './routes/simulate';
import prisma from './prismaClient';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ status: 'ok', now: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api', simulateRoutes);

// simple health + db check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: 'ok' });
  } catch (e) {
    res.status(500).json({ db: 'error', message: String(e) });
  }
});

export default app;
