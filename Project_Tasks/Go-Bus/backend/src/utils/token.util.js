import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'pullman-super-secret-key-2024';

/**
 * Sign a payload into a JWT token (Base64URL encoded header.payload.signature)
 * Uses native Node crypto HMAC-SHA256 with zero external dependencies.
 */
export const signToken = (payload, expiresInSeconds = 86400) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, iat: now, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

/**
 * Verify and decode a JWT token.
 * Returns decoded payload if valid, null otherwise.
 */
export const verifyToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
};
