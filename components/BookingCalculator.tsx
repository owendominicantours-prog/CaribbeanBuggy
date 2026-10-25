'use client';

import { FormEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { CheckCircle2, CreditCard, Loader2, LockKeyhole, MessageCircle } from 'lucide-react';
import type { BuggyProduct } from '../lib/buggyProducts';
import { calculateBookingTotal, availablePickupZones, whatsappHref, bookingFleetProducts } from '../lib/buggyProducts';

type BookingCalculatorProps = {
  product: BuggyProduct;
  defaultHotel?: string;
  defaultPickupZone?: string;
  locale?: 'es' | 'en';
};

declare global { interface Window { dataLayer?: Array<Record<string, unknown>>; } }

const subscribeToDominicanDate = () => () => undefined;
const getDominicanDate = () => new Date().toLocaleDateString('en-CA', {
  timeZone: 'America/Santo_Domingo',
});
const getServerDate = () => '';

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
        payButton: 'Pay safely by card',
        paidTitle: 'Payment received.',
        paidText: 'We will contact you to confirm pickup and exact time.',
        choosePayment: 'Pay by card with Stripe.',
        loading: 'Loading secure payment...',
        help: 'WhatsApp support',
        protected: 'Payment protected by Stripe',
        external: 'Card details are processed outside our website',
        note: 'Your booking is confirmed after verified payment. We email your e-ticket and contact you one day before the tour with pickup details.',
        captureError: 'We could not capture the payment.',
        paymentError: 'Stripe could not open the payment. You can try another card or contact us on WhatsApp.',
        renderError: 'We could not show the payment form. Try again.',
        saving: 'Saving your reservation securely...',
        saveError: 'We could not save your reservation. Please try again or contact us on WhatsApp.',
        savedTitle: 'Your details are saved.',
        savedText: 'Complete payment below. If you stop here, our team can still help you finish the booking.',
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
        payButton: 'Pagar seguro con tarjeta',
        paidTitle: 'Pago recibido.',
        paidText: 'Te contactaremos para confirmar recogida y hora exacta.',
        choosePayment: 'Paga con tarjeta mediante Stripe.',
        loading: 'Cargando pago seguro...',
        help: 'Ayuda por WhatsApp',
        protected: 'Pago protegido por Stripe',
        external: 'Datos de tarjeta procesados fuera de nuestra web',
        note: 'Tu reserva queda confirmada después del pago verificado. Recibes tu e-ticket y te escribimos un día antes con los detalles de recogida.',
        captureError: 'No se pudo capturar el pago.',
        paymentError: 'Stripe no pudo abrir el pago. Puedes intentar otra tarjeta o escribir por WhatsApp.',
        renderError: 'No pudimos mostrar el formulario de pago. Intenta de nuevo.',
        saving: 'Guardando tu reserva de forma segura...',
        saveError: 'No pudimos guardar tu reserva. Intenta nuevamente o escribenos por WhatsApp.',
        savedTitle: 'Tus datos ya están guardados.',
        savedText: 'Completa el pago abajo. Si te detienes aquí, nuestro equipo aún podrá ayudarte a terminar la reserva.',
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
  const pickupZones=availablePickupZones(product);
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(product.capacityNumber);
  const [fleet,setFleet]=useState<Record<string,number>>({[product.id]:1});
  const [fleetConfirmed,setFleetConfirmed]=useState(true);
  const fleetChoices=bookingFleetProducts(product);
  const fleetRequired=locale==='en'?'Choose your buggy quantities and confirm the total before continuing.':'Elige cuántos buggies quieres y confirma el total antes de continuar.';
  const [pickupZone, setPickupZone] = useState(pickupZones.find(z=>z.label===defaultPickupZone)?.label || pickupZones[0].label);
  const [hotel, setHotel] = useState(defaultHotel);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState(locale === 'en' ? 'English' : copy.spanish);
  const [pickupWindow, setPickupWindow] = useState(copy.first);
  const [paymentPreference, setPaymentPreference] = useState(copy.payNow);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'paid'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [renderToken, setRenderToken] = useState(0);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const formRef=useRef<HTMLFormElement>(null);
  useEffect(()=>{if(bookingStep>1)formRef.current?.scrollIntoView({behavior:'auto',block:'start'});},[bookingStep]);
  const [stepNotice, setStepNotice] = useState('');
  const bookingReferenceRef = useRef('');
  const leadIdRef = useRef('');

  const minDate = useSyncExternalStore(subscribeToDominicanDate, getDominicanDate, getServerDate);
  const pricing = calculateBookingTotal({
    product,
    passengers,
    pickupZone,
    photos: false,
    privatePickup: false,
    fleet,
  });
  const total = pricing.total;

  const stripeRequestId = useRef("");
  async function openStripe() {
    setPaymentError(""); setPaymentStatus('loading');
    if (!stripeRequestId.current) stripeRequestId.current = crypto.randomUUID();
    try { const r = await fetch('/api/stripe/checkout', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...buildPayload(),requestId:stripeRequestId.current})});
      const d = await r.json(); if(!r.ok || typeof d.url !== 'string' || !d.url.startsWith('https://checkout.stripe.com/')) throw Error(d.error || copy.paymentError);
      window.location.assign(d.url);
    } catch(e) { setPaymentStatus('idle');setPaymentError(e instanceof Error ? e.message : copy.paymentError); }
  }

  function buildPayload() {
    return {
      productId: product.id,
      locale,
      date,
      passengers,
      fleet,
      fleetConfirmed,
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
      leadId: leadIdRef.current || undefined,
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
    if (leadIdRef.current) return;

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
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
      const data = (await response.json().catch(() => ({}))) as { id?: string };
      if (response.ok && data.id) leadIdRef.current = data.id;
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
    if(step>1 && (!fleetConfirmed || !pricing.validFleet)){setBookingStep(1);setStepNotice(fleetRequired);return;}
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!fleetConfirmed || !pricing.validFleet){setBookingStep(1);setStepNotice(fleetRequired);return;}
    if (!date || !hotel.trim()) { goToStep(1); return; }
    if (!name.trim() || !phone.trim() || !email.trim()) { goToStep(2); return; }
    window.dataLayer?.push({event:'begin_checkout',product_id:product.id,value:total,currency:'USD'});
    await openStripe();
  };

  return (
    <form ref={formRef} className="booking-widget booking-widget-stepped" onSubmit={handleSubmit}>
      <div className="booking-widget-head">
        <span>{copy.secure}</span>
        <p className="kicker">{locale === "en" ? "Price for your selected buggies" : "Precio de tus buggies seleccionados"}</p>
        <strong>{pricing.validFleet?`US$${total}`:"—"}</strong>
        <small>{copy.calculated} {passengers} {copy.people}</small>
      </div>

      <div className="booking-stepper" role="group" aria-label="Booking steps">
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
              <label htmlFor={`date-${product.id}`}>{copy.date}</label>
              <input
                id={`date-${product.id}`}
                type="date"
                min={minDate || undefined}
                disabled={!minDate}
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                onInput={(event) => setDate(event.currentTarget.value)}
              />
            </div>
            <div className="booking-field">
              <label htmlFor={`passengers-${product.id}`}>{copy.passengers}</label>
              <input
                id={`passengers-${product.id}`}
                min={1}
                max={20}
                type="number"
                required
                value={passengers}
                onChange={(event) => {setPassengers(Math.max(1, Math.min(20, Number(event.target.value) || 1)));setFleetConfirmed(false);}}
              />
            </div>
          </div>

          <fieldset className="buggy-fleet-choice"><legend>{locale==='en'?'How will your group ride?':'¿Cómo viajará tu grupo?'}</legend><p>{fleetRequired}</p>{fleetChoices.map(p=><label key={p.id}>{p.title} · {p.capacityNumber} {locale==='en'?'seats':'plazas'} · US${p.promo}<input aria-label={`${locale==='en'?'Quantity':'Cantidad'} ${p.title}`} type="number" min={0} max={passengers} value={fleet[p.id]||0} onChange={e=>{setFleet({...fleet,[p.id]:Math.max(0,Math.min(passengers,Number(e.target.value)||0))});setFleetConfirmed(false);}}/></label>)}<p><strong>{pricing.fleetSummary || (locale==='en'?'Choose your buggies':'Elige tus buggies')}</strong><br/>{pricing.capacity} {locale==='en'?'seats for':'plazas para'} {passengers} {copy.people} · US${pricing.baseTotal}</p>{!pricing.validFleet && <p role="alert">{locale==='en'?'Every traveler needs a seat. Add enough buggies.':'Cada persona necesita asiento. Agrega suficientes buggies.'}</p>}<label><input type="checkbox" checked={fleetConfirmed} disabled={!pricing.validFleet} onChange={e=>setFleetConfirmed(e.target.checked)}/>{locale==='en'?'I confirm these buggy quantities and the total.':'Confirmo estas cantidades de buggies y el total.'}</label></fieldset>
          <div className="booking-field">
            <label htmlFor={`hotel-${product.id}`}>{copy.hotel}</label>
            <input
              id={`hotel-${product.id}`}
              value={hotel}
              required
              onChange={(event) => setHotel(event.target.value)}
              placeholder={copy.hotelPlaceholder}
            />
          </div>

          <div className="booking-field-row">
            <div className="booking-field">
              <label htmlFor={`pickup-zone-${product.id}`}>{copy.pickupZone}</label>
              <select id={`pickup-zone-${product.id}`} value={pickupZone} onChange={(event) => setPickupZone(event.target.value)}>
                {pickupZones.map((zone) => (
                  <option key={zone.label} value={zone.label}>
                    {zone.label}{zone.fee ? ` +US$${zone.fee}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="booking-field">
              <label htmlFor={`pickup-window-${product.id}`}>{copy.pickupWindow}</label>
              <select id={`pickup-window-${product.id}`} value={pickupWindow} onChange={(event) => setPickupWindow(event.target.value)}>
                <option>{copy.first}</option>
                <option>{copy.morning}</option>
                <option>{copy.midday}</option>
                <option>{copy.afternoon}</option>
              </select>
            </div>
          </div>

          <button className="booking-submit" type="button" disabled={!minDate} onClick={() => goToStep(2)}>
            {stepText.next}
          </button>
        </div>
      ) : null}

      {bookingStep === 2 ? (
        <div className="booking-step-panel">
          <div className="booking-field">
            <label htmlFor={`name-${product.id}`}>{copy.name}</label>
            <input
              id={`name-${product.id}`}
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
              <label htmlFor={`language-${product.id}`}>{copy.language}</label>
              <select id={`language-${product.id}`} value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option>{copy.spanish}</option>
                <option>English</option>
                <option>{copy.french}</option>
              </select>
            </div>
            <div className="booking-field">
              <label htmlFor={`payment-${product.id}`}>{copy.payment}</label>
              <select
                id={`payment-${product.id}`}
                value={paymentPreference}
                onChange={(event) => setPaymentPreference(event.target.value)}
              >
                <option>{copy.payNow}</option>


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
            <p>{pricing.fleetSummary} · US${pricing.baseTotal}</p>
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

          {paymentError && !showPayment ? <p className="payment-error" role="alert">{paymentError}</p> : null}
          {showPayment ? (
            <div className="stripe-panel">
              <div className="booking-lead-saved">
                <CheckCircle2 size={19} />
                <span><b>{copy.savedTitle}</b><small>{copy.savedText}</small></span>
              </div>
              {paymentStatus === 'paid' ? (
                <div className="payment-success">
                  <CheckCircle2 size={22} />
                  <b>{copy.paidTitle}</b>
                  <span>{copy.paidText}</span>
                </div>
              ) : (
                <>
                  <b>{copy.choosePayment}</b>
                  <button type="button" className="booking-submit" disabled={paymentStatus === 'loading'} onClick={openStripe}>{paymentStatus === 'loading' ? copy.loading : (language === 'en' ? 'Pay securely with Stripe' : 'Pagar seguro con Stripe')}</button>
                  <p className="booking-note">{language === 'en' ? 'Card payment. Your booking is confirmed after payment verification.' : 'Pago con tarjeta. Tu reserva se confirma al verificar el pago.'}</p>
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
