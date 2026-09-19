import { NextResponse } from 'next/server';
import { sendPaidBookingEmails, type BookingEmailPayload } from '../../../../lib/bookingEmails';
import { getAdminRecord, markAdminRecordCommandCenterSynced, updateAdminRecordStatus } from '../../../../lib/adminStore';
import { calculateBookingTotal, getProduct } from '../../../../lib/buggyProducts';
import { capturePaypalOrder, getPaypalOrder } from '../../../../lib/paypal';
import { verifyCompletedPayment } from '../../../../lib/paypalPayment';
import { notifyPaidBookingToCommandCenter } from '../../../../lib/commandCenter';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderID = body?.orderID;
    if (typeof orderID !== 'string' || !/^[A-Za-z0-9]{10,40}$/.test(orderID)) {
      return NextResponse.json({ error: 'Falta una orden válida de PayPal.' }, { status: 400 });
    }
    const record = await getAdminRecord(orderID);
    if (!record || record.orderId !== orderID || (body.reference && body.reference !== record.reference)) {
      return NextResponse.json({ error: 'La orden no corresponde a esta reserva.' }, { status: 400 });
    }
    if (record.status === 'cancelled') return NextResponse.json({ error: 'La reserva está cancelada. Contacta con nosotros.' }, { status: 409 });
    const alreadyPaid = record.status === 'paid' || record.status === 'completed';
    const capture = alreadyPaid ? await getPaypalOrder(orderID) : await capturePaypalOrder(orderID);
    if (!verifyCompletedPayment(capture, { orderId: record.orderId, reference: record.reference, total: record.booking.total })) {
      return NextResponse.json({ error: 'PayPal todavía no confirma el pago completo de esta reserva. No realices otro pago; revisa el estado o contacta con nosotros.' }, { status: 409 });
    }
    const paidRecord = alreadyPaid ? record : await updateAdminRecordStatus(record.id, 'paid', `Pago PayPal verificado: ${orderID}`);
    if (!paidRecord) throw new Error('Booking persistence unavailable');
    try {
      if (!paidRecord.commandCenterSyncedAt) {
        const delivery = await notifyPaidBookingToCommandCenter(paidRecord);
        if (delivery.status === 'sent') await markAdminRecordCommandCenterSynced(paidRecord.id);
      }
    } catch { console.error('paid_booking_sync_pending'); }
    if (!alreadyPaid && record.productId && record.reference) {
      const product = getProduct(record.productId);
      if (product) {
        const booking: BookingEmailPayload = {
          productId: record.productId, date: record.booking.date || '', passengers: record.booking.passengers || 1,
          pickupZone: record.booking.pickupZone || '', hotel: record.booking.hotel || '',
          name: record.customer.name || '', email: record.customer.email || '', phone: record.customer.phone || '',
          language: record.booking.language || 'es', pickupWindow: record.booking.pickupWindow || '',
          paymentPreference: record.booking.paymentPreference || 'paypal', photos: !!record.booking.photos, privatePickup: !!record.booking.privatePickup,
        };
        const pricing = calculateBookingTotal({ product, passengers: booking.passengers, pickupZone: booking.pickupZone, photos: booking.photos, privatePickup: booking.privatePickup });
        try { await sendPaidBookingEmails({ booking, product, pricing, orderId: orderID, reference: record.reference }); }
        catch { console.error('paid_booking_email_pending'); }
      }
    }
    return NextResponse.json({ id: capture.id, status: 'COMPLETED' });
  } catch {
    // A timeout or local error does not prove PayPal declined the payment.
    console.error('paypal_confirmation_unavailable');
    return NextResponse.json({ error: 'No pudimos verificar el estado del pago. No pagues de nuevo; revisa tu cuenta o contacta con nosotros.' }, { status: 503 });
  }
}
