'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, LockKeyhole, MessageCircle } from 'lucide-react';
import type { BuggyProduct } from '../lib/buggyProducts';
import { whatsappHref } from '../lib/buggyProducts';

type BookingCalculatorProps = {
  product: BuggyProduct;
};

const pickupZones = [
  { label: 'Bavaro / Punta Cana', fee: 0 },
  { label: 'Cabeza de Toro', fee: 0 },
  { label: 'Cap Cana', fee: 10 },
  { label: 'Uvero Alto', fee: 15 },
  { label: 'Macao', fee: 0 },
  { label: 'Otra zona - confirmar por WhatsApp', fee: 0 },
];

export default function BookingCalculator({ product }: BookingCalculatorProps) {
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(product.capacityNumber);
  const [pickupZone, setPickupZone] = useState(pickupZones[0].label);
  const [hotel, setHotel] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('Espanol');
  const [pickupWindow, setPickupWindow] = useState('Primera salida disponible');
  const [paymentPreference, setPaymentPreference] = useState('Confirmar disponibilidad primero');
  const [photos, setPhotos] = useState(false);
  const [privatePickup, setPrivatePickup] = useState(false);

  const minDate = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Santo_Domingo',
  });
  const selectedZone = pickupZones.find((zone) => zone.label === pickupZone) ?? pickupZones[0];
  const vehicles = Math.max(1, Math.ceil(passengers / product.capacityNumber));
  const baseTotal = vehicles * product.promo;
  const zoneFee = selectedZone.fee;
  const photosFee = photos ? 25 : 0;
  const privatePickupFee = privatePickup ? 30 : 0;
  const total = baseTotal + zoneFee + photosFee + privatePickupFee;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reference = `CB-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    const extras =
      [photos ? 'Fotos del tour' : '', privatePickup ? 'Recogida privada' : '']
        .filter(Boolean)
        .join(', ') || 'Sin extras';
    const message = [
      `Hola Proactivitis, quiero solicitar ${product.title} con Caribbean Buggy.`,
      `Referencia web: ${reference}`,
      '',
      `Fecha del tour: ${date}`,
      `Turno preferido: ${pickupWindow}`,
      `Nombre del cliente: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      `Correo: ${email.trim()}`,
      `Hotel o punto de recogida: ${hotel.trim()}`,
      `Zona: ${pickupZone}`,
      `Cantidad de personas: ${passengers}`,
      `Vehiculos necesarios: ${vehicles}`,
      `Idioma: ${language}`,
      `Extras: ${extras}`,
      `Preferencia de pago: ${paymentPreference}`,
      `Total estimado web: US$${total}`,
      '',
      'Por favor confirma disponibilidad, hora exacta de recogida y el enlace seguro para completar el pago.',
    ].join('\n');

    const dataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
    dataLayer?.push({
      event: 'begin_booking',
      booking_reference: reference,
      product_id: product.id,
      product_name: product.title,
      value: total,
      currency: 'USD',
      passengers,
    });

    window.location.href = whatsappHref(message);
  };

  return (
    <form className="booking-widget" onSubmit={handleSubmit}>
      <div className="booking-widget-head">
        <span>Solicitud de reserva</span>
        <strong>US${total}</strong>
        <small>Total calculado para {passengers} persona(s)</small>
      </div>

      <div className="booking-breakdown" aria-live="polite">
        <p><b>{vehicles}</b> vehiculo(s) x US${product.promo}</p>
        <p>Base: <b>US${baseTotal}</b></p>
        {zoneFee ? <p>Zona: <b>US${zoneFee}</b></p> : null}
        {photosFee ? <p>Fotos: <b>US${photosFee}</b></p> : null}
        {privatePickupFee ? <p>Recogida privada: <b>US${privatePickupFee}</b></p> : null}
      </div>

      <label>Fecha del tour</label>
      <input
        type="date"
        min={minDate}
        required
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      <label>Personas</label>
      <input
        min={1}
        max={20}
        type="number"
        required
        value={passengers}
        onChange={(event) => setPassengers(Math.max(1, Number(event.target.value) || 1))}
      />

      <label>Hotel o punto de recogida</label>
      <input
        value={hotel}
        required
        onChange={(event) => setHotel(event.target.value)}
        placeholder="Ej: Lopesan, Riu, Airbnb..."
      />

      <label>Zona</label>
      <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value)}>
        {pickupZones.map((zone) => (
          <option key={zone.label} value={zone.label}>
            {zone.label}{zone.fee ? ` +US$${zone.fee}` : ''}
          </option>
        ))}
      </select>

      <label>Turno preferido</label>
      <select value={pickupWindow} onChange={(event) => setPickupWindow(event.target.value)}>
        <option>Primera salida disponible</option>
        <option>Manana</option>
        <option>Mediodia</option>
        <option>Tarde</option>
      </select>

      <label>Nombre y apellido</label>
      <input
        value={name}
        required
        autoComplete="name"
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre completo del cliente"
      />

      <div className="booking-contact-grid">
        <div>
          <label htmlFor={`phone-${product.id}`}>Numero de WhatsApp</label>
          <input
            id={`phone-${product.id}`}
            value={phone}
            required
            type="tel"
            autoComplete="tel"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+1 809 000 0000"
          />
        </div>
        <div>
          <label htmlFor={`email-${product.id}`}>Correo electronico</label>
          <input
            id={`email-${product.id}`}
            value={email}
            required
            type="email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="cliente@email.com"
          />
        </div>
      </div>

      <label>Idioma</label>
      <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        <option>Espanol</option>
        <option>English</option>
        <option>Frances</option>
      </select>

      <label>Como prefieres completar el pago</label>
      <select
        value={paymentPreference}
        onChange={(event) => setPaymentPreference(event.target.value)}
      >
        <option>Confirmar disponibilidad primero</option>
        <option>Pagar un deposito</option>
        <option>Pagar el total</option>
      </select>

      <div className="extras">
        <label>
          <input type="checkbox" checked={photos} onChange={(event) => setPhotos(event.target.checked)} />
          Fotos del tour +US$25
        </label>
        <label>
          <input type="checkbox" checked={privatePickup} onChange={(event) => setPrivatePickup(event.target.checked)} />
          Recogida privada +US$30
        </label>
      </div>

      <button className="booking-submit" type="submit">
        <MessageCircle size={19} /> Enviar solicitud por WhatsApp
      </button>
      <div className="booking-assurance">
        <span><CheckCircle2 size={15} /> Datos completos para confirmar mas rapido</span>
        <span><LockKeyhole size={15} /> No se cobra ninguna tarjeta en este formulario</span>
      </div>
      <p className="booking-note">
        El equipo confirma disponibilidad, hora de recogida y precio final antes de enviarte un enlace de pago seguro.
      </p>
    </form>
  );
}
