import { NextResponse } from 'next/server';
import { sendPaidBookingEmails, type BookingEmailPayload } from '../../../../lib/bookingEmails';
import { calculateBookingTotal, getProduct } from '../../../../lib/buggyProducts';
import { capturePaypalOrder } from '../../../../lib/paypal';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { orderID, booking, reference } = (await request.json()) as {
      orderID?: string;
      booking?: BookingEmailPayload;
      reference?: string;
    };

    if (!orderID) {
      return NextResponse.json({ error: 'Falta la orden de PayPal.' }, { status: 400 });
    }

    const capture = await capturePaypalOrder(orderID);

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
    return NextResponse.json(
      { error: 'No pudimos confirmar el pago con PayPal. Revisa tu cuenta o contacta por WhatsApp.' },
      { status: 500 },
    );
  }
}
