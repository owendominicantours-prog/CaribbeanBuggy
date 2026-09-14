import { NextResponse } from 'next/server';
import { sendPaidBookingEmails, type BookingEmailPayload } from '../../../../lib/bookingEmails';
import { markAdminRecordCommandCenterSynced, updateAdminRecordStatus, upsertAdminRecord } from '../../../../lib/adminStore';
import { calculateBookingTotal, getProduct } from '../../../../lib/buggyProducts';
import { capturePaypalOrder } from '../../../../lib/paypal';
import { notifyPaidBookingToCommandCenter } from '../../../../lib/commandCenter';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let statusReference: string | undefined;
  let statusOrderId: string | undefined;

  try {
    const { orderID, booking, reference } = (await request.json()) as {
      orderID?: string;
      booking?: BookingEmailPayload;
      reference?: string;
    };
    statusReference = reference;
    statusOrderId = orderID;

    if (!orderID) {
      return NextResponse.json({ error: 'Falta la orden de PayPal.' }, { status: 400 });
    }

    const capture = await capturePaypalOrder(orderID);
    let paidRecord = await updateAdminRecordStatus(reference || orderID, 'paid', `Pago PayPal confirmado: ${orderID}`);

    if (!paidRecord && booking?.productId) {
      const product = getProduct(booking.productId);
      if (product) {
        const pricing = calculateBookingTotal({
          product,
          passengers: Number(booking.passengers || product.capacityNumber),
          pickupZone: String(booking.pickupZone || ''),
          photos: Boolean(booking.photos),
          privatePickup: Boolean(booking.privatePickup),
        });
        const now = new Date().toISOString();
        paidRecord = await upsertAdminRecord({
          id: reference || orderID,
          reference: reference || orderID,
          orderId: orderID,
          type: 'booking',
          source: 'paypal_capture_recovery',
          status: 'paid',
          createdAt: now,
          updatedAt: now,
          productId: product.id,
          productName: product.title,
          customer: { name: booking.name, email: booking.email, phone: booking.phone },
          booking: {
            date: booking.date,
            pickupWindow: booking.pickupWindow,
            hotel: booking.hotel,
            pickupZone: booking.pickupZone,
            passengers: pricing.passengers,
            language: booking.language,
            paymentPreference: booking.paymentPreference,
            photos: booking.photos,
            privatePickup: booking.privatePickup,
            total: pricing.total,
            vehicles: pricing.vehicles,
          },
          notes: [`${new Date().toLocaleString('es-DO')}: Registro reconstruido desde captura PayPal confirmada.`],
          raw: { paypalOrderId: orderID },
        });
      }
    }

    if (paidRecord) {
      const delivery = await notifyPaidBookingToCommandCenter(paidRecord);
      if (delivery.status === 'sent') {
        await markAdminRecordCommandCenterSynced(paidRecord.reference || paidRecord.id);
      }
    }

    if (booking?.productId && reference) {
      const product = getProduct(booking.productId);
      if (product) {
        const pricing = calculateBookingTotal({
          product,
          passengers: Number(booking.passengers || product.capacityNumber),
          pickupZone: String(booking.pickupZone || ''),
          photos: Boolean(booking.photos),
          privatePickup: Boolean(booking.privatePickup),
        });

        sendPaidBookingEmails({
          booking,
          product,
          pricing,
          orderId: orderID,
          reference,
        }).catch((emailError) => {
          console.error('booking_email_after_capture_error', emailError);
        });
      }
    }

    return NextResponse.json(capture);
  } catch (error) {
    console.error('paypal_capture_order_error', error);
    if (statusReference || statusOrderId) {
      await updateAdminRecordStatus(
        statusReference || statusOrderId || '',
        'capture_failed',
        statusOrderId ? `PayPal no confirmo la orden: ${statusOrderId}` : 'PayPal no confirmo la orden.',
      );
    }
    return NextResponse.json(
      { error: 'No pudimos confirmar el pago con PayPal. Revisa tu cuenta o contacta por WhatsApp.' },
      { status: 500 },
    );
  }
}
