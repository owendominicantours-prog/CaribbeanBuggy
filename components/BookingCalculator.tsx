'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, CreditCard, Loader2, LockKeyhole, MessageCircle } from 'lucide-react';
import type { BuggyProduct } from '../lib/buggyProducts';
import { calculateBookingTotal, pickupZones, whatsappHref } from '../lib/buggyProducts';

type BookingCalculatorProps = {
  product: BuggyProduct;
};

type PayPalActions = {
  order: {
    create: () => Promise<string>;
    capture?: () => Promise<unknown>;
  };
};

type PayPalButtonsOptions = {
  style?: Record<string, string>;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID?: string }, actions: PayPalActions) => Promise<void>;
  onError: (error: unknown) => void;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: PayPalButtonsOptions) => {
        render: (selector: HTMLElement) => Promise<void>;
      };
    };
    dataLayer?: Array<Record<string, unknown>>;
  }
}

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
  const [paymentPreference, setPaymentPreference] = useState('Pagar total ahora');
  const [photos, setPhotos] = useState(false);
  const [privatePickup, setPrivatePickup] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'paid'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [renderToken, setRenderToken] = useState(0);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const minDate = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Santo_Domingo',
  });
  const pricing = calculateBookingTotal({
    product,
    passengers,
    pickupZone,
    photos,
    privatePickup,
  });
  const total = pricing.total;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setPaymentError('PayPal aun no esta configurado en esta instalacion.');
      return;
    }

    if (window.paypal) {
      setPaypalReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-caribbean-paypal]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setPaypalReady(true), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&components=buttons&enable-funding=card`;
    script.async = true;
    script.dataset.caribbeanPaypal = 'true';
    script.onload = () => setPaypalReady(true);
    script.onerror = () => setPaymentError('No pudimos cargar PayPal. Intenta de nuevo o contacta por WhatsApp.');
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!showPayment || !paypalReady || !paypalContainerRef.current || paymentStatus === 'paid') return;

    paypalContainerRef.current.innerHTML = '';
    setPaymentError('');

    window.paypal
      ?.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay',
        },
        createOrder: async () => {
          setPaymentStatus('loading');
          const response = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildPayload()),
          });
          const data = (await response.json()) as {
            id?: string;
            reference?: string;
            error?: string;
          };

          if (!response.ok || !data.id) {
            throw new Error(data.error || 'No se pudo crear la orden de PayPal.');
          }

          if (data.reference) setBookingReference(data.reference);
          return data.id;
        },
        onApprove: async (data) => {
          const response = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const capture = (await response.json()) as { error?: string; status?: string };

          if (!response.ok) {
            throw new Error(capture.error || 'No se pudo capturar el pago.');
          }

          window.dataLayer?.push({
            event: 'purchase',
            transaction_id: data.orderID,
            booking_reference: bookingReference,
            product_id: product.id,
            product_name: product.title,
            value: total,
            currency: 'USD',
            passengers,
          });
          setPaymentStatus('paid');
        },
        onError: (error) => {
          console.error('paypal_checkout_error', error);
          setPaymentStatus('idle');
          setPaymentError('PayPal no pudo completar el pago. Puedes intentar otra tarjeta o escribir por WhatsApp.');
        },
      })
      .render(paypalContainerRef.current)
      .catch((error) => {
        console.error('paypal_render_error', error);
        setPaymentStatus('idle');
        setPaymentError('No pudimos mostrar el formulario de pago. Intenta de nuevo.');
      });
  }, [showPayment, paypalReady, renderToken, paymentStatus]);

  function buildPayload() {
    return {
      productId: product.id,
      date,
      passengers,
      pickupZone,
      hotel: hotel.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      language,
      pickupWindow,
      paymentPreference,
      photos,
      privatePickup,
    };
  }

  function bookingMessage(reference = bookingReference || 'Pendiente') {
    const extras =
      [photos ? 'Fotos del tour' : '', privatePickup ? 'Recogida privada' : '']
        .filter(Boolean)
        .join(', ') || 'Sin extras';

    return [
      `Hola Proactivitis, necesito ayuda con ${product.title} en Caribbean Buggy.`,
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
      `Vehiculos necesarios: ${pricing.vehicles}`,
      `Idioma: ${language}`,
      `Extras: ${extras}`,
      `Preferencia de pago: ${paymentPreference}`,
      `Total estimado web: US$${total}`,
    ].join('\n');
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPayment(true);
    setPaymentStatus('idle');
    setPaymentError('');
    setRenderToken(Date.now());
    window.dataLayer?.push({
      event: 'begin_checkout',
      product_id: product.id,
      product_name: product.title,
      value: total,
      currency: 'USD',
      passengers,
    });
  };

  return (
    <form className="booking-widget" onSubmit={handleSubmit}>
      <div className="booking-widget-head">
        <span>Reserva segura</span>
        <strong>US${total}</strong>
        <small>Total calculado para {passengers} persona(s)</small>
      </div>

      <div className="booking-breakdown" aria-live="polite">
        <p><b>{pricing.vehicles}</b> vehiculo(s) x US${product.promo}</p>
        <p>Base: <b>US${pricing.baseTotal}</b></p>
        {pricing.zoneFee ? <p>Zona: <b>US${pricing.zoneFee}</b></p> : null}
        {pricing.photosFee ? <p>Fotos: <b>US${pricing.photosFee}</b></p> : null}
        {pricing.privatePickupFee ? <p>Recogida privada: <b>US${pricing.privatePickupFee}</b></p> : null}
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

      <label>Forma de pago</label>
      <select
        value={paymentPreference}
        onChange={(event) => setPaymentPreference(event.target.value)}
      >
        <option>Pagar total ahora</option>
        <option>Intentar tarjeta primero</option>
        <option>Necesito ayuda antes de pagar</option>
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

      <button className="booking-submit" type="submit" disabled={paymentStatus === 'loading'}>
        {paymentStatus === 'loading' ? <Loader2 className="spin" size={19} /> : <CreditCard size={19} />}
        Pagar seguro con tarjeta o PayPal
      </button>

      {showPayment ? (
        <div className="paypal-panel">
          {paymentStatus === 'paid' ? (
            <div className="payment-success">
              <CheckCircle2 size={22} />
              <b>Pago recibido.</b>
              <span>Te contactaremos para confirmar recogida y hora exacta.</span>
            </div>
          ) : (
            <>
              <b>Elige tarjeta, PayPal o metodo disponible.</b>
              <span>PayPal puede mostrar pago directo con tarjeta segun tu pais y navegador.</span>
              <div ref={paypalContainerRef} className="paypal-buttons" />
              {!paypalReady && !paymentError ? <p className="booking-note">Cargando pago seguro...</p> : null}
            </>
          )}
          {paymentError ? <p className="payment-error">{paymentError}</p> : null}
        </div>
      ) : null}

      <a className="booking-support-link" href={whatsappHref(bookingMessage())}>
        <MessageCircle size={18} /> Ayuda por WhatsApp
      </a>
      <div className="booking-assurance">
        <span><CheckCircle2 size={15} /> Pago protegido por PayPal</span>
        <span><LockKeyhole size={15} /> Datos de tarjeta procesados fuera de nuestra web</span>
      </div>
      <p className="booking-note">
        Despues del pago confirmamos disponibilidad, hora de recogida y detalles operativos por WhatsApp o correo.
      </p>
    </form>
  );
}
