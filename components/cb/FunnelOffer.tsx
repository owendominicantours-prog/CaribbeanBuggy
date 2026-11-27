'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, MapPin, MessageCircle, Minus, Plus } from 'lucide-react';
import { products, pickupZones, whatsappHref } from '../../lib/buggyProducts';
import { fleetOptions, money } from '../../lib/bookingFleet';
import { areaFromText, pickupAreas, bayahibeArea, type PickupArea } from '../../lib/pickupLookup';
import type {GooglePickup} from '../../lib/googlePickup';
import GooglePickupField from './GooglePickupField';

type Locale = 'es' | 'en';
type Destination = 'punta-cana' | 'bayahibe';
export type FunnelSource = { pageType: 'home' | 'search' | 'question' | 'guide'; slug: string };

const T = {
  es: {
    people: (n: number) => (n === 1 ? '1 persona' : `${n} personas`),
    best: 'Mejor opción',
    perPerson: 'por persona',
    total: 'total',
    hotel: '¿Dónde te hospedas?',
    hotelPh: 'Escribe tu hotel',
    included: 'Recogida incluida en tu hotel',
    meeting: 'Sin recogida en tu zona: encuentro en KFC Downtown',
    capcana: 'Cap Cana: cargo de zona de US$10 incluido en el total',
    bayahibe: 'Recogida o punto de encuentro confirmado por WhatsApp',
    unknown: 'Si no aparece, eliges la zona al reservar',
    cta: 'Elegir fecha y reservar',
    note: 'Pagas al final, con tarjeta. Sin cargos escondidos.',
    ask: '¿Una duda antes? WhatsApp',
    single: 'individual', double: 'doble', family: 'familiar',
  },
  en: {
    people: (n: number) => (n === 1 ? '1 traveler' : `${n} travelers`),
    best: 'Best option',
    perPerson: 'per person',
    total: 'total',
    hotel: 'Where are you staying?',
    hotelPh: 'Type your hotel',
    included: 'Pickup included at your hotel',
    meeting: 'No pickup in your area: meet at KFC Downtown',
    capcana: 'Cap Cana: US$10 zone fee included in the total',
    bayahibe: 'Pickup or meeting point confirmed on WhatsApp',
    unknown: 'Not listed? You choose the area while booking',
    cta: 'Choose a date and book',
    note: 'You pay at the end, by card. No hidden fees.',
    ask: 'A question first? WhatsApp',
    single: 'single', double: 'double', family: 'family',
  },
};

function push(event: string, data: Record<string, unknown>) {
  window.dataLayer?.push({ event, ...data });
}

/**
 * The conversion block of the SEO funnel. Same quote engine as the booking (fleetOptions),
 * The selected pickup area's existing fee is included, matching the booking total.
 */
