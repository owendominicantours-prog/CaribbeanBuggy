'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, CreditCard, Loader2, LockKeyhole, MessageCircle } from 'lucide-react';
import type { BuggyProduct } from '../lib/buggyProducts';
import { calculateBookingTotal, pickupZones, whatsappHref } from '../lib/buggyProducts';

type BookingCalculatorProps = {
  product: BuggyProduct;
  defaultHotel?: string;
  defaultPickupZone?: string;
  locale?: 'es' | 'en';
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

export default function BookingCalculator({ product, defaultHotel = '', defaultPickupZone, locale = 'es' }: BookingCalculatorProps) {
  const copy = locale === 'en'
    ? {
        secure: 'Secure booking',
        calculated: 'Calculated total for',
        people: 'traveler(s)',
        vehicles: 'vehicle(s)',
        base: 'Base',
        zone: 'Zone',
        date: 'Tour date',
        passengers: 'Travelers',
        hotel: 'Hotel or pickup point',
        hotelPlaceholder: 'Ex: Lopesan, Riu, Airbnb...',
        pickupZone: 'Pickup zone',
        pickupWindow: 'Preferred pickup window',
        first: 'First available departure',
        morning: 'Morning',
        midday: 'Midday',
        afternoon: 'Afternoon',
        name: 'Full name',
        namePlaceholder: 'Customer full name',
        phone: 'WhatsApp number',
        email: 'Email address',
        emailPlaceholder: 'customer@email.com',
        language: 'Language',
        spanish: 'Spanish',
        french: 'French',
        payment: 'Payment option',
        payNow: 'Pay in full now',
        cardFirst: 'Try card first',
        helpFirst: 'I need help before paying',
        payButton: 'Pay safely by card or PayPal',
        paidTitle: 'Payment received.',
        paidText: 'We will contact you to confirm pickup and exact time.',
        choosePayment: 'Choose card, PayPal or any available method.',
        paypalCard: 'PayPal may show direct card payment depending on your country and browser.',
        loading: 'Loading secure payment...',
        help: 'WhatsApp support',
        protected: 'Payment protected by PayPal',
        external: 'Card details are processed outside our website',
        note: 'After payment we confirm availability, pickup time and operational details by WhatsApp or email.',
        notConfigured: 'PayPal is not configured in this installation yet.',
        loadError: 'We could not load PayPal. Try again or contact us on WhatsApp.',
        createError: 'We could not create the PayPal order.',
        captureError: 'We could not capture the payment.',
        paymentError: 'PayPal could not complete the payment. You can try another card or contact us on WhatsApp.',
        renderError: 'We could not show the payment form. Try again.',
        messageIntro: `Hello Proactivitis, I need help with ${product.title} on Caribbean Buggy.`,
        reference: 'Web reference',
        tourDate: 'Tour date',
        preferred: 'Preferred time',
        customer: 'Customer name',
        pickup: 'Hotel or pickup point',
        qty: 'Travelers',
        needed: 'Vehicles needed',
        paymentPreference: 'Payment preference',
        estimatedTotal: 'Estimated web total',
      }
    : {
        secure: 'Reserva segura',
        calculated: 'Total calculado para',
        people: 'persona(s)',
        vehicles: 'vehiculo(s)',
        base: 'Base',
        zone: 'Zona',
        date: 'Fecha del tour',
        passengers: 'Personas',
        hotel: 'Hotel o punto de recogida',
        hotelPlaceholder: 'Ej: Lopesan, Riu, Airbnb...',
        pickupZone: 'Zona',
        pickupWindow: 'Turno preferido',
        first: 'Primera salida disponible',
        morning: 'Manana',
        midday: 'Mediodia',
        afternoon: 'Tarde',
        name: 'Nombre y apellido',
        namePlaceholder: 'Nombre completo del cliente',
        phone: 'Numero de WhatsApp',
        email: 'Correo electronico',
        emailPlaceholder: 'cliente@email.com',
        language: 'Idioma',
        spanish: 'Espanol',
        french: 'Frances',
        payment: 'Forma de pago',
        payNow: 'Pagar total ahora',
        cardFirst: 'Intentar tarjeta primero',
        helpFirst: 'Necesito ayuda antes de pagar',
        payButton: 'Pagar seguro con tarjeta o PayPal',
        paidTitle: 'Pago recibido.',
        paidText: 'Te contactaremos para confirmar recogida y hora exacta.',
        choosePayment: 'Elige tarjeta, PayPal o metodo disponible.',
        paypalCard: 'PayPal puede mostrar pago directo con tarjeta segun tu pais y navegador.',
        loading: 'Cargando pago seguro...',
        help: 'Ayuda por WhatsApp',
        protected: 'Pago protegido por PayPal',
        external: 'Datos de tarjeta procesados fuera de nuestra web',
        note: 'Despues del pago confirmamos disponibilidad, hora de recogida y detalles operativos por WhatsApp o correo.',
        notConfigured: 'PayPal aun no esta configurado en esta instalacion.',
        loadError: 'No pudimos cargar PayPal. Intenta de nuevo o contacta por WhatsApp.',
        createError: 'No se pudo crear la orden de PayPal.',
        captureError: 'No se pudo capturar el pago.',
        paymentError: 'PayPal no pudo completar el pago. Puedes intentar otra tarjeta o escribir por WhatsApp.',
        renderError: 'No pudimos mostrar el formulario de pago. Intenta de nuevo.',
        messageIntro: `Hola Proactivitis, necesito ayuda con ${product.title} en Caribbean Buggy.`,
        reference: 'Referencia web',
        tourDate: 'Fecha del tour',
        preferred: 'Turno preferido',
        customer: 'Nombre del cliente',
        pickup: 'Hotel o punto de recogida',
        qty: 'Cantidad de personas',
        needed: 'Vehiculos necesarios',
        paymentPreference: 'Preferencia de pago',
        estimatedTotal: 'Total estimado web',
      };
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(product.capacityNumber);
  const [pickupZone, setPickupZone] = useState(defaultPickupZone || pickupZones[0].label);
  const [hotel, setHotel] = useState(defaultHotel);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState(locale === 'en' ? 'English' : copy.spanish);
  const [pickupWindow, setPickupWindow] = useState(copy.first);
  const [paymentPreference, setPaymentPreference] = useState(copy.payNow);
  const [paypalReady, setPaypalReady] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'paid'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [renderToken, setRenderToken] = useState(0);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [stepNotice, setStepNotice] = useState('');
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const bookingReferenceRef = useRef('');

  const minDate = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Santo_Domingo',
  });
  const pricing = calculateBookingTotal({
    product,
    passengers,
    pickupZone,
    photos: false,
    privatePickup: false,
  });
  const total = pricing.total;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setPaymentError(copy.notConfigured);
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
    script.onerror = () => setPaymentError(copy.loadError);
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
            throw new Error(data.error || copy.createError);
          }

          if (data.reference) {
            bookingReferenceRef.current = data.reference;
            setBookingReference(data.reference);
          }
          return data.id;
        },
        onApprove: async (data) => {
          const response = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderID: data.orderID,
              reference: bookingReferenceRef.current || bookingReference,
              booking: buildPayload(),
            }),
          });
          const capture = (await response.json()) as { error?: string; status?: string };

          if (!response.ok) {
            throw new Error(capture.error || copy.captureError);
          }

          window.dataLayer?.push({
            event: 'purchase',
            transaction_id: data.orderID,
            booking_reference: bookingReferenceRef.current || bookingReference,
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
          setPaymentError(copy.paymentError);
        },
      })
      .render(paypalContainerRef.current)
      .catch((error) => {
        console.error('paypal_render_error', error);
        setPaymentStatus('idle');
        setPaymentError(copy.renderError);
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
      photos: false,
      privatePickup: false,
    };
  }

  function bookingMessage(reference = bookingReference || 'Pendiente') {
    return [
      copy.messageIntro,
      `${copy.reference}: ${reference}`,
      '',
      `${copy.tourDate}: ${date}`,
      `${copy.preferred}: ${pickupWindow}`,
      `${copy.customer}: ${name.trim()}`,
      `WhatsApp: ${phone.trim()}`,
      `Email: ${email.trim()}`,
      `${copy.pickup}: ${hotel.trim()}`,
      `${copy.zone}: ${pickupZone}`,
      `${copy.qty}: ${passengers}`,
      `${copy.needed}: ${pricing.vehicles}`,
      `${copy.language}: ${language}`,
      `${copy.paymentPreference}: ${paymentPreference}`,
      `${copy.estimatedTotal}: US$${total}`,
    ].join('\n');
  }

  async function recordWhatsAppInquiry() {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'booking_whatsapp_button',
          productId: product.id,
          productName: product.title,
          booking: buildPayload(),
          pricing: {
            total,
            vehicles: pricing.vehicles,
            passengers: pricing.passengers,
            baseTotal: pricing.baseTotal,
            zoneFee: pricing.zoneFee,
            photosFee: pricing.photosFee,
            privatePickupFee: pricing.privatePickupFee,
          },
        }),
      });
    } catch (error) {
      console.error('booking_whatsapp_inquiry_error', error);
    }
  }

  const stepLabels = locale === 'en'
    ? ['Tour details', 'Contact', 'Confirm']
    : ['Tour', 'Contacto', 'Confirmar'];

  const stepText = locale === 'en'
    ? {
        missingTrip: 'Choose the date and pickup point before continuing.',
        missingContact: 'Add your name, WhatsApp and email before confirming.',
        next: 'Continue',
        back: 'Back',
        reviewTitle: 'Review and reserve',
        reviewText: 'Confirm the details, then open secure payment or contact us on WhatsApp.',
        editTrip: 'Edit tour',
        editContact: 'Edit contact',
        summaryDate: 'Date',
        summaryPickup: 'Pickup',
        summaryTravelers: 'Travelers',
        summaryTime: 'Pickup window',
      }
    : {
        missingTrip: 'Elige la fecha y el punto de recogida antes de continuar.',
        missingContact: 'Agrega nombre, WhatsApp y correo antes de confirmar.',
        next: 'Continuar',
        back: 'Volver',
        reviewTitle: 'Revisa y reserva',
        reviewText: 'Confirma los datos y luego abre el pago seguro o escribenos por WhatsApp.',
        editTrip: 'Editar tour',
        editContact: 'Editar contacto',
        summaryDate: 'Fecha',
        summaryPickup: 'Recogida',
        summaryTravelers: 'Personas',
        summaryTime: 'Turno',
      };

  function goToStep(step: 1 | 2 | 3) {
    if (step > 1 && (!date || !hotel.trim())) {
      setBookingStep(1);
      setStepNotice(stepText.missingTrip);
      window.dataLayer?.push({
        event: 'booking_validation_error',
        product_id: product.id,
        field_group: 'tour_details',
      });
      return;
    }

    if (step > 2 && (!name.trim() || !phone.trim() || !email.trim())) {
      setBookingStep(2);
      setStepNotice(stepText.missingContact);
      window.dataLayer?.push({
        event: 'booking_validation_error',
        product_id: product.id,
        field_group: 'contact_details',
      });
      return;
    }

    setBookingStep(step);
    setStepNotice('');
    window.dataLayer?.push({
      event: 'booking_step_view',
      product_id: product.id,
      booking_step: step,
      value: total,
      currency: 'USD',
    });
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date || !hotel.trim()) {
      goToStep(1);
      return;
    }

    if (!name.trim() || !phone.trim() || !email.trim()) {
      goToStep(2);
      return;
    }

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
    <form className="booking-widget booking-widget-stepped" onSubmit={handleSubmit}>
      <div className="booking-widget-head">
        <span>{copy.secure}</span>
        <strong>US${total}</strong>
        <small>{copy.calculated} {passengers} {copy.people}</small>
      </div>

      <div className="booking-stepper" aria-label="Booking steps">
        {stepLabels.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3;

          return (
            <button
              key={label}
              type="button"
              className={`booking-step ${bookingStep === step ? 'is-active' : ''} ${bookingStep > step ? 'is-complete' : ''}`}
              onClick={() => goToStep(step)}
            >
              <span>{step}</span>
              {label}
            </button>
          );
        })}
      </div>

      {stepNotice ? <p className="booking-step-notice">{stepNotice}</p> : null}

      {bookingStep === 1 ? (
        <div className="booking-step-panel">
          <div className="booking-field-row">
            <div className="booking-field">
              <label>{copy.date}</label>
              <input
                type="date"
                min={minDate}
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div className="booking-field">
              <label>{copy.passengers}</label>
              <input
                min={1}
                max={20}
                type="number"
                required
                value={passengers}
                onChange={(event) => setPassengers(Math.max(1, Number(event.target.value) || 1))}
              />
            </div>
          </div>

          <div className="booking-field">
            <label>{copy.hotel}</label>
            <input
              value={hotel}
              required
              onChange={(event) => setHotel(event.target.value)}
              placeholder={copy.hotelPlaceholder}
            />
          </div>

          <div className="booking-field-row">
            <div className="booking-field">
              <label>{copy.pickupZone}</label>
              <select value={pickupZone} onChange={(event) => setPickupZone(event.target.value)}>
                {pickupZones.map((zone) => (
                  <option key={zone.label} value={zone.label}>
                    {zone.label}{zone.fee ? ` +US$${zone.fee}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="booking-field">
              <label>{copy.pickupWindow}</label>
              <select value={pickupWindow} onChange={(event) => setPickupWindow(event.target.value)}>
                <option>{copy.first}</option>
                <option>{copy.morning}</option>
                <option>{copy.midday}</option>
                <option>{copy.afternoon}</option>
              </select>
            </div>
          </div>

          <button className="booking-submit" type="button" onClick={() => goToStep(2)}>
            {stepText.next}
          </button>
        </div>
      ) : null}

      {bookingStep === 2 ? (
        <div className="booking-step-panel">
          <div className="booking-field">
            <label>{copy.name}</label>
            <input
              value={name}
              required
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.namePlaceholder}
            />
          </div>

          <div className="booking-contact-grid">
            <div>
              <label htmlFor={`phone-${product.id}`}>{copy.phone}</label>
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
              <label htmlFor={`email-${product.id}`}>{copy.email}</label>
              <input
                id={`email-${product.id}`}
                value={email}
                required
                type="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
              />
            </div>
          </div>

          <div className="booking-field-row">
            <div className="booking-field">
              <label>{copy.language}</label>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option>{copy.spanish}</option>
                <option>English</option>
                <option>{copy.french}</option>
              </select>
            </div>
            <div className="booking-field">
              <label>{copy.payment}</label>
              <select
                value={paymentPreference}
                onChange={(event) => setPaymentPreference(event.target.value)}
              >
                <option>{copy.payNow}</option>
                <option>{copy.cardFirst}</option>
                <option>{copy.helpFirst}</option>
              </select>
            </div>
          </div>

          <div className="booking-step-actions">
            <button className="booking-step-back" type="button" onClick={() => goToStep(1)}>
              {stepText.back}
            </button>
            <button className="booking-submit" type="button" onClick={() => goToStep(3)}>
              {stepText.next}
            </button>
          </div>
        </div>
      ) : null}

      {bookingStep === 3 ? (
        <>
          <div className="booking-breakdown" aria-live="polite">
            <p><b>{pricing.vehicles}</b> {copy.vehicles} x US${product.promo}</p>
            <p>{copy.base}: <b>US${pricing.baseTotal}</b></p>
            {pricing.zoneFee ? <p>{copy.zone}: <b>US${pricing.zoneFee}</b></p> : null}
          </div>

          <div className="booking-review-card">
            <h3>{stepText.reviewTitle}</h3>
            <p>{stepText.reviewText}</p>
            <div className="booking-review-grid">
              <p><b>{stepText.summaryDate}</b>{date}</p>
              <p><b>{stepText.summaryTravelers}</b>{passengers}</p>
              <p><b>{stepText.summaryPickup}</b>{hotel} - {pickupZone}</p>
              <p><b>{stepText.summaryTime}</b>{pickupWindow}</p>
            </div>
          </div>

          <div className="booking-step-actions">
            <button className="booking-step-back" type="button" onClick={() => goToStep(2)}>
              {stepText.back}
            </button>
            <button className="booking-submit" type="submit" disabled={paymentStatus === 'loading'}>
              {paymentStatus === 'loading' ? <Loader2 className="spin" size={19} /> : <CreditCard size={19} />}
              {copy.payButton}
            </button>
          </div>

          {showPayment ? (
            <div className="paypal-panel">
              {paymentStatus === 'paid' ? (
                <div className="payment-success">
                  <CheckCircle2 size={22} />
                  <b>{copy.paidTitle}</b>
                  <span>{copy.paidText}</span>
                </div>
              ) : (
                <>
                  <b>{copy.choosePayment}</b>
                  <span>{copy.paypalCard}</span>
                  <div ref={paypalContainerRef} className="paypal-buttons" />
                  {!paypalReady && !paymentError ? <p className="booking-note">{copy.loading}</p> : null}
                </>
              )}
              {paymentError ? <p className="payment-error">{paymentError}</p> : null}
            </div>
          ) : null}

          <a className="booking-support-link" href={whatsappHref(bookingMessage())} onClick={recordWhatsAppInquiry}>
            <MessageCircle size={18} /> {copy.help}
          </a>
          <div className="booking-assurance">
            <span><CheckCircle2 size={15} /> {copy.protected}</span>
            <span><LockKeyhole size={15} /> {copy.external}</span>
          </div>
          <p className="booking-note">{copy.note}</p>
        </>
      ) : null}
    </form>
  );
}
