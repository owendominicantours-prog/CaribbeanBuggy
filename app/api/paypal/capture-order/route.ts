import { NextResponse } from 'next/server';
import { capturePaypalOrder } from '../../../../lib/paypal';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { orderID } = (await request.json()) as { orderID?: string };

    if (!orderID) {
      return NextResponse.json({ error: 'Falta la orden de PayPal.' }, { status: 400 });
    }

    const capture = await capturePaypalOrder(orderID);
    return NextResponse.json(capture);
  } catch (error) {
    console.error('paypal_capture_order_error', error);
    return NextResponse.json(
      { error: 'No pudimos confirmar el pago con PayPal. Revisa tu cuenta o contacta por WhatsApp.' },
      { status: 500 },
    );
  }
}
