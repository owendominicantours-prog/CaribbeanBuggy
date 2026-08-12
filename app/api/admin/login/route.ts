import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminToken,
  isValidAdminLogin,
} from '../../../../lib/adminAuth';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  if (!body.username || !body.password || !isValidAdminLogin(body.username, body.password)) {
    return NextResponse.json({ error: 'Credenciales invalidas.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
