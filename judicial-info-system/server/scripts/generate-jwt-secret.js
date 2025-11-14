#!/usr/bin/env node
import { ensureJwtSecret, getJwtSecret } from '../utils/secrets.js';

const persisted = ensureJwtSecret({ persist: true });
console.log('JWT_SECRET set to:', getJwtSecret());
