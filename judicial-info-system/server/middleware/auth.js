import jwt from 'jsonwebtoken';
import { getJwtSecret, ensureJwtSecret } from '../utils/secrets.js';
import User from '../models/User.js';

export async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
  // Ensure a secret exists (will generate and persist if missing)
  ensureJwtSecret();
  const decoded = jwt.verify(token, getJwtSecret());
    req.auth = decoded;
    if (decoded?.sub) {
      const user = await User.findOne({ id: decoded.sub });
      if (user) req.user = { id: user.id, role: user.role, email: user.email, fullName: user.fullName };
    }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAuth(req, res, next) {
  if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
  return next();
}
