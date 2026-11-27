'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Check, CreditCard, Loader2, LockKeyhole, MapPin, MessageCircle, Minus, Pencil, Plus, Users } from 'lucide-react';
import type { BuggyProduct } from '../../lib/buggyProducts';
import { bookingFleetProducts, calculateBookingTotal, pickupZones, whatsappHref } from '../../lib/buggyProducts';
import { fleetOptions, fleetTotals, money } from '../../lib/bookingFleet';
import { areaForHotel, areaFromText, bayahibeArea, pickupAreas, searchHotels, type PickupArea } from '../../lib/pickupLookup';
import { getHotelBuggyLanding } from '../../lib/hotelBuggyLandings';
import GooglePickupField from './GooglePickupField';
import type {GooglePickup} from '../../lib/googlePickup';
import { readAttribution } from '../../lib/attribution';

type Locale = 'es' | 'en';
type Step = 'group' | 'date' | 'pickup' | 'contact' | 'review';
const STEPS: Step[] = ['group', 'date', 'pickup', 'contact', 'review'];

declare global { interface Window { dataLayer?: Array<Record<string, unknown>>; } }

const noopSubscribe = () => () => undefined;
const dominicanToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santo_Domingo' });
const serverToday = () => '';

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function vehicleName(p: BuggyProduct, locale: Locale) {
  if (p.capacityNumber === 1) return locale === 'en' ? 'Single buggy' : 'Buggy individual';
  if (p.capacityNumber === 2) return locale === 'en' ? 'Double buggy' : 'Buggy doble';
  return locale === 'en' ? 'Family buggy' : 'Buggy familiar';
}

