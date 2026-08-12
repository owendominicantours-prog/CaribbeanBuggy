import { NextResponse } from 'next/server';
import {
  calculateBookingTotal,
  createBookingReference,
  getProduct,
} from '../../../../lib/buggyProducts';
import { upsertAdminRecord } from '../../../../lib/adminStore';
import { createPaypalOrder } from '../../../../lib/paypal';

export const runtime = 'nodejs';

type PayPalBookingPayload = {
  productId?: string;
  date?: string;
  passengers?: number;
  pickupZone?: string;
  hotel?: string;
  name?: string;
  phone?: string;
  email?: string;
  language?: string;
  pickupWindow?: string;
  paymentPreference?: string;
  photos?: boolean;
  privatePickup?: boolean;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PayPalBookingPayload;
    const product = payload.productId ? getProduct(payload.productId) : null;

    if (!product) {
      return NextResponse.json({ error: 'Producto no disponible.' }, { status: 400 });
    }

    if (!payload.date || !payload.hotel || !payload.name || !payload.phone || !payload.email) {
      return NextResponse.json({ error: 'Completa los datos de reserva antes de pagar.' }, { status: 400 });
    }

    const pricing = calculateBookingTotal({
      product,
      passengers: Number(payload.passengers || product.capacityNumber),
      pickupZone: String(payload.pickupZone || ''),
      photos: Boolean(payload.photos),
      privatePickup: Boolean(payload.privatePickup),
    });
    const reference = createBookingReference();
    const description = [
      product.title,
      payload.date,
      payload.pickupWindow,
      `${pricing.passengers} pax`,
      payload.hotel,
    ]
      .filter(Boolean)
      .join(' | ');

    const order = await createPaypalOrder({
      reference,
      description,
      amount: pricing.total,
    });

    await upsertAdminRecord({
      id: reference,
      reference,
      orderId: order.id,
      type: 'booking',
      source: 'paypal_checkout',
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productId: product.id,
      productName: product.title,
      customer: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      },
      booking: {
        date: payload.date,
        pickupWindow: payload.pickupWindow,
        hotel: payload.hotel,
        pickupZone: payload.pickupZone,
        passengers: pricing.passengers,
        language: payload.language,
        paymentPreference: payload.paymentPreference,
        photos: payload.photos,
        privatePickup: payload.privatePickup,
        total: pricing.total,
        vehicles: pricing.vehicles,
      },
      raw: { payload, pricing, paypalOrderId: order.id },
    });

    return NextResponse.json({
      id: order.id,
      reference,
      total: pricing.total,
      vehicles: pricing.vehicles,
    });
  } catch (error) {
    console.error('paypal_create_order_error', error);
    return NextResponse.json(
      { error: 'No pudimos iniciar el pago con PayPal. Intenta de nuevo o escribe por WhatsApp.' },
      { status: 500 },
    );
  }
}
