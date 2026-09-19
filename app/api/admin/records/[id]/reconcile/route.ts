import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../../../../../../lib/adminAuth';
import { getAdminRecord, updateAdminRecordStatus } from '../../../../../../lib/adminStore';
import { getPaypalOrder } from '../../../../../../lib/paypal';
import { verifyCompletedPayment } from '../../../../../../lib/paypalPayment';

export const runtime = 'nodejs';

function maintenanceAuthorized(request: Request, reference: string) {
  const expected = process.env.PAYPAL_RECONCILE_TOKEN || '';
  const expires = Number(expected.split('.')[0]);
  const actual = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
  return !!expected && expected.split('.')[1] === reference && expires > Date.now() && Buffer.byteLength(actual) === Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const { id } = await context.params;
  if (!verifyAdminToken(jar.get(ADMIN_COOKIE_NAME)?.value) && !maintenanceAuthorized(request, id)) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  try {
    const record = await getAdminRecord(id);
    if (!record?.orderId) return NextResponse.json({ error: 'Reserva sin orden PayPal.' }, { status: 404 });
    const order = await getPaypalOrder(record.orderId);
    if (!verifyCompletedPayment(order, { orderId: record.orderId, reference: record.reference, total: record.booking.total })) {
      return NextResponse.json({ error: 'PayPal no confirma una captura completada por el importe de esta reserva.', paypalStatus: order.status }, { status: 409 });
    }
    if (record.status !== 'paid' && record.status !== 'capture_failed' && record.status !== 'pending_payment') {
      return NextResponse.json({ error: 'Revisa el estado operativo de esta reserva antes de conciliarla.' }, { status: 409 });
    }
    const updated = record.status === 'paid' ? record : await updateAdminRecordStatus(record.id, 'paid', `Conciliación PayPal: captura COMPLETED por USD ${record.booking.total?.toFixed(2)}. No se realizó un nuevo cobro.`);
    return NextResponse.json({ reference: record.reference, status: updated?.status, total: record.booking.total, paypalStatus: order.status });
  } catch { return NextResponse.json({ error: 'No se pudo consultar PayPal. El estado no se ha cambiado.' }, { status: 503 }); }
}
