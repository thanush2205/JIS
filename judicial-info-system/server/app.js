import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import caseRoutes from './routes/cases.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payments.js';
import activityRoutes from './routes/activity.js';

const app = express();
// Allow local dev origins plus optional production frontend origins passed via CORS_ORIGIN env (comma-separated)
const extraOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    ...extraOrigins,
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/activity', activityRoutes);

// --- Mongo Connection (cached) ---
const PRIMARY_URI = process.env.MONGODB_URI;
const FALLBACK_URI = process.env.MONGODB_URI_FALLBACK || process.env.MONGODB_URI_LOCAL;
let mongoReadyPromise = null;

async function connectMongo() {
  if (!PRIMARY_URI && !FALLBACK_URI) {
    throw new Error('Missing MONGODB_URI');
  }
  const uris = [PRIMARY_URI, FALLBACK_URI].filter(Boolean);
  let lastErr;
  for (const uri of uris) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log('[mongo] connected');
      return true;
    } catch (err) {
      lastErr = err;
      console.error('[mongo] failed', err.message);
    }
  }
  try {
    console.log('[mongo] in-memory fallback');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri('jis');
    await mongoose.connect(uri);
    console.log('[mongo] memory connected');
    return true;
  } catch (e) {
    if (lastErr) throw lastErr;
    throw e;
  }
}

export function ensureMongo() {
  if (!mongoReadyPromise) {
    mongoReadyPromise = connectMongo();
  }
  return mongoReadyPromise;
}

export async function handler(req, res) {
  try {
    await ensureMongo();
    return app(req, res);
  } catch (e) {
    console.error('Mongo connection error:', e.message);
    res.statusCode = 500;
    res.end('Mongo connection error');
  }
}

export default app;
