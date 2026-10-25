import type { BookingEmailPayload, BookingPricing } from './bookingEmails';
import type { BuggyProduct } from './buggyProducts';

const escape = (value: unknown) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const money = (value: number) => `US$${value.toFixed(2)}`;
export function renderBookingEmail(input: {booking: BookingEmailPayload; pricing: BookingPricing; product: BuggyProduct; reference: string}, admin: boolean) {
  const {booking: b, pricing: p, product, reference} = input;
  const en = !admin && (b.locale ? b.locale === 'en' : /^(en|english|ingles)/i.test(b.language));
  const t = (es: string, eng: string) => en ? eng : es;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? new Intl.DateTimeFormat(en ? 'en-US' : 'es-DO', {dateStyle:'long', timeZone:'UTC'}).format(new Date(`${b.date}T12:00:00Z`)) : b.date;
  const turn = /ma[nñ]ana|morning/i.test(b.pickupWindow) ? t('Mañana', 'Morning') : /tarde|afternoon/i.test(b.pickupWindow) ? t('Tarde', 'Afternoon') : b.pickupWindow;
  const fleet = Object.entries(b.fleet || {}).filter(([,count])=>count > 0).map(([id,count]) => {
    const label = /individual/.test(id) ? t('buggy individual (1 plaza)', 'single buggy (1 seat)') : /familiar/.test(id) ? t('buggy familiar (4 plazas)', 'family buggy (4 seats)') : /doble/.test(id) ? t('buggy doble (2 plazas)', 'double buggy (2 seats)') : id;
    return `${count} × ${/bayahibe/.test(id) ? 'Bayahibe ' : ''}${label}`;
  }).join(' · ') || p.fleetSummary || `${p.vehicles} ${t('vehículos','vehicles')}`;
  const title = admin ? 'Nueva reserva pagada' : t('Tu reserva está confirmada', 'Your booking is confirmed');
  const intro = admin ? 'Pago recibido. La reserva está confirmada; coordinar la recogida con el cliente un día antes del tour.' : t(`Hola ${b.name}, recibimos tu pago. Este es tu e-ticket de Caribbean Buggy. Guárdalo para el día de tu aventura.`, `Hi ${b.name}, we received your payment. This is your Caribbean Buggy e-ticket. Save it for your adventure.`);
  const rows: [string, string | number][] = [
    [t('Referencia','Booking reference'), reference],
    [t('Experiencia','Experience'), /bayahibe/.test(product.id) ? t('Aventura en buggy en Bayahibe / La Romana','Bayahibe / La Romana buggy adventure') : t('Tour en buggy: cenote y Playa Macao','Buggy tour: cenote & Macao Beach')],
    [t('Fecha del tour','Tour date'),date], [t('Turno elegido','Selected session'),turn],
    [t('Hotel / alojamiento','Hotel / accommodation'), b.hotel || t('No indicado','Not provided')],
    [t('Zona de recogida','Pickup area'), b.pickupZone],
    [t('Viajeros','Travelers'),p.passengers], [t('Vehículos reservados','Vehicles booked'), p.vehicles],
    [t('Distribución de buggies','Your buggy selection'),fleet],
    [t('Idioma solicitado para el tour','Requested tour language'),b.language],
    [t('Tour','Tour subtotal'),money(p.baseTotal)],
  ];
  if(p.zoneFee) rows.push([t('Suplemento de recogida','Pickup supplement'),money(p.zoneFee)]);
  if(b.photos && p.photosFee) rows.push([t('Fotos','Photos'),money(p.photosFee)]);
  if(b.privatePickup && p.privatePickupFee) rows.push([t('Recogida privada','Private pickup'),money(p.privatePickupFee)]);
  rows.push([t('Total pagado','Total paid'), money(p.total)], [t('Estado','Status'),t('PAGADO · CONFIRMADO','PAID · CONFIRMED')]);
  if(admin) rows.unshift(['Web de origen','Caribbean Buggy · www.caribbeanboggie.com'],['Cliente',b.name],['Correo',b.email],['WhatsApp',b.phone]);
  const pickup = t('Te escribiremos un día antes del tour para comunicarte la hora exacta y el punto de recogida. El turno elegido no es la hora de recogida en tu hotel. No necesitas esperar otra aprobación: tu reserva ya está confirmada.', 'We will contact you one day before your tour with your exact pickup time and meeting point. Your selected session is not your hotel pickup time. Your booking is already confirmed; no further approval is needed.');
  const note = admin ? 'Un día antes: comunicar hora y punto de recogida, verificar el hotel y organizar los vehículos indicados. No solicitar una segunda confirmación de la reserva.' : pickup;
  const wa = admin ? `https://wa.me/${b.phone.replace(/\D/g,'')}` : 'https://wa.me/18295539900';
  const subject = `${admin ? 'Reserva pagada' : t('E-ticket confirmado','Confirmed e-ticket')} · ${reference} · Caribbean Buggy`;
  const html = `<!doctype html><html lang="${en?'en':'es'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#14213a"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:24px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:auto;background:#fff;border:1px solid #dde5ed"><tr><td style="background:#071329;color:#fff;padding:28px"><div style="color:#a7e7e1;font-size:13px;font-weight:bold">CARIBBEAN BUGGY</div><h1 style="font-size:25px;line-height:1.3;margin:12px 0">${title}</h1><div>${escape(reference)}</div></td></tr><tr><td style="padding:24px"><p style="line-height:1.6">${escape(intro)}</p><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows.map(([label,value])=>`<tr><td width="38%" style="padding:12px 8px 12px 0;border-bottom:1px solid #e5eaf0;vertical-align:top;color:#58677b;font-size:14px">${escape(label)}</td><td style="padding:12px 0;border-bottom:1px solid #e5eaf0;vertical-align:top;font-weight:bold;font-size:14px;word-break:break-word">${escape(value)}</td></tr>`).join('')}</table><div style="background:#eef8f6;padding:18px;margin-top:24px;line-height:1.6"><b>${t('Recogida y próximos pasos','Pickup & next steps')}</b><p style="margin:8px 0 0">${escape(note)}</p></div><p style="margin:24px 0"><a href="${escape(wa)}" style="background:#007f73;color:white;padding:12px 18px;display:inline-block;text-decoration:none;font-weight:bold">${admin?'Contactar al cliente por WhatsApp':t('¿Tienes una pregunta? Escríbenos','Questions? Contact us')}</a></p><p style="font-size:13px;line-height:1.6;color:#58677b">info@proactivitis.com · +1 829-553-9900<br><a href="https://www.caribbeanboggie.com">www.caribbeanboggie.com</a></p></td></tr></table></td></tr></table></body></html>`;
  const text = ['CARIBBEAN BUGGY',title, intro,'',...rows.map(([label,value])=>`${label}: ${value}`),'',note,'',`${admin?'WhatsApp del cliente':'WhatsApp'}: ${wa}`,'info@proactivitis.com','https://www.caribbeanboggie.com'].join('\n');
  return {subject, html, text};
}
