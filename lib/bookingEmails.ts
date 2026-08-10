import type { BuggyProduct } from './buggyProducts';
import { proactivitisPhone, siteUrl } from './buggyProducts';
import { sendEmail } from './email';

export type BookingEmailPayload = {
  productId: string;
  date: string;
  passengers: number;
  pickupZone: string;
  hotel: string;
  name: string;
  phone: string;
  email: string;
  language: string;
  pickupWindow: string;
  paymentPreference: string;
  photos: boolean;
  privatePickup: boolean;
};

export type BookingPricing = {
  passengers: number;
  vehicles: number;
  baseTotal: number;
  zoneFee: number;
  photosFee: number;
  privatePickupFee: number;
  total: number;
};

function money(value: number) {
  return `US$${value.toFixed(2)}`;
}

function escapeHtml(value: string | number | boolean | null | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string | number | boolean) {
  return `<tr><td style="padding:8px 0;color:#64748b">${escapeHtml(label)}</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#0f172a">${escapeHtml(value)}</td></tr>`;
}

export async function sendPaidBookingEmails({
  booking,
  product,
  pricing,
  orderId,
  reference,
}: {
  booking: BookingEmailPayload;
  product: BuggyProduct;
  pricing: BookingPricing;
  orderId: string;
  reference: string;
}) {
  const adminTo = process.env.BOOKING_EMAIL_TO ?? 'info@proactivitis.com';
  const extras = [
    booking.photos ? `Fotos del tour (${money(pricing.photosFee)})` : '',
    booking.privatePickup ? `Recogida privada (${money(pricing.privatePickupFee)})` : '',
  ]
    .filter(Boolean)
    .join(', ') || 'Sin extras';

  const adminRows = [
    row('Referencia', reference),
    row('PayPal Order', orderId),
    row('Producto', product.title),
    row('Fecha', booking.date),
    row('Turno', booking.pickupWindow),
    row('Cliente', booking.name),
    row('Email', booking.email),
    row('WhatsApp', booking.phone),
    row('Hotel / pickup', booking.hotel),
    row('Zona', booking.pickupZone),
    row('Personas', pricing.passengers),
    row('Vehiculos', pricing.vehicles),
    row('Idioma', booking.language),
    row('Extras', extras),
    row('Base', money(pricing.baseTotal)),
    row('Suplemento zona', money(pricing.zoneFee)),
    row('Total cobrado', money(pricing.total)),
  ].join('');

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;background:#eef5fb;padding:28px">
      <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden">
        <div style="background:#071329;color:#fff;padding:26px 30px">
          <p style="letter-spacing:5px;text-transform:uppercase;margin:0 0 8px;color:#93c5fd;font-size:12px">Operacion Caribbean Buggy</p>
          <h1 style="margin:0;font-size:28px">Nueva reserva pagada</h1>
          <p style="margin:12px 0 0;color:#dbeafe">Reserva lista para coordinar recogida y horario.</p>
        </div>
        <div style="padding:28px 30px">
          <h2 style="margin:0 0 12px;color:#0f172a">${escapeHtml(reference)}</h2>
          <table style="width:100%;border-collapse:collapse">${adminRows}</table>
          <div style="margin-top:24px;padding:16px;border:1px dashed #cbd5e1;border-radius:14px">
            <b>Acciones:</b> confirmar pickup, enviar hora exacta al cliente y registrar operacion.
          </div>
        </div>
      </div>
    </div>
  `;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:28px">
      <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px">
        <p style="letter-spacing:4px;text-transform:uppercase;color:#2563eb;font-size:12px;margin:0 0 8px">Caribbean Buggy</p>
        <h1 style="margin:0 0 12px;color:#0f172a">Reserva recibida</h1>
        <p style="color:#475569;line-height:1.6">Hola ${escapeHtml(booking.name)}, recibimos tu pago para ${escapeHtml(product.title)}. Nuestro equipo confirmara por WhatsApp tu hora exacta y punto de recogida.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:18px">
          ${row('Referencia', reference)}
          ${row('Fecha', booking.date)}
          ${row('Turno', booking.pickupWindow)}
          ${row('Hotel / pickup', booking.hotel)}
          ${row('Personas', pricing.passengers)}
          ${row('Total', money(pricing.total))}
        </table>
        <p style="margin-top:22px;color:#475569">Soporte: ${escapeHtml(proactivitisPhone)} · ${escapeHtml(siteUrl)}</p>
      </div>
    </div>
  `;

  const adminText = [
    'Nueva reserva pagada Caribbean Buggy',
    `Referencia: ${reference}`,
    `PayPal Order: ${orderId}`,
    `Producto: ${product.title}`,
    `Fecha: ${booking.date}`,
    `Turno: ${booking.pickupWindow}`,
    `Cliente: ${booking.name}`,
    `Email: ${booking.email}`,
    `WhatsApp: ${booking.phone}`,
    `Hotel: ${booking.hotel}`,
    `Zona: ${booking.pickupZone}`,
    `Personas: ${pricing.passengers}`,
    `Vehiculos: ${pricing.vehicles}`,
    `Extras: ${extras}`,
    `Total: ${money(pricing.total)}`,
  ].join('\n');

  await Promise.allSettled([
    sendEmail({
      to: adminTo,
      subject: `Nueva reserva pagada ${reference} - ${product.title}`,
      html: adminHtml,
      text: adminText,
      replyTo: booking.email,
    }),
    sendEmail({
      to: booking.email,
      subject: `Reserva recibida ${reference} - Caribbean Buggy`,
      html: customerHtml,
      text: `Reserva recibida ${reference}. Producto: ${product.title}. Fecha: ${booking.date}. Total: ${money(pricing.total)}. Te confirmaremos por WhatsApp.`,
    }),
  ]);
}
