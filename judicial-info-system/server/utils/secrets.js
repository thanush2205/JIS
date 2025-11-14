import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function generateSecret() {
  // URL-safe, high-entropy secret
  return crypto.randomBytes(64).toString('base64url');
}

function writeEnvIfMissing(key, value) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');
      const hasKey = new RegExp(`^${key}=`, 'm').test(content);
      if (hasKey) return false; // do not overwrite existing
      if (content.length && !content.endsWith('\n')) content += '\n';
    }
    content += `${key}=${value}\n`;
    fs.writeFileSync(envPath, content, 'utf8');
    return true;
  } catch {
    return false;
  }
}

let cachedSecret = null;

export function ensureJwtSecret({ persist = true } = {}) {
  if (process.env.JWT_SECRET) {
    cachedSecret = process.env.JWT_SECRET;
    return cachedSecret;
  }
  if (cachedSecret) return cachedSecret;
  const secret = generateSecret();
  process.env.JWT_SECRET = secret;
  cachedSecret = secret;
  if (persist) writeEnvIfMissing('JWT_SECRET', secret);
  return secret;
}

export function getJwtSecret() {
  return cachedSecret || process.env.JWT_SECRET || ensureJwtSecret();
}