export default function FunnelOffer({
  locale,
  destination = 'punta-cana',
  defaultTravelers = 2,
  title,
  source,
  showAsk = false,
}: {
  locale: Locale;
  destination?: Destination;
  defaultTravelers?: number;
  title: string;
  source: FunnelSource;
  showAsk?: boolean;
}) {
  const t = T[locale];
  const bayahibe = destination === 'bayahibe';
  const choices = useMemo(() => products.filter((p) => p.destination.includes('Bayahibe') === bayahibe), [bayahibe]);
  const [travelers, setTravelers] = useState(defaultTravelers);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<GooglePickup | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const best = useMemo(() => fleetOptions(choices, travelers, 1)[0], [choices, travelers]);
  const track = { page_type: source.pageType, page_slug: source.slug, destination };

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { push('funnel_offer_view', { page_type: source.pageType, page_slug: source.slug, destination }); observer.disconnect(); }
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [source.pageType, source.slug, destination]);

  const area: PickupArea | null = picked ? pickupAreas.find(a=>a.id===picked.areaId)||(bayahibe?bayahibeArea:areaFromText(picked.name+' '+picked.address)) : null;
  const zoneFee = area ? (pickupZones.find((zone) => zone.label === area.calculatorZone)?.fee ?? 0) : 0;
  const quoteTotal = (best?.total ?? 0) + zoneFee;
  const label = (cap: number) => (cap === 1 ? t.single : cap === 2 ? t.double : t.family);
  const fleetText = best ? choices.filter((p) => best.fleet[p.id]).map((p) => `${best.fleet[p.id]} ${label(p.capacityNumber)}`).join(' + ') : '';
  const target = (() => {
    const pick = (cap: number) => choices.find((p) => p.capacityNumber === cap)?.id;
    if (travelers === 1) return pick(1);
    if (best && Object.keys(best.fleet).length === 1 && best.fleet[pick(4) || '']) return pick(4);
    return pick(2);
  })() || choices[0].id;
  const params = new URLSearchParams({ personas: String(travelers) });
  if(picked){params.set('pickupGoogleRef',picked.id);params.set('pickupHotel',picked.name);}
  const href = `${locale === 'en' ? '/en' : ''}/buggy/${target}?${params.toString()}#${locale === 'en' ? 'book' : 'reservar'}`;
  const status = picked&&!picked.areaId?(locale==='en'?'We confirm pickup or the meeting point for your exact location.':'Confirmamos la recogida o el punto de encuentro para tu ubicación exacta.'):picked && bayahibe
    ? t.bayahibe
    : area
      ? ({ included: t.included, meeting: t.meeting, capcana: t.capcana, bayahibe: t.bayahibe } as const)[area.status]
      : query.trim().length >= 3 ? t.unknown : '';

  function changeTravelers(next: number) {
    const value = Math.max(1, Math.min(20, next));
    setTravelers(value);
    push('funnel_quote_change', { ...track, travelers: value });
  }

  return (
    <div className="cb-quote" ref={rootRef} data-funnel={source.pageType}>
      <span className="cb-quote-title">{title}</span>
      <div className="cb-stepper cb-stepper-light">
        <button type="button" aria-label="−1" onClick={() => changeTravelers(travelers - 1)} disabled={travelers <= 1}><Minus size={18} /></button>
        <output aria-live="polite">{t.people(travelers)}</output>
        <button type="button" aria-label="+1" onClick={() => changeTravelers(travelers + 1)} disabled={travelers >= 20}><Plus size={18} /></button>
      </div>
      {best ? (
        <div className="cb-quote-price" aria-live="polite">
          <small>{t.best}: {fleetText}</small>
          <strong>US${money(quoteTotal / travelers)}<em> {t.perPerson}</em></strong>
          <span>US${quoteTotal} {t.total}</span>
        </div>
      ) : null}
      <div className="cb-quote-hotel"><span><MapPin size={15} /> {t.hotel}</span>
        <GooglePickupField value={query} selected={picked} region={bayahibe?'la-romana':'punta-cana'} locale={locale} label={t.hotel} placeholder={t.hotelPh} onChange={value=>{setQuery(value);setPicked(null);}} onSelect={place=>{setPicked(place);setQuery(place.name);push('funnel_hotel_check',{...track,hotel_slug:place.id,pickup_status:place.areaId||'confirmation'});}} />
      </div>
      {status ? <p className={`cb-status cb-status-${picked && bayahibe ? 'bayahibe' : area?.status || 'unknown'}`}>{status}</p> : null}
      <a className="cb-cta" href={href} data-track-event="booking_cta_click" data-track-location={`funnel_${source.pageType}`} onClick={() => push('funnel_cta_click', { ...track, travelers, value: best ? quoteTotal : undefined, currency: 'USD', target_product: target })}>{t.cta} <ArrowRight size={18} /></a>
      <p className="cb-quote-note">{t.note}</p>
      {showAsk ? <a className="cb-quote-ask" href={whatsappHref(`${locale === 'en' ? 'Hello Caribbean Buggy, I have a question before booking' : 'Hola Caribbean Buggy, tengo una duda antes de reservar'} (${source.pageType}: ${source.slug}).`)} onClick={() => push('funnel_whatsapp_click', track)}><MessageCircle size={15} /> {t.ask}</a> : null}
    </div>
  );
}
