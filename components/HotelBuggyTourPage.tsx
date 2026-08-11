import {
  ArrowLeft,
  BadgeDollarSign,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Hotel,
  ImageIcon,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import BookingCalculator from './BookingCalculator';
import type { HotelBuggyLanding } from '../lib/hotelBuggyLandings';
import type { BuggyProduct } from '../lib/buggyProducts';
import {
  bring,
  faqs,
  included,
  products,
  requirements,
  siteUrl,
  whatsappHref,
} from '../lib/buggyProducts';
import LanguageSwitch from './LanguageSwitch';

type HotelBuggyTourPageProps = {
  hotel: HotelBuggyLanding;
  canonical: string;
  locale?: 'es' | 'en';
};

const gallery = ['/buggy/doble.jpeg', '/buggy/ruta-1.jpeg', '/buggy/ruta-2.jpeg', '/buggy/ruta-3.jpeg'];

const enIncluded = [
  'Round-trip hotel pickup',
  'Buggy according to selected option',
  'Helmet and safety briefing',
  'Multilingual local guide',
  'Coffee, cacao and mamajuana tasting',
  'Cenote stop',
  'Macao Beach visit',
  'Route support during the tour',
];

const enRequirements = [
  'Driver must be 18+ and able to drive.',
  'Minimum age for accompanying children: 3 years.',
  'Not recommended for pregnant travelers or people with severe back problems.',
];

const enBring = [
  'Old clothes that can get muddy.',
  'Swimsuit and towel.',
  'Biodegradable sunscreen and sunglasses.',
  'Optional cash for photos, drinks or souvenirs.',
];

const enFaqs = [
  ['Is the price per person or per vehicle?', 'The listed price is per vehicle depending on the option: single, double or family buggy.'],
  ['Is hotel pickup included?', 'Yes, pickup and return are included from main Bavaro and Punta Cana hotel zones.'],
  ['Do we visit Macao Beach?', 'Yes, the route normally includes Macao Beach and a cenote stop, subject to daily operations.'],
  ['Will I get muddy?', 'Yes. This is an off-road buggy experience with mud, rural roads and water stops. Old clothes are recommended.'],
];

function zoneForCalculator(zone: string) {
  if (zone.includes('Uvero')) return 'Uvero Alto';
  if (zone.includes('Cap Cana')) return 'Cap Cana';
  if (zone.includes('Cabeza')) return 'Cabeza de Toro';
  if (zone.includes('Macao')) return 'Macao';
  return 'Bavaro / Punta Cana';
}

function titleFor(product: BuggyProduct, locale: 'es' | 'en') {
  if (locale === 'en') return product.title.replace('Familiar', 'Family').replace('Doble', 'Double').replace('Individual', 'Single');
  return product.title;
}

export default function HotelBuggyTourPage({ hotel, canonical, locale = 'es' }: HotelBuggyTourPageProps) {
  const isEn = locale === 'en';
  const featuredProduct = products.find((product) => product.popular) ?? products[0];
  const pageCopy = isEn
    ? {
        navPrices: 'Prices',
        navRoute: 'Route',
        navIncluded: 'Included',
        navFaq: 'FAQ',
        reserve: 'Book now',
        back: 'All buggy options',
        breadcrumb: 'Hotel pickup',
        eyebrow: `Pickup from ${hotel.zone}`,
        h1: `Buggy tour from ${hotel.name}`,
        intro: `Book a Punta Cana buggy tour from ${hotel.name} with coordinated pickup, Macao off-road trails, Dominican ranch, cenote stop and Macao Beach.`,
        badgePrice: `From US$${featuredProduct.promo}`,
        badgeTime: 'Approx. 4 hours',
        badgePickup: 'Hotel pickup',
        cta: `Book from ${hotel.name}`,
        whatsapp: 'Ask on WhatsApp',
        price: `From US$${featuredProduct.promo}`,
        priceNote: 'Secure payment by card or PayPal',
        facts: ['Zone', 'Estimated drive to ranch', 'Options', 'Pickup'],
        options: 'Single, double or family buggy',
        how: 'How pickup works',
        h2: `Buggy pickup organized from ${hotel.name}`,
        body: `After booking, our team confirms your exact pickup time by WhatsApp according to the selected departure. You receive clear instructions for the authorized pickup point at ${hotel.name}. At the ranch, the team gives a safety briefing, assigns the reserved buggy option and guides the Macao route.`,
        important: `Important details for ${hotel.name}`,
        bring: 'What to bring',
        ready: 'Ready for mud, water and photos',
        itinerary: 'Tour flow',
        itineraryTitle: 'From hotel pickup to Macao adventure',
        steps: [
          ['Pickup coordination', `We confirm the closest authorized pickup point for ${hotel.name}.`],
          ['Ranch check-in', 'Safety briefing, helmet and buggy assignment.'],
          ['Off-road route', 'Macao rural roads, mud trails and local stops.'],
          ['Cenote and beach', 'Time for photos, water stop and Macao Beach depending on operation.'],
        ],
        more: 'More buggy options',
        related: 'Compare options before booking',
        faq: `Questions about buggy tours from ${hotel.name}`,
      }
    : {
        navPrices: 'Precios',
        navRoute: 'Ruta',
        navIncluded: 'Incluye',
        navFaq: 'FAQ',
        reserve: 'Reservar',
        back: 'Todos los buggies',
        breadcrumb: 'Recogida en hotel',
        eyebrow: `Recogida desde ${hotel.zone}`,
        h1: `Buggy tour desde ${hotel.name}`,
        intro: `Reserva un tour en buggy desde ${hotel.name} con recogida coordinada, ruta off-road en Macao, rancho dominicano, cenote y Playa Macao.`,
        badgePrice: `Desde US$${featuredProduct.promo}`,
        badgeTime: 'Aprox. 4 horas',
        badgePickup: 'Pickup en hotel',
        cta: `Reservar desde ${hotel.name}`,
        whatsapp: 'Preguntar por WhatsApp',
        price: `Desde US$${featuredProduct.promo}`,
        priceNote: 'Pago seguro con tarjeta o PayPal',
        facts: ['Zona', 'Tiempo estimado al rancho', 'Modalidades', 'Pickup'],
        options: 'Individual, doble o familiar',
        how: 'Como funciona',
        h2: `Ruta organizada para huespedes de ${hotel.name}`,
        body: `Despues de reservar, nuestro equipo confirma la hora exacta por WhatsApp segun la tanda seleccionada. Recibes instrucciones claras para el punto autorizado de ${hotel.name}. En el rancho recibes instrucciones de seguridad, el buggy reservado y sales con guia por la ruta de Macao.`,
        important: `Detalles importantes para ${hotel.name}`,
        bring: 'Que llevar',
        ready: 'Preparado para lodo, agua y fotos',
        itinerary: 'Itinerario',
        itineraryTitle: 'Del pickup en hotel a la aventura en Macao',
        steps: [
          ['Coordinacion de recogida', `Confirmamos el punto autorizado mas cercano para ${hotel.name}.`],
          ['Llegada al rancho', 'Instrucciones de seguridad, casco y asignacion del buggy.'],
          ['Ruta off-road', 'Caminos rurales de Macao, lodo y paradas locales.'],
          ['Cenote y playa', 'Tiempo para fotos, parada de agua y Playa Macao segun operacion.'],
        ],
        more: 'Mas opciones de buggy',
        related: 'Compara opciones antes de reservar',
        faq: `Preguntas sobre buggy desde ${hotel.name}`,
      };

  const listIncluded = isEn ? enIncluded : included;
  const listRequirements = isEn ? enRequirements : requirements;
  const listBring = isEn ? enBring : bring;
  const listFaqs = isEn ? enFaqs : faqs;

  return (
    <main className="hotel-tour-page">
      <header className="site-header">
        <a className="brand" href={isEn ? '/en' : '/'} aria-label="Caribbean Buggy">
          <span>Caribbean</span>
          <b>Buggy</b>
        </a>
        <nav aria-label={isEn ? 'Tour detail' : 'Detalle'}>
          <a href="#prices">{pageCopy.navPrices}</a>
          <a href="#route">{pageCopy.navRoute}</a>
          <a href="#included">{pageCopy.navIncluded}</a>
          <a href="#faq">{pageCopy.navFaq}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch
            current={isEn ? 'en' : 'es'}
            esHref={`/buggy/hotel/${hotel.slug}`}
            enHref={`/en/buggy/hotel/${hotel.slug}`}
          />
          <a className="header-cta" href="#book">{pageCopy.reserve}</a>
        </div>
      </header>

      <section className="tour-shell">
        <div className="wrap tour-detail-grid">
          <article className="tour-main">
            <a className="tour-back" href={isEn ? '/en' : '/'}>
              <ArrowLeft size={16} /> {pageCopy.back}
            </a>
            <div className="tour-breadcrumb">
              Caribbean Buggy / {pageCopy.breadcrumb} / {hotel.name}
            </div>
            <div className="tour-topline">
              <span>5.0/5</span>
              <span>Verified local pickup</span>
              <span>{hotel.zone}</span>
            </div>
            <h1>{pageCopy.h1}</h1>
            <p className="tour-lead">{pageCopy.intro}</p>

            <div className="tour-gallery" aria-label={isEn ? 'Buggy tour photos' : 'Fotos del tour en buggy'}>
              <img className="tour-gallery-main" src="/buggy/doble.jpeg" alt={pageCopy.h1} />
              <div className="tour-gallery-side">
                {gallery.slice(1).map((image, index) => (
                  <img key={image} src={image} alt={`${pageCopy.h1} ${index + 2}`} />
                ))}
                <a href="#book" className="tour-photo-count">
                  <ImageIcon size={16} /> {isEn ? 'Book this route' : 'Reservar esta ruta'}
                </a>
              </div>
            </div>

            <div className="tour-quick-facts">
              <span><BadgeDollarSign size={18} /> {pageCopy.badgePrice}</span>
              <span><Clock3 size={18} /> {pageCopy.badgeTime}</span>
              <span><Hotel size={18} /> {pageCopy.badgePickup}</span>
              <span><ShieldCheck size={18} /> WhatsApp support</span>
            </div>

            <section id="included" className="tour-section">
              <span className="tour-kicker">{pageCopy.how}</span>
              <h2>{pageCopy.h2}</h2>
              <p>{pageCopy.body}</p>
              <div className="tour-checklist">
                {listIncluded.map((item) => (
                  <span key={item}><CheckCircle2 size={17} /> {item}</span>
                ))}
              </div>
            </section>

            <section id="route" className="tour-section">
              <span className="tour-kicker">{pageCopy.itinerary}</span>
              <h2>{pageCopy.itineraryTitle}</h2>
              <div className="tour-steps">
                {pageCopy.steps.map(([title, body], index) => (
                  <article key={title}>
                    <b>{index + 1}</b>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="tour-section tour-two-columns">
              <article>
                <span className="tour-kicker">{isEn ? 'Before booking' : 'Antes de reservar'}</span>
                <h2>{pageCopy.important}</h2>
                <ul>{listRequirements.map((item) => <li key={item}>{item}</li>)}</ul>
                <ul>
                  <li>{hotel.pickupNote}</li>
                  <li>{isEn ? 'Exact pickup time may vary by route, traffic and confirmed departure.' : 'La hora exacta puede variar por ruta de recogida, trafico y tanda confirmada.'}</li>
                </ul>
              </article>
              <article>
                <span className="tour-kicker">{pageCopy.bring}</span>
                <h2>{pageCopy.ready}</h2>
                <ul>{listBring.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </section>

            <section className="tour-section">
              <span className="tour-kicker">{pageCopy.more}</span>
              <h2>{pageCopy.related}</h2>
              <div className="tour-related">
                {products.map((product) => (
                  <a href={`${isEn ? '/en' : ''}/buggy/${product.id}`} key={product.id}>
                    <img src={product.image} alt={titleFor(product, locale)} />
                    <div>
                      <span>{product.subtitle}</span>
                      <b>{titleFor(product, locale)}</b>
                      <strong>US${product.promo}</strong>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section id="faq" className="tour-section">
              <span className="tour-kicker">FAQ</span>
              <h2>{pageCopy.faq}</h2>
              <div className="tour-faq">
                {listFaqs.map(([question, answer]) => (
                  <article key={question}>
                    <h3>{question}</h3>
                    <p>{answer}</p>
                  </article>
                ))}
              </div>
            </section>
          </article>

          <aside id="book" className="tour-sidebar">
            <div id="prices" className="tour-price-card">
              <span>{pageCopy.price}</span>
              <strong>US${featuredProduct.promo}</strong>
              <small>{pageCopy.priceNote}</small>
              <a href="#booking-form">{pageCopy.reserve}</a>
            </div>
            <div className="tour-hotel-card">
              <article><MapPin size={18} /><b>{pageCopy.facts[0]}</b><span>{hotel.zone}</span></article>
              <article><Clock3 size={18} /><b>{pageCopy.facts[1]}</b><span>{hotel.driveTime}</span></article>
              <article><Users size={18} /><b>{pageCopy.facts[2]}</b><span>{pageCopy.options}</span></article>
              <article><ShieldCheck size={18} /><b>{pageCopy.facts[3]}</b><span>{hotel.pickupNote}</span></article>
            </div>
            <div id="booking-form">
              <BookingCalculator
                product={featuredProduct}
                defaultHotel={hotel.name}
                defaultPickupZone={zoneForCalculator(hotel.zone)}
                locale={locale}
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
