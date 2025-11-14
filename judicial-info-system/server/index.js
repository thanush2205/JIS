import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
console.log('[startup] Starting Judicial Info System server...');

import caseRoutes from './routes/cases.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payments.js';
import activityRoutes from './routes/activity.js';

const app = express();
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
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
// Debug log before mounting activity
console.log('[debug] Mounting /api/activity routes...');
app.use('/api/activity', activityRoutes);
console.log('[debug] Mounted /api/activity');

// Debug: list registered routes once at startup
function listRoutes() {
  const routes = [];
  app._router.stack.forEach(mw => {
    if (mw.route) {
      const methods = Object.keys(mw.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${mw.route.path}`);
    } else if (mw.name === 'router' && mw.handle?.stack) {
      mw.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
  console.log('Registered routes:\n' + routes.map(r => ' - ' + r).join('\n'));
  const hasActivity = routes.some(r => r.includes('/api/activity'));
  if (!hasActivity) {
    console.warn('[warn] /api/activity not found in route list');
  }
}

const PORT = process.env.PORT || 5000;
const PRIMARY_URI = process.env.MONGODB_URI;
const FALLBACK_URI = process.env.MONGODB_URI_FALLBACK || process.env.MONGODB_URI_LOCAL;

if (!PRIMARY_URI && !FALLBACK_URI) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

async function connectMongo() {
  const uris = [PRIMARY_URI, FALLBACK_URI].filter(Boolean);
  let lastErr;
  for (const uri of uris) {
    try {
      console.log(`[mongo] Trying URI: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
      console.log(`MongoDB connected (${uri.includes('mongodb+srv://') ? 'SRV' : 'direct'})`);
      return true;
    } catch (err) {
      lastErr = err;
      const msg = err?.message || String(err);
      if (msg.includes('querySrv') || msg.includes('ENOTFOUND') || msg.includes('_mongodb._tcp')) {
        console.error('[mongo] DNS SRV lookup failed for Atlas URI. If you are using MongoDB Atlas:');
        console.error(' - Allow your IP in Atlas Network Access (or temporarily 0.0.0.0/0 for dev).');
        console.error(' - Ensure DNS can resolve SRV records: _mongodb._tcp.<cluster>.mongodb.net');
        console.error(' - Or set MONGODB_URI_FALLBACK to a direct URI (e.g., mongodb://127.0.0.1:27017/jis).');
      }
      console.error(`[mongo] Failed URI: ${uri.replace(/:[^@]*@/, ':***@')} -> ${msg}`);
    }
  }
  // Attempt in-memory fallback if available
  try {
    console.log('[mongo] Attempting in-memory server fallback...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    const uri = mem.getUri('jis');
    await mongoose.connect(uri);
    console.log('[mongo] Connected to in-memory MongoDB');
    return true;
  } catch (e) {
    console.error('[mongo] In-memory fallback failed:', e.message);
    if (lastErr) throw lastErr;
    throw e;
  }
}

connectMongo().then(() => {
  listRoutes();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Mongo connection error:', err?.message || err);
  process.exit(1);
});
