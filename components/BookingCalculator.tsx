'use client';

import { useMemo, useState } from 'react';
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
  const [language, setLanguage] = useState('Espanol');
  const [photos, setPhotos] = useState(false);
  const [privatePickup, setPrivatePickup] = useState(false);

  const selectedZone = pickupZones.find((zone) => zone.label === pickupZone) ?? pickupZones[0];
  const vehicles = Math.max(1, Math.ceil(passengers / product.capacityNumber));
  const baseTotal = vehicles * product.promo;
  const zoneFee = selectedZone.fee;
  const photosFee = photos ? 25 : 0;
  const privatePickupFee = privatePickup ? 30 : 0;
  const total = baseTotal + zoneFee + photosFee + privatePickupFee;

  const message = useMemo(
    () =>
      [
        `Hola Proactivitis, quiero reservar ${product.title} con Caribbean Buggy.`,
        '',
        `Fecha del tour: ${date || 'Por confirmar'}`,
        `Nombre del cliente: ${name || 'Por confirmar'}`,
        `Hotel o punto de recogida: ${hotel || 'Por confirmar'}`,
        `Zona: ${pickupZone}`,
        `Cantidad de personas: ${passengers}`,
        `Vehiculos necesarios: ${vehicles}`,
        `Idioma: ${language}`,
        `Extras: ${[photos ? 'Fotos del tour' : '', privatePickup ? 'Recogida privada' : ''].filter(Boolean).join(', ') || 'Sin extras'}`,
        `Total estimado web: US$${total}`,
        '',
        'Por favor confirmame disponibilidad, hora exacta de recogida y como completar la reserva por WhatsApp.',
      ].join('\n'),
    [date, hotel, language, name, passengers, photos, pickupZone, privatePickup, product.title, total, vehicles],
  );

  return (
    <div className="booking-widget">
      <div className="booking-widget-head">
        <span>Reserva inteligente</span>
        <strong>US${total}</strong>
        <small>Total estimado</small>
      </div>

      <div className="booking-breakdown">
        <p><b>{vehicles}</b> vehiculo(s) x US${product.promo}</p>
        <p>Base: <b>US${baseTotal}</b></p>
        {zoneFee ? <p>Zona: <b>US${zoneFee}</b></p> : null}
        {photosFee ? <p>Fotos: <b>US${photosFee}</b></p> : null}
        {privatePickupFee ? <p>Recogida privada: <b>US${privatePickupFee}</b></p> : null}
      </div>

      <label>Fecha del tour</label>
      <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />

      <label>Personas</label>
      <input
        min={1}
        max={20}
        type="number"
        value={passengers}
        onChange={(event) => setPassengers(Math.max(1, Number(event.target.value) || 1))}
      />

      <label>Hotel o punto de recogida</label>
      <input value={hotel} onChange={(event) => setHotel(event.target.value)} placeholder="Ej: Lopesan, Riu, Airbnb..." />

      <label>Zona</label>
      <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value)}>
        {pickupZones.map((zone) => (
          <option key={zone.label} value={zone.label}>
            {zone.label}{zone.fee ? ` +US$${zone.fee}` : ''}
          </option>
        ))}
      </select>

      <label>Nombre</label>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del cliente" />

      <label>Idioma</label>
      <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        <option>Espanol</option>
        <option>English</option>
        <option>Frances</option>
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

      <a className="booking-submit" href={whatsappHref(message)}>
        Confirmar reserva por WhatsApp
      </a>
      <p className="booking-note">El total es estimado. Proactivitis confirma disponibilidad, hora de recogida y precio final por WhatsApp.</p>
    </div>
  );
}
