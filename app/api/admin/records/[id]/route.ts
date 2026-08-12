import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../../../../../lib/adminAuth';
import { updateAdminRecordStatus, type AdminRecordStatus } from '../../../../../lib/adminStore';

const allowedStatuses = new Set<AdminRecordStatus>([
  'pending_payment',
  'paid',
  'inquiry',
  'contacted',
  'completed',
  'cancelled',
  'capture_failed',
]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();

  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    status?: AdminRecordStatus;
    note?: string;
  };

  if (!body.status || !allowedStatuses.has(body.status)) {
    return NextResponse.json({ error: 'Estado invalido.' }, { status: 400 });
  }

  const record = await updateAdminRecordStatus(id, body.status, body.note);

  if (!record) {
    return NextResponse.json({ error: 'Registro no encontrado.' }, { status: 404 });
  }

  return NextResponse.json(record);
}
