import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../../../../../lib/adminAuth';
import { updateAdminRecordStatus, type AdminRecordEdit, type AdminRecordStatus } from '../../../../../lib/adminStore';

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
    customer?: AdminRecordEdit['customer'];
    booking?: AdminRecordEdit['booking'];
  };

  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
  if (body.status !== undefined && !allowedStatuses.has(body.status)) {
    return NextResponse.json({ error: 'Estado invalido.' }, { status: 400 });
  }

  const edit: AdminRecordEdit = {};
  for (const [group, keys] of [['customer', ['name', 'email', 'phone']], ['booking', ['date', 'pickupWindow', 'hotel', 'pickupZone', 'language']]] as const) {
    const source = body[group];
    if (source === undefined) continue;
    if (!source || typeof source !== 'object' || Array.isArray(source)) return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 });
    const values: Record<string, string> = {};
    for (const key of keys) {
      const value = (source as Record<string, unknown>)[key];
      if (value === undefined) continue;
      if (typeof value !== 'string' || value.length > 300) return NextResponse.json({ error: 'Campo inválido o demasiado largo.' }, { status: 400 });
      values[key] = value.trim();
    }
    edit[group] = values;
  }
  const date = edit.booking?.date;
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date)) return NextResponse.json({ error: 'Fecha inválida.' }, { status: 400 });
  if (edit.customer?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(edit.customer.email)) return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
  if (body.note !== undefined && (typeof body.note !== 'string' || body.note.length > 2000)) return NextResponse.json({ error: 'Nota inválida.' }, { status: 400 });
  const note = body.note?.trim();
  if (!body.status && !edit.customer && !edit.booking && !note) return NextResponse.json({ error: 'No hay cambios.' }, { status: 400 });
  const record = await updateAdminRecordStatus(id, body.status, (edit.customer || edit.booking) ? `Datos operativos actualizados desde el panel.${note ? ' ' + note : ''}` : note, edit);

  if (!record) {
    return NextResponse.json({ error: 'Registro no encontrado.' }, { status: 404 });
  }

  return NextResponse.json(record);
}
