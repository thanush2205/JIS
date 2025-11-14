import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ensureJwtSecret, getJwtSecret } from '../utils/secrets.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, role, bio } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const prefix = role?.[0]?.toUpperCase() || 'U';
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const id = `${prefix}${randomDigits}`;
    const user = await User.create({ fullName, email, passwordHash, role, bio, id });
  await Activity.create({ actorId: id, actorRole: role || 'User', action: 'USER_SIGNUP', targetType: 'User', targetId: user.id, details: { email } });
    res.status(201).json({ id: user.id, email: user.email, role: user.role, fullName: user.fullName });
  } catch (err) {
  res.status(500).json({ error: err?.message || 'Signup failed' });
  }
});

// Login (email or ID)
router.post('/login', async (req, res) => {
  try {
  const { email, identifier, password } = req.body;
  if (!identifier && !email) return res.status(400).json({ error: 'Email or ID required' });
  if (!password) return res.status(400).json({ error: 'Password required' });
    const loginKey = identifier || email; // backward compatible
    const query = loginKey?.includes('@') ? { email: loginKey } : { id: loginKey };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  ensureJwtSecret();
  const token = jwt.sign({ sub: user.id, role: user.role }, getJwtSecret(), { expiresIn: '6h' });
  res.json({ token, id: user.id, role: user.role, fullName: user.fullName, email: user.email });
  try { await Activity.create({ actorId: user.id, actorRole: user.role, action: 'USER_LOGIN', targetType: 'User', targetId: user.id }); } catch {}
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Login failed' });
  }
});

// Profile
router.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, bio: user.bio });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update bio
router.patch('/profile/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, { bio: req.body.bio }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ bio: user.bio });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get current user from JWT
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findOne({ id: req.auth.sub });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, fullName: user.fullName, email: user.email, role: user.role, bio: user.bio });
});

// Admin/Registrar: list all users
router.get('/', async (_req, res) => {
  const users = await User.find({}, { _id: 0, passwordHash: 0, __v: 0 }).sort({ fullName: 1 });
  res.json(users);
});

// Admin/Registrar: create user (same as signup but accessible to privileged actor)
router.post('/', async (req, res) => {
  try {
    const { fullName, email, password, role, bio } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const prefix = role?.[0]?.toUpperCase() || 'U';
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const id = `${prefix}${randomDigits}`;
    const user = await User.create({ fullName, email, passwordHash, role, bio, id });
    res.status(201).json({ id: user.id, email: user.email, role: user.role, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Create failed' });
  }
});

// Admin/Registrar: delete user by id
router.delete('/:id', async (req, res) => {
  const user = await User.findOneAndDelete({ id: req.params.id });
  if (!user) return res.status(404).json({ error: 'User not found' });
  await Activity.create({ actorId: user.id, actorRole: user.role, action: 'USER_DELETED', targetType: 'User', targetId: user.id, details: { email: user.email } });
  res.json({ ok: true });
});

export default router;
