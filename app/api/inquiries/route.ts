import { NextResponse } from 'next/server';

import { createAdminRecordId, upsertAdminRecord } from '../../../lib/adminStore';

export const runtime = 'nodejs';

function text(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as Record<string, any>;
    const booking = (payload.booking ?? payload) as Record<string, any>;
    const pricing = (payload.pricing ?? {}) as Record<string, any>;

    const record = await upsertAdminRecord({
      id: createAdminRecordId('INQ'),
      type: 'inquiry',
      source: text(payload.source) || 'website_inquiry',
      status: 'inquiry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productId: text(payload.productId) || text(booking.productId),
      productName: text(payload.productName),
      customer: {
        name: text(booking.name),
        email: text(booking.email),
        phone: text(booking.phone),
      },
      booking: {
        date: text(booking.date),
        pickupWindow: text(booking.pickupWindow),
        hotel: text(booking.hotel),
        pickupZone: text(booking.pickupZone),
        passengers: Number(booking.passengers) || undefined,
        language: text(booking.language),
        photos: Boolean(booking.photos),
        privatePickup: Boolean(booking.privatePickup),
        paymentPreference: text(booking.paymentPreference),
        total: Number(pricing.total) || undefined,
        vehicles: Number(pricing.vehicles) || undefined,
      },
      raw: payload,
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (error) {
    console.error('inquiry_store_error', error);
    return NextResponse.json({ error: 'No se pudo guardar la consulta.' }, { status: 500 });
  }
}