const T = {
  es: {
    secure: 'Reserva segura',
    stepWord: 'Paso',
    of: 'de',
    stepNames: ['Grupo', 'Fecha', 'Recogida', 'Tus datos', 'Pagar'],
    groupQ: '¿Cuántas personas van?',
    groupHint: 'Cuenta a todos, también a los niños (desde 3 años). Cada buggy necesita un conductor mayor de 18 años.',
    people: (n: number) => (n === 1 ? '1 persona' : `${n} personas`),
    bestFor: 'Te recomendamos',
    alternative: 'Otra opción',
    perPerson: 'por persona',
    seats: (n: number) => `${n} ${n === 1 ? 'plaza' : 'plazas'}`,
    emptySeat: (n: number) => `${n} ${n === 1 ? 'asiento libre' : 'asientos libres'}`,
    custom: 'Prefiero elegir los buggies yo',
    customHide: 'Ver recomendaciones',
    needSeats: 'Faltan asientos: cada persona necesita uno.',
    needDrivers: 'Hay más buggies que personas: cada buggy necesita su conductor.',
    continueWith: 'Continuar',
    dateQ: '¿Qué día quieres ir?',
    today: 'Hoy',
    tomorrow: 'Mañana',
    otherDate: 'Otra fecha',
    timeQ: '¿Qué turno prefieres?',
    timeHint: 'Te confirmamos por WhatsApp la hora exacta de recogida o de encuentro.',
    windows: ['Primera salida disponible', 'Mañana', 'Mediodía', 'Tarde'],
    pickupQ: '¿Dónde te hospedas?',
    pickupHint: 'Escribe el nombre de tu hotel o de tu alojamiento.',
    pickupPlaceholder: 'Ej: Riu, Hard Rock, Lopesan, Airbnb en Bávaro…',
    notListed: '¿No aparece? Elige tu zona:',
    included: 'Recogida y regreso incluidos. Te confirmamos la hora exacta por WhatsApp.',
    meeting: 'En esta zona no recogemos en el alojamiento. Nos vemos en el KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.',
    capcana: 'Cap Cana tiene un cargo de zona de US$10, ya sumado a tu total. Te confirmamos el punto de acceso por WhatsApp.',
    bayahibe: 'Te confirmamos por WhatsApp la recogida o el punto de encuentro según tu hotel.',
    meetingTag: 'Encuentro KFC Downtown',
    contactQ: '¿A quién le enviamos el e-ticket?',
    name: 'Nombre y apellido',
    phone: 'WhatsApp',
    email: 'Correo electrónico',
    language: 'Idioma del guía',
    languages: ['Español', 'English', 'Français'],
    reviewQ: 'Revisa y paga',
    rowGroup: 'Grupo',
    rowDate: 'Fecha y turno',
    rowPickup: 'Recogida',
    rowContact: 'Contacto',
    zoneFee: 'Cargo de zona',
    total: 'Total',
    pay: 'Pagar con tarjeta',
    paying: 'Abriendo pago seguro…',
    help: '¿Dudas? Escríbenos por WhatsApp',
    protectedBy: 'Pago protegido por Stripe · tu tarjeta no pasa por esta web',
    afterPay: 'Al pagar recibes tu e-ticket por correo y te escribimos por WhatsApp con la hora exacta.',
    back: 'Atrás',
    errDate: 'Elige la fecha del tour.',
    errHotel: 'Escribe tu hotel o alojamiento y elige la zona.',
    errName: 'Escribe tu nombre y apellido.',
    errPhone: 'Escribe un WhatsApp válido, con código de país.',
    errEmail: 'Revisa el correo electrónico.',
    payError: 'No se pudo abrir el pago. Revisa tus datos o escríbenos por WhatsApp.',
    waIntro: 'Hola, quiero ayuda para reservar en Caribbean Buggy.',
    waGroup: 'Grupo', waDate: 'Fecha', waTime: 'Turno', waHotel: 'Alojamiento', waTotal: 'Total web',
    totalFor: (n: number) => `Total para ${n === 1 ? '1 persona' : `${n} personas`}`,
  },
  en: {
    secure: 'Secure booking',
    stepWord: 'Step',
    of: 'of',
    stepNames: ['Group', 'Date', 'Pickup', 'Your details', 'Pay'],
    groupQ: 'How many people are going?',
    groupHint: 'Count everyone, children included (from age 3). Every buggy needs a driver aged 18+.',
    people: (n: number) => (n === 1 ? '1 traveler' : `${n} travelers`),
    bestFor: 'We recommend',
    alternative: 'Another option',
    perPerson: 'per person',
    seats: (n: number) => `${n} ${n === 1 ? 'seat' : 'seats'}`,
    emptySeat: (n: number) => `${n} empty ${n === 1 ? 'seat' : 'seats'}`,
    custom: 'I want to choose the buggies myself',
    customHide: 'Show recommendations',
    needSeats: 'Not enough seats: every traveler needs one.',
    needDrivers: 'More buggies than travelers: every buggy needs its own driver.',
    continueWith: 'Continue',
    dateQ: 'Which day do you want to go?',
    today: 'Today',
    tomorrow: 'Tomorrow',
    otherDate: 'Other date',
    timeQ: 'Which departure do you prefer?',
    timeHint: 'We confirm the exact pickup or meeting time on WhatsApp.',
    windows: ['First available departure', 'Morning', 'Midday', 'Afternoon'],
    pickupQ: 'Where are you staying?',
    pickupHint: 'Type the name of your hotel or accommodation.',
    pickupPlaceholder: 'E.g. Riu, Hard Rock, Lopesan, Airbnb in Bávaro…',
    notListed: 'Not listed? Choose your area:',
    included: 'Pickup and return included. We confirm the exact time on WhatsApp.',
    meeting: 'There is no accommodation pickup in this area. We meet at KFC Downtown, near Coco Bongo. We will confirm the exact KFC meeting time for your departure before the activity.',
    capcana: 'Cap Cana has a US$10 zone fee, already added to your total. We confirm the access point on WhatsApp.',
    bayahibe: 'We confirm the pickup or meeting point for your hotel on WhatsApp.',
    meetingTag: 'Meeting point KFC Downtown',
    contactQ: 'Who should receive the e-ticket?',
    name: 'Full name',
    phone: 'WhatsApp',
    email: 'Email',
    language: 'Guide language',
    languages: ['Español', 'English', 'Français'],
    reviewQ: 'Review and pay',
    rowGroup: 'Group',
    rowDate: 'Date and departure',
    rowPickup: 'Pickup',
    rowContact: 'Contact',
    zoneFee: 'Zone fee',
    total: 'Total',
    pay: 'Pay by card',
    paying: 'Opening secure payment…',
    help: 'Questions? Message us on WhatsApp',
    protectedBy: 'Payment protected by Stripe · your card never touches this site',
    afterPay: 'After payment you get your e-ticket by email and we message you on WhatsApp with the exact time.',
    back: 'Back',
    errDate: 'Choose the tour date.',
    errHotel: 'Type your hotel or accommodation and choose the area.',
    errName: 'Type your full name.',
    errPhone: 'Type a valid WhatsApp number with country code.',
    errEmail: 'Check the email address.',
    payError: 'We could not open the payment. Check your details or message us on WhatsApp.',
    waIntro: 'Hello, I need help booking with Caribbean Buggy.',
    waGroup: 'Group', waDate: 'Date', waTime: 'Departure', waHotel: 'Accommodation', waTotal: 'Web total',
    totalFor: (n: number) => `Total for ${n === 1 ? '1 traveler' : `${n} travelers`}`,
  },
};

