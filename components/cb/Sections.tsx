import Image from 'next/image';
import { ArrowRight, Check, Clock3, MapPin, Shirt, ShieldAlert, Users, X } from 'lucide-react';
import { pickupPolicy } from '../../lib/pickupPolicy';
import type { BuggyProduct } from '../../lib/buggyProducts';
import { guidePath, type SeoGuide } from '../../lib/seoGuides';
import type { HotelBuggyLanding } from '../../lib/hotelBuggyLandings';
import { hotelBuggyPath } from '../../lib/hotelBuggyLandings';
import { areaForHotel } from '../../lib/pickupLookup';
import { money } from '../../lib/bookingFleet';

type Locale = 'es' | 'en';

export function SectionHead({ kicker, title, body, id }: { kicker: string; title: string; body?: string; id?: string }) {
  return (
    <div className="cb-head" id={id}>
      <span className="cb-kicker">{kicker}</span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

/** The four questions people used to ask on WhatsApp, answered before they need to ask. */
export function QuickAnswers({ locale, bayahibe = false }: { locale: Locale; bayahibe?: boolean }) {
  const en = locale === 'en';
  const items = bayahibe
    ? [
        [Users, en ? 'Price per buggy' : 'Precio por buggy', en ? 'Single US$75, double US$145, family (up to 4) US$290.' : 'Individual US$75, doble US$145, familiar (hasta 4) US$290.'],
        [MapPin, en ? 'Pickup' : 'Recogida', en ? 'Pickup or meeting point confirmed on WhatsApp for your Bayahibe or La Romana hotel.' : 'Recogida o punto de encuentro confirmado por WhatsApp según tu hotel de Bayahibe o La Romana.'],
        [Clock3, en ? 'About 4 hours' : 'Unas 4 horas', en ? 'Sugar-cane roads, mud trails and a Chavón River stop.' : 'Cañaverales, caminos de lodo y parada en el río Chavón.'],
        [Shirt, en ? 'You will get muddy' : 'Te vas a ensuciar', en ? 'Old clothes, swimsuit, towel and closed shoes.' : 'Ropa vieja, traje de baño, toalla y calzado cerrado.'],
      ] as const
    : [
        [Users, en ? 'From US$30 per person' : 'Desde US$30 por persona', en ? 'You pay per buggy: double US$60 (2 people), family US$120 (up to 4), single US$50.' : 'Se paga por buggy: doble US$60 (2 personas), familiar US$120 (hasta 4), individual US$50.'],
        [MapPin, en ? 'Pickup in covered areas' : 'Recogida en zonas cubiertas', en ? 'Included from Bávaro, El Cortecito, Cabeza de Toro, Macao and Uvero Alto. Verón and the airport area meet at KFC Downtown.' : 'Incluida desde Bávaro, El Cortecito, Cabeza de Toro, Macao y Uvero Alto. Verón y la zona del aeropuerto: encuentro en el KFC de Downtown.'],
        [Clock3, en ? 'About 4 hours in total' : 'Unas 4 horas en total', en ? '2.5–3 hours of driving and stops: ranch, cenote and Macao Beach.' : '2.5 a 3 horas de conducción y paradas: rancho, cenote y Playa Macao.'],
        [Shirt, en ? 'You will get muddy' : 'Te vas a ensuciar', en ? 'Old clothes, swimsuit, towel and closed shoes. Drivers must be 18+.' : 'Ropa vieja, traje de baño, toalla y calzado cerrado. Conductor mayor de 18 años.'],
      ] as const;
  return (
    <div className="cb-answers">
      {items.map(([Icon, title, body]) => (
        <article key={title}><Icon size={22} /><b>{title}</b><p>{body}</p></article>
      ))}
    </div>
  );
}

export function DayTimeline({ steps, photos }: { steps: Array<{ time: string; title: string; description: string }>; photos?: string[] }) {
  return (
    <ol className="cb-timeline">
      {steps.map((step, i) => (
        <li key={step.title}>
          <span className="cb-timeline-dot">{i + 1}</span>
          <div>
            <small>{step.time}</small>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
          {photos?.[i] ? <Image src={photos[i]} alt={step.title} width={360} height={240} sizes="(max-width: 760px) 40vw, 180px" /> : null}
        </li>
      ))}
    </ol>
  );
}

export function PickupPanel({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const p = pickupPolicy[locale];
  const en = locale === 'en';
  return (
    <div className={`cb-pickup ${compact ? 'is-compact' : ''}`}>
      <div className="cb-pickup-yes">
        <h3><Check size={20} /> {en ? 'Pickup and return included' : 'Recogida y regreso incluidos'}</h3>
        <ul className="cb-zone-list">{p.zones.map((z: string) => <li key={z}>{z}</li>)}</ul>
        <p>{p.clarify}</p>
      </div>
      <div className="cb-pickup-kfc">
        <h3><MapPin size={20} /> {en ? 'Verón and PUJ airport area: KFC Downtown' : 'Verón y zona del aeropuerto PUJ: KFC Downtown'}</h3>
        <p>{p.meeting}</p>
      </div>
      {!compact ? <p className="cb-pickup-note">{p.timing} {p.other}</p> : null}
    </div>
  );
}

export function IncludedPanel({ locale, included, notIncluded, requirements, bring }: { locale: Locale; included: string[]; notIncluded?: string[]; requirements: string[]; bring: string[] }) {
  const en = locale === 'en';
  return (
    <div className="cb-included">
      <article className="cb-card cb-card-yes"><h3>{en ? 'Included' : 'Incluye'}</h3><ul>{included.map((i) => <li key={i}><Check size={17} />{i}</li>)}</ul></article>
      {notIncluded?.length ? <article className="cb-card cb-card-no"><h3>{en ? 'Not included' : 'No incluye'}</h3><ul>{notIncluded.map((i) => <li key={i}><X size={17} />{i}</li>)}</ul></article> : null}
      <article className="cb-card cb-card-warn"><h3><ShieldAlert size={19} /> {en ? 'Before you book' : 'Antes de reservar'}</h3><ul>{requirements.map((i) => <li key={i}>{i}</li>)}</ul></article>
      <article className="cb-card"><h3><Shirt size={19} /> {en ? 'What to bring' : 'Qué llevar'}</h3><ul>{bring.map((i) => <li key={i}>{i}</li>)}</ul></article>
    </div>
  );
}

export function FaqList({ faqs, openFirst = true }: { faqs: Array<[string, string]> | string[][]; openFirst?: boolean }) {
  return (
    <div className="cb-faq">
      {faqs.map(([q, a], i) => (
        <details key={q} open={openFirst && i === 0}><summary>{q}</summary><p>{a}</p></details>
      ))}
    </div>
  );
}

export function GuideCards({ guides, locale, withImages = true }: { guides: SeoGuide[]; locale: Locale; withImages?: boolean }) {
  return (
    <div className="cb-guides">
      {guides.map((g) => (
        <a key={g.id} href={guidePath(g, locale)}>
          {withImages ? <Image src={g.image} alt={g[locale].title} width={520} height={340} sizes="(max-width: 760px) 100vw, 33vw" /> : null}
          <span>{g[locale].eyebrow}</span>
          <b>{g[locale].title}</b>
          <em>{locale === 'en' ? 'Read guide' : 'Leer guía'} <ArrowRight size={15} /></em>
        </a>
      ))}
    </div>
  );
}

export function HotelLinks({ hotels, locale, timeLabel }: { hotels: HotelBuggyLanding[]; locale: Locale; timeLabel: string }) {
  const en = locale === 'en';
  return (
    <div className="cb-hotels">
      {hotels.map((h) => {
        const area = areaForHotel(h);
        const tag = area.status === 'meeting' ? (en ? 'KFC meeting point' : 'Encuentro KFC') : area.status === 'capcana' ? 'Cap Cana' : (en ? 'Pickup included' : 'Recogida incluida');
        return (
          <a key={h.slug} href={hotelBuggyPath(h.slug, locale)} data-hotel-slug={h.slug}>
            <span>{h.zone}</span>
            <b>{h.name}</b>
            <small>{h.driveTime} {timeLabel} · <em className={`is-${area.status}`}>{tag}</em></small>
          </a>
        );
      })}
    </div>
  );
}

export function ProductCards({ items, locale, compact = false }: { items: BuggyProduct[]; locale: Locale; compact?: boolean }) {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const name = (p: BuggyProduct) => (en ? p.title.replace('Bayahibe ', 'Bayahibe ').replace('Buggy Individual', 'Single Buggy').replace('Buggy Doble', 'Double Buggy').replace('Buggy Familiar', 'Family Buggy') : p.title);
  const who = (p: BuggyProduct) => (p.capacityNumber === 1 ? (en ? 'For 1 person · you drive all the way' : 'Para 1 persona · manejas todo el recorrido') : p.capacityNumber === 2 ? (en ? 'For 2 people · driver + passenger' : 'Para 2 personas · piloto + copiloto') : (en ? 'Up to 4 people · one vehicle for the group' : 'Hasta 4 personas · el grupo junto'));
  return (
    <div className={`cb-products ${compact ? 'is-compact' : ''}`}>
      {items.map((p) => {
        const perPerson = money(p.promo / p.capacityNumber);
        return (
          <a key={p.id} className={`cb-product ${p.popular ? 'is-featured' : ''}`} href={`${base}/buggy/${p.id}`}>
            <Image src={p.image} alt={name(p)} width={640} height={420} sizes="(max-width: 760px) 100vw, 33vw" />
            {p.popular ? <span className="cb-badge">{en ? 'Recommended' : 'Recomendado'}</span> : null}
            <div>
              <h3>{name(p)}</h3>
              <p>{who(p)}</p>
              <div className="cb-price">
                <strong>US${perPerson}</strong><span>{en ? 'per person' : 'por persona'}</span>
              </div>
              <small>{p.capacityNumber === 1 ? (en ? `US$${p.promo} per buggy` : `US$${p.promo} por buggy`) : (en ? `US$${p.promo} per buggy · ${p.capacityNumber} seats` : `US$${p.promo} por buggy · ${p.capacityNumber} plazas`)}</small>
              <em>{en ? 'See details and book' : 'Ver detalles y reservar'} <ArrowRight size={16} /></em>
            </div>
          </a>
        );
      })}
    </div>
  );
}

export function PhotoGallery({ photos, locale }: { photos: Array<{ src: string; es: string; en: string; width: number; height: number }>; locale: Locale }) {
  return (
    <div className="cb-photos">
      {photos.map((p, i) => (
        <figure key={p.src} className={i === 0 ? 'is-wide' : ''}>
          <Image src={p.src} alt={p[locale]} width={p.width} height={p.height} sizes={i === 0 ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 25vw'} />
          <figcaption>{p[locale]}</figcaption>
        </figure>
      ))}
    </div>
  );
}
