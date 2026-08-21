import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'caribbean_buggy_admin';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const isProduction = process.env.NODE_ENV === 'production';
const adminUser = process.env.CARIBBEAN_ADMIN_USER ?? 'admin';
const adminPassword = process.env.CARIBBEAN_ADMIN_PASSWORD ?? (isProduction ? '' : 'Exito2024@@');
const secret =
  process.env.CARIBBEAN_ADMIN_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (isProduction ? '' : 'caribbean-buggy-local-admin-secret');

function sign(payload: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

export function isValidAdminLogin(username: string, password: string) {
  return Boolean(adminPassword && secret) && username === adminUser && password === adminPassword;
}

export function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ sub: adminUser, iat: Date.now() })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: string;
      iat?: number;
    };
    return data.sub === adminUser && Date.now() - Number(data.iat || 0) < ADMIN_SESSION_MAX_AGE * 1000;
  } catch {
    return false;
  }
}