type Props = {
  product: BuggyProduct;
  defaultHotel?: string;
  defaultPickupZone?: string;
  locale?: Locale;
};

export default function BookingWizard({ product, defaultHotel = '', locale = 'es' }: Props) {
  const t = T[locale];
  const isBayahibe = product.destination.includes('Bayahibe');
  const choices = useMemo(() => bookingFleetProducts(product), [product]);
  const today = useSyncExternalStore(noopSubscribe, dominicanToday, serverToday);

  const [step, setStep] = useState<Step>('group');
  const [travelers, setTravelers] = useState(product.capacityNumber);
  const [fleet, setFleet] = useState<Record<string, number>>({ [product.id]: 1 });
  const [customFleet, setCustomFleet] = useState(false);
  const [fleetConfirmed, setFleetConfirmed] = useState(false);
  const [date, setDate] = useState('');
  const [pickupWindow, setPickupWindow] = useState(t.windows[0]);
  const defaultLanding = defaultHotel ? searchHotels(defaultHotel, isBayahibe, 1)[0] : undefined;
  const [hotel, setHotel] = useState(defaultHotel);
  const [area, setArea] = useState<PickupArea | null>(
    isBayahibe ? bayahibeArea : defaultLanding ? areaForHotel(defaultLanding) : (defaultHotel ? areaFromText(defaultHotel) : null),
  );
  const [googlePickup,setGooglePickup]=useState<GooglePickup|null>(null);
  const [initialGoogleHotel,setInitialGoogleHotel]=useState(defaultHotel);
  const [initialGoogleRef,setInitialGoogleRef]=useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState(locale === 'en' ? 'English' : 'Español');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const requestId = useRef('');
  const leadId = useRef('');
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Optional prefill from the home quick quote: ?personas=3&hotel=<slug>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const people = Number(params.get('personas') || params.get('travelers'));
    if (Number.isInteger(people) && people >= 1 && people <= 20 && people !== product.capacityNumber) {
      setTravelers(people);
      const best = fleetOptions(choices, people, 1)[0];
      if (best) setFleet(best.fleet);
    }
    const ref=params.get('pickupGoogleRef'),googleHotel=params.get('pickupHotel');
    if(ref&&googleHotel&&ref.length<=200&&googleHotel.length<=180){setHotel(googleHotel);setInitialGoogleHotel(googleHotel);setInitialGoogleRef(ref);}
    const slug = params.get('hotel');
    const landing = slug ? getHotelBuggyLanding(slug) : undefined;
    if (landing && !isBayahibe) { setHotel(landing.name); setInitialGoogleHotel(landing.name); setArea(areaForHotel(landing)); }
  }, [choices, isBayahibe, product.capacityNumber]);

  const options = useMemo(() => fleetOptions(choices, travelers, 3), [choices, travelers]);
  const totals = fleetTotals(choices, fleet, travelers);
  const zoneFee = area ? (pickupZones.find((z) => z.label === area.calculatorZone)?.fee ?? 0) : 0;
  const total = totals.total + zoneFee;
  const stepIndex = STEPS.indexOf(step);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.dataLayer?.push({ event: 'booking_step_view', product_id: product.id, booking_step: stepIndex + 1, value: total, currency: 'USD' });
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // total is reported at the moment the step opens; it is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function changeTravelers(next: number) {
    const value = Math.max(1, Math.min(20, next));
    setTravelers(value);
    setFleetConfirmed(false);
    if (!customFleet) {
      const best = fleetOptions(choices, value, 1)[0];
      if (best) setFleet(best.fleet);
    }
  }

  function changeVehicle(id: string, delta: number) {
    setFleet((current) => {
      const nextCount = Math.max(0, Math.min(20, (current[id] || 0) + delta));
      const next = { ...current, [id]: nextCount };
      if (!nextCount) delete next[id];
      return next;
    });
    setFleetConfirmed(false);
  }

  function fail(message: string, group: string) {
    setError(message);
    window.dataLayer?.push({ event: 'booking_validation_error', product_id: product.id, field_group: group });
  }

  function go(next: Step) {
    setError('');
    setStep(next);
  }

  function nextFrom(current: Step) {
    if (current === 'group') {
      if (!totals.valid) return fail(totals.seats < travelers ? t.needSeats : t.needDrivers, 'fleet');
      setFleetConfirmed(true);
      return go('date');
    }
    if (current === 'date') {
      if (!date || (today && date < today)) return fail(t.errDate, 'tour_details');
      return go('pickup');
    }
    if (current === 'pickup') {
      if (!hotel.trim() || !area || !googlePickup) return fail(t.errHotel, 'tour_details');
      return go('contact');
    }
    if (current === 'contact') {
      if (name.trim().length < 3) return fail(t.errName, 'contact_details');
      if (phone.replace(/\D/g, '').length < 8) return fail(t.errPhone, 'contact_details');
      if (!/^[^\s@,;<>"\\]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email.trim())) return fail(t.errEmail, 'contact_details');
      return go('review');
    }
  }

  function hotelForPayload() {
    const base = hotel.trim();
    return area?.status === 'meeting' && !base.includes('KFC') ? `${base} · ${t.meetingTag}` : base;
  }

  function buildPayload() {
    return {
      productId: product.id,
      locale,
      date,
      passengers: travelers,
      fleet,
      fleetConfirmed,
      pickupZone: area?.calculatorZone || '',
      hotel: hotelForPayload(),
      pickupAreaId:area?.id,
      googlePickupRef:googlePickup?.id,
      googlePickupMapsUrl:googlePickup?.mapsUrl,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      language,
      pickupWindow,
      paymentPreference: locale === 'en' ? 'Pay in full now' : 'Pagar total ahora',
      photos: false,
      privatePickup: false,
      leadId: leadId.current || undefined,
      attribution: readAttribution(),
    };
  }

  const fleetText = choices.filter((p) => fleet[p.id]).map((p) => `${fleet[p.id]} × ${vehicleName(p, locale)}`).join(' + ');

  function whatsappMessage() {
    return [
      t.waIntro,
      `${t.waGroup}: ${t.people(travelers)} · ${fleetText}`,
      date ? `${t.waDate}: ${date}` : '',
      `${t.waTime}: ${pickupWindow}`,
      hotel ? `${t.waHotel}: ${hotelForPayload()}` : '',
      `${t.waTotal}: US$${total}`,
    ].filter(Boolean).join('\n');
  }

  async function recordInquiry() {
    if (leadId.current) return;
    try {
      const pricing = calculateBookingTotal({ product, passengers: travelers, pickupZone: area?.calculatorZone || choicesZone(), photos: false, privatePickup: false, fleet });
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ source: 'booking_whatsapp_button', productId: product.id, productName: product.title, booking: buildPayload(), pricing: { total: pricing.total, vehicles: pricing.vehicles, passengers: pricing.passengers, baseTotal: pricing.baseTotal, zoneFee: pricing.zoneFee, photosFee: 0, privatePickupFee: 0 } }),
      });
      const data = (await response.json().catch(() => ({}))) as { id?: string };
      if (response.ok && data.id) leadId.current = data.id;
    } catch (err) {
      console.error('booking_whatsapp_inquiry_error', err);
    }
  }

  function choicesZone() {
    return isBayahibe ? bayahibeArea.calculatorZone : pickupAreas[0].calculatorZone;
  }

  async function pay() {
    setError('');
    if (!fleetConfirmed || !totals.valid) return go('group');
    if(!googlePickup)return go('pickup');
    const attribution = readAttribution();
    window.dataLayer?.push({ event: 'begin_checkout', product_id: product.id, value: total, currency: 'USD', first_page: attribution.firstPage, session_page: attribution.sessionPage });
    setPaying(true);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const response = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...buildPayload(), requestId: requestId.current }) });
      const data = await response.json();
      if (!response.ok || typeof data.url !== 'string' || !data.url.startsWith('https://checkout.stripe.com/')) throw Error(data.error || t.payError);
      window.location.assign(data.url);
    } catch {
      setPaying(false);
      setError(t.payError);
    }
  }

  const exactHotel=!!googlePickup?.areaId;
  const dateChips = today ? Array.from({ length: 8 }, (_, i) => addDays(today, i)) : [];
  const fmtDay = (iso: string) => new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-DO', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  const statusText = area ? ({ included: t.included, meeting: t.meeting, capcana: t.capcana, bayahibe: t.bayahibe } as const)[area.status] : '';

  return (
    <div className="cb-wizard" ref={rootRef} data-step={step}>
      <div className="cb-wizard-top">
        <div>
          <span className="cb-wizard-kicker"><LockKeyhole size={14} /> {t.secure}</span>
          <strong aria-live="polite">{totals.valid ? `US$${total}` : '—'}</strong>
          <small>{t.totalFor(travelers)}{fleetText ? ` · ${fleetText}` : ''}</small>
        </div>
        <ol className="cb-progress" aria-label={`${t.stepWord} ${stepIndex + 1} ${t.of} ${STEPS.length}`}>
          {STEPS.map((s, i) => <li key={s} className={i < stepIndex ? 'is-done' : i === stepIndex ? 'is-current' : ''}><span>{i < stepIndex ? <Check size={12} /> : i + 1}</span><em>{t.stepNames[i]}</em></li>)}
        </ol>
      </div>

      <div className="cb-wizard-body">
        {step === 'group' ? (
          <section aria-labelledby={`q-group-${product.id}`}>
            <h3 id={`q-group-${product.id}`}><Users size={20} /> {t.groupQ}</h3>
            <div className="cb-stepper">
              <button type="button" aria-label="−1" onClick={() => changeTravelers(travelers - 1)} disabled={travelers <= 1}><Minus size={20} /></button>
              <output aria-live="polite">{t.people(travelers)}</output>
              <button type="button" aria-label="+1" onClick={() => changeTravelers(travelers + 1)} disabled={travelers >= 20}><Plus size={20} /></button>
            </div>
            <p className="cb-hint">{t.groupHint}</p>
            {!customFleet ? (
              <div className="cb-options" role="radiogroup">
                {options.map((option, i) => {
                  const selected = JSON.stringify(option.fleet) === JSON.stringify(Object.fromEntries(Object.entries(fleet).filter(([, c]) => c)));
                  return (
                    <button type="button" role="radio" aria-checked={selected} key={JSON.stringify(option.fleet)} className={`cb-option ${selected ? 'is-selected' : ''}`} onClick={() => { setFleet(option.fleet); setFleetConfirmed(false); }}>
                      <span className="cb-option-tag">{i === 0 ? t.bestFor : t.alternative}</span>
                      <b>{choices.filter((p) => option.fleet[p.id]).map((p) => `${option.fleet[p.id]} × ${vehicleName(p, locale)}`).join(' + ')}</b>
                      <span className="cb-option-price"><strong>US${option.total + zoneFee}</strong> · US${money((option.total + zoneFee) / travelers)} {t.perPerson}</span>
                      <small>{t.seats(option.seats)}{option.emptySeats ? ` · ${t.emptySeat(option.emptySeats)}` : ''}</small>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="cb-custom">
                {choices.map((p) => (
                  <div key={p.id} className="cb-custom-row">
                    <span><b>{vehicleName(p, locale)}</b><small>{t.seats(p.capacityNumber)} · US${p.promo}</small></span>
                    <div className="cb-mini-stepper">
                      <button type="button" aria-label={`− ${vehicleName(p, locale)}`} onClick={() => changeVehicle(p.id, -1)} disabled={!fleet[p.id]}><Minus size={16} /></button>
                      <output>{fleet[p.id] || 0}</output>
                      <button type="button" aria-label={`+ ${vehicleName(p, locale)}`} onClick={() => changeVehicle(p.id, 1)}><Plus size={16} /></button>
                    </div>
                  </div>
                ))}
                {!totals.valid ? <p className="cb-warn" role="alert">{totals.seats < travelers ? t.needSeats : t.needDrivers}</p> : null}
              </div>
            )}
            <button type="button" className="cb-link-btn" onClick={() => { setCustomFleet(!customFleet); if (customFleet && options[0]) setFleet(options[0].fleet); }}>{customFleet ? t.customHide : t.custom}</button>
          </section>
        ) : null}

        {step === 'date' ? (
          <section aria-labelledby={`q-date-${product.id}`}>
            <h3 id={`q-date-${product.id}`}><CalendarDays size={20} /> {t.dateQ}</h3>
            <div className="cb-chips cb-date-chips">
              {dateChips.map((iso, i) => (
                <button type="button" key={iso} className={date === iso ? 'is-selected' : ''} aria-pressed={date === iso} onClick={() => { setDate(iso); setError(''); }}>
                  <b>{i === 0 ? t.today : i === 1 ? t.tomorrow : fmtDay(iso).split(' ')[0]}</b>
                  <span>{fmtDay(iso).replace(/^[^ ]+ /, '')}</span>
                </button>
              ))}
            </div>
            <label className="cb-field cb-field-inline">
              <span>{t.otherDate}</span>
              <input type="date" min={today || undefined} value={date} onChange={(e) => { setDate(e.target.value); setError(''); }} />
            </label>
            <h4>{t.timeQ}</h4>
            <div className="cb-chips">
              {t.windows.map((w) => <button type="button" key={w} className={pickupWindow === w ? 'is-selected' : ''} aria-pressed={pickupWindow === w} onClick={() => setPickupWindow(w)}>{w}</button>)}
            </div>
            <p className="cb-hint">{t.timeHint}</p>
          </section>
        ) : null}

        {step === 'pickup' ? (
          <section aria-labelledby={`q-pickup-${product.id}`}>
            <h3 id={`q-pickup-${product.id}`}><MapPin size={20} /> {t.pickupQ}</h3>
            <p className="cb-hint">{t.pickupHint}</p>
            <GooglePickupField value={hotel} selected={googlePickup} initialValue={initialGoogleHotel} initialRef={initialGoogleRef} region={isBayahibe?'la-romana':'punta-cana'} locale={locale} label={t.pickupQ} placeholder={t.pickupPlaceholder} onChange={value=>{setHotel(value);setGooglePickup(null);setArea(isBayahibe?bayahibeArea:null);setError('');}} onSelect={place=>{setGooglePickup(place);setHotel(place.name);setArea(isBayahibe?bayahibeArea:pickupAreas.find(a=>a.id===place.areaId)||areaFromText(place.name+' '+place.address));setError('');}} />
            {!isBayahibe && hotel.trim().length >= 2 && googlePickup && !exactHotel ? (
              <>
                <p className="cb-hint">{t.notListed}</p>
                <div className="cb-chips">
                  {pickupAreas.map((a) => <button type="button" key={a.id} className={area?.id === a.id ? 'is-selected' : ''} aria-pressed={area?.id === a.id} onClick={() => setArea(a)}>{locale === 'en' ? a.en : a.es}</button>)}
                </div>
              </>
            ) : null}
            {area && hotel.trim() ? <p className={`cb-status cb-status-${area.status}`}>{googlePickup&&!googlePickup.areaId?(locale==='en'?'We will confirm pickup or the meeting point for this exact location.':'Confirmaremos la recogida o el punto de encuentro para esta ubicación exacta.'):statusText}</p> : null}
          </section>
        ) : null}

        {step === 'contact' ? (
          <section aria-labelledby={`q-contact-${product.id}`}>
            <h3 id={`q-contact-${product.id}`}>{t.contactQ}</h3>
            <label className="cb-field"><span>{t.name}</span><input value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} /></label>
            <label className="cb-field"><span>{t.phone}</span><input value={phone} type="tel" autoComplete="tel" placeholder="+1 809 000 0000" onChange={(e) => setPhone(e.target.value)} /></label>
            <label className="cb-field"><span>{t.email}</span><input value={email} type="email" autoComplete="email" placeholder="nombre@email.com" onChange={(e) => setEmail(e.target.value)} /></label>
            <span className="cb-field-label">{t.language}</span>
            <div className="cb-chips">
              {t.languages.map((l) => <button type="button" key={l} className={language === l ? 'is-selected' : ''} aria-pressed={language === l} onClick={() => setLanguage(l)}>{l}</button>)}
            </div>
          </section>
        ) : null}

        {step === 'review' ? (
          <section aria-labelledby={`q-review-${product.id}`}>
            <h3 id={`q-review-${product.id}`}>{t.reviewQ}</h3>
            <dl className="cb-review">
              <div><dt>{t.rowGroup}</dt><dd>{t.people(travelers)} · {fleetText}</dd><button type="button" aria-label={`${t.rowGroup}`} onClick={() => go('group')}><Pencil size={15} /></button></div>
              <div><dt>{t.rowDate}</dt><dd>{date ? fmtDay(date) : ''} · {pickupWindow}</dd><button type="button" aria-label={t.rowDate} onClick={() => go('date')}><Pencil size={15} /></button></div>
              <div><dt>{t.rowPickup}</dt><dd>{hotelForPayload()}</dd><button type="button" aria-label={t.rowPickup} onClick={() => go('pickup')}><Pencil size={15} /></button></div>
              <div><dt>{t.rowContact}</dt><dd>{name} · {phone} · {email}</dd><button type="button" aria-label={t.rowContact} onClick={() => go('contact')}><Pencil size={15} /></button></div>
            </dl>
            <div className="cb-bill">
              {choices.filter((p) => fleet[p.id]).map((p) => <p key={p.id}><span>{fleet[p.id]} × {vehicleName(p, locale)}</span><b>US${fleet[p.id] * p.promo}</b></p>)}
              {zoneFee ? <p><span>{t.zoneFee} Cap Cana</span><b>US${zoneFee}</b></p> : null}
              <p className="cb-bill-total"><span>{t.total}</span><b>US${total}</b></p>
            </div>
            <button type="button" className="cb-pay" onClick={pay} disabled={paying}>
              {paying ? <Loader2 className="spin" size={20} /> : <CreditCard size={20} />} {paying ? t.paying : `${t.pay} · US$${total}`}
            </button>
            <p className="cb-hint"><LockKeyhole size={13} /> {t.protectedBy}</p>
            <p className="cb-hint">{t.afterPay}</p>
          </section>
        ) : null}

        {error ? <p className="cb-error" role="alert">{error}</p> : null}
      </div>

      <div className="cb-wizard-actions">
        {stepIndex > 0 ? <button type="button" className="cb-back" onClick={() => go(STEPS[stepIndex - 1])}><ArrowLeft size={18} /> {t.back}</button> : <span />}
        {step !== 'review' ? (
          <button type="button" className="cb-next" onClick={() => nextFrom(step)} disabled={step === 'date' && !today}>
            {step === 'group' && totals.valid ? `${t.continueWith} · US$${total}` : t.continueWith} <ArrowRight size={18} />
          </button>
        ) : null}
      </div>
      <a className="cb-wa-help" href={whatsappHref(whatsappMessage())} onClick={recordInquiry} data-track-location="booking_wizard"><MessageCircle size={17} /> {t.help}</a>
    </div>
  );
}
