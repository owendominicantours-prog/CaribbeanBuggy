import { NextResponse } from 'next/server';

import { createAdminRecordId, upsertAdminRecord } from '../../../lib/adminStore';
import { notifyCommandCenter } from '../../../lib/commandCenter';

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

    await notifyCommandCenter({
      kind: 'MESSAGE',
      sourceSite: 'caribbean-buggy',
      sourceBrand: 'Caribbean Buggy',
      externalId: record.id,
      customer: record.customer,
      title: record.productName || 'Reserva de buggy',
      body: `Fecha: ${record.booking?.date || 'Pendiente'}. Hotel: ${record.booking?.hotel || 'Pendiente'}. Pasajeros: ${record.booking?.passengers || 'Pendiente'}. Preferencia de pago: ${record.booking?.paymentPreference || 'Pendiente'}.`,
      amount: record.booking?.total,
      currency: 'USD',
      eventAt: record.booking?.date || record.createdAt,
      message: { id: record.id, channel: 'website', pageUrl: 'https://www.caribbeanboggie.com/' },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch (error) {
    console.error('inquiry_store_error', error);
    return NextResponse.json({ error: 'No se pudo guardar la consulta.' }, { status: 500 });
  }
}
