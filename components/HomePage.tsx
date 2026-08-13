import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  Camera,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Coffee,
  CreditCard,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import LanguageSwitch from './LanguageSwitch';
import {
  bring,
  faqs,
  included,
  products,
  requirements,
  siteUrl,
  whatsappHref,
  type BuggyProduct,
} from '../lib/buggyProducts';
import { getFeaturedHotelBuggyLandings, hotelBuggyUrl } from '../lib/hotelBuggyLandings';
import { questionsPath } from '../lib/buggyQuestions';
import { guidePath, guidesPath, seoGuides } from '../lib/seoGuides';
import { TripAdvisorReviewLink } from './TripAdvisorReviews';
import { tripadvisorSchemaReference } from '../lib/tripadvisor';

type Locale = 'es' | 'en';

const englishFaqs: Array<[string, string]> = [
  ['Is the price per person or per vehicle?', 'The displayed price is per vehicle according to the selected single, double or family option.'],
  ['Is hotel pickup included?', 'Yes. Pickup and return are included from the main Bavaro and Punta Cana hotel zones.'],
  ['Do we visit Macao Beach?', 'Yes. The route normally includes Macao Beach and a cenote stop, subject to daily operating conditions.'],
  ['Will I get muddy?', 'Yes. This is a real off-road experience with mud, rural roads and water. Wear clothes you do not mind getting dirty.'],
];

const englishIncluded = [
  'Round-trip hotel transportation',
  'Buggy according to selected option',
  'Helmet and safety equipment',
  'Multilingual local guide',
  'Coffee, cacao and mamajuana tasting',
  'Private cenote stop',
  'Macao Beach visit',
  'Route assistance',
];

const englishRequirements = [
  'Drivers must be 18+ and know how to drive.',
  'Minimum age for accompanying children: 3 years.',
  'Not suitable for pregnant travelers or guests with severe back problems.',
];

const englishBring = [
  'Old clothes that can get muddy.',
  'Swimsuit and towel.',
  'Biodegradable sunscreen and sunglasses.',
  'Optional cash for drinks, photos or souvenirs.',
];

export function englishProductTitle(title: string) {
  return title
    .replace('Bayahibe Buggy Individual', 'Bayahibe Single Buggy')
    .replace('Bayahibe Buggy Doble', 'Bayahibe Double Buggy')
    .replace('Bayahibe Buggy Familiar', 'Bayahibe Family Buggy')
    .replace('Buggy Individual', 'Single Buggy')
    .replace('Buggy Doble', 'Double Buggy')
    .replace('Buggy Familiar', 'Family Buggy');
}

function productTitle(product: BuggyProduct, locale: Locale) {
  return locale === 'en' ? englishProductTitle(product.title) : product.title;
}

function productDescription(product: BuggyProduct, locale: Locale) {
  if (locale === 'es') return product.description;
  if (product.destination.includes('Bayahibe')) {
    return 'Drive rural off-road trails from Bayahibe and La Romana with coordinated pickup and local route support.';
  }
  return 'Explore Macao mud trails, a Dominican ranch, cenote and beach with coordinated hotel pickup.';
}

function productCapacity(product: BuggyProduct, locale: Locale) {
  if (locale === 'es') return product.capacityLabel;
  if (product.capacityNumber === 1) return '1 driver';
  if (product.capacityNumber === 2) return 'Driver + passenger';
  return 'Up to 4 travelers';
}

function productNote(product: BuggyProduct, locale: Locale) {
  if (locale === 'es') return product.note;
  return product.capacityNumber === 4 ? 'Total for all 4 seats' : 'Price per vehicle';
}

function bookingMessage(locale: Locale, option?: string) {
  if (locale === 'en') {
    return [
      `Hello Proactivitis, I want to book ${option || 'a buggy tour'} with Caribbean Buggy.`,
      '',
      'Tour date:',
      'Hotel or pickup area:',
      'Number of travelers:',
      'Customer name:',
      '',
      'Please confirm availability and pickup time.',
    ].join('\n');
  }

  return [
    `Hola Proactivitis, quiero reservar ${option || 'un tour en buggy'} con Caribbean Buggy.`,
    '',
    'Fecha del tour:',
    'Hotel o zona de recogida:',
    'Cantidad de personas:',
    'Nombre del cliente:',
    '',
    'Por favor confírmame disponibilidad y hora de recogida.',
  ].join('\n');
}

export function buildHomeSchema(locale: Locale) {
  const isEn = locale === 'en';
  const homeUrl = isEn ? `${siteUrl}/en` : siteUrl;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Caribbean Buggy',
        url: siteUrl,
        areaServed: 'Punta Cana, Dominican Republic',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'reservations',
          telephone: '+1-829-475-6298',
          availableLanguage: ['Spanish', 'English'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Caribbean Buggy',
        url: siteUrl,
        inLanguage: isEn ? 'en-US' : 'es-DO',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'ItemList',
        name: isEn ? 'Buggy tours in Punta Cana and Bayahibe' : 'Tours en buggy en Punta Cana y Bayahibe',
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: productTitle(product, locale),
            description: productDescription(product, locale),
            image: `${siteUrl}${product.image}`,
            sku: product.id,
            brand: { '@type': 'Brand', name: 'Caribbean Buggy' },
            ...tripadvisorSchemaReference(product.destination.includes('Bayahibe') ? 'bayahibe' : 'punta-cana', locale),
            offers: {
              '@type': 'Offer',
              price: product.promo,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: `${homeUrl}/buggy/${product.id}`,
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: (isEn ? englishFaqs : faqs).map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}

export default function HomePage({ locale }: { locale: Locale }) {
  const isEn = locale === 'en';
  const featuredHotels = getFeaturedHotelBuggyLandings();
  const base = isEn ? '/en' : '';
  const puntaCanaProducts = products.filter((product) => !product.destination.includes('Bayahibe'));
  const bayahibeProducts = products.filter((product) => product.destination.includes('Bayahibe'));
  const pageFaqs = isEn ? englishFaqs : faqs;
  const pageIncluded = isEn ? englishIncluded : included;
  const pageRequirements = isEn ? englishRequirements : requirements;
  const pageBring = isEn ? englishBring : bring;
  const sectionIds = {
    prices: isEn ? 'prices' : 'precios',
    route: isEn ? 'route' : 'ruta',
    included: isEn ? 'included' : 'incluye',
    faq: 'faq',
  };

  const copy = isEn
    ? {
        prices: 'Prices', route: 'Route', included: 'Included', faq: 'FAQ', book: 'Book now',
        eyebrow: 'Punta Cana · Macao Beach · Hotel pickup',
        title: 'The Punta Cana buggy tour you came for.',
        intro: 'Mud, rural trails, Dominican culture, cenote and Macao Beach—with direct pricing and coordinated hotel pickup.',
        seeOptions: 'See buggy options', ask: 'Ask on WhatsApp',
        heroProof: ['Secure card or PayPal payment', 'Pickup coordinated by WhatsApp', 'Clear price per vehicle'],
        from: 'From', dealBody: 'Single buggy with round-trip transportation included.',
        dealItems: ['Hotel pickup', 'Cenote + Macao Beach', 'Local guide and safety equipment'], dealCta: 'Choose your buggy',
        highlights: [
          ['Pickup included', 'Round-trip transport from main Punta Cana and Bavaro hotel zones.', Car],
          ['Real off-road route', 'Mud trails, Macao Beach, Dominican ranch and cenote.', MapPin],
          ['Direct pricing', 'Clear prices per vehicle with no hotel desk commissions.', BadgeDollarSign],
          ['Secure booking', 'Pay by card or PayPal and receive clear instructions.', ShieldCheck],
        ] as Array<[string, string, LucideIcon]>,
        optionsKicker: 'Choose your destination', optionsTitle: 'One clear price. The right buggy for your group.',
        optionsBody: 'Compare capacity and destination first, then complete the booking form in a few steps.',
        pcTitle: 'Punta Cana & Macao', pcBody: 'Hotel pickup, mud trails, ranch, cenote and Macao Beach.',
        byTitle: 'Bayahibe & La Romana', byBody: 'Rural 4x4 route with coordinated local pickup.',
        popular: 'Most booked', before: 'Before', details: 'View details and book',
        bookingKicker: 'Simple booking', bookingTitle: 'Reserve in three clear steps.',
        bookingBody: 'No long messages or confusing quotes. Choose the tour, add pickup details and pay securely.',
        bookingSteps: [
          ['Choose your buggy', 'Compare single, double or family capacity and select your destination.', Users],
          ['Add date and hotel', 'Tell us when you are going and where we should coordinate pickup.', CalendarDays],
          ['Confirm securely', 'Review the total and pay by card or PayPal.', CreditCard],
        ] as Array<[string, string, LucideIcon]>,
        routeKicker: 'The experience', routeTitle: 'Four stops. One unforgettable muddy day.',
        routeBody: 'The route combines real off-road driving with local culture and natural stops. Order may vary according to operations.',
        routeNote: 'Local guide, safety briefing and route support throughout the experience.',
        routeSteps: [
          ['Hotel pickup', 'Coordinated transportation from your hotel or agreed point.', Car],
          ['Macao trails', 'Rural roads, puddles and real off-road driving.', Waves],
          ['Dominican ranch', 'Coffee, cacao and mamajuana tasting.', Coffee],
          ['Cenote and beach', 'Water stop and Macao Beach visit when operations allow.', MapPin],
        ] as Array<[string, string, LucideIcon]>,
        includedKicker: 'Everything explained', includedTitle: 'Know exactly what is included.',
        important: 'Before booking', importantTitle: 'Safety first.', bring: 'What to bring', bringTitle: 'Ready for the mud.',
        galleryLabels: ['Real Macao mud', 'Moments from the route', 'Ranch and local culture', 'Guided and organized route'],
        hotelsKicker: 'Pickup by hotel', hotelsTitle: 'Find your hotel and book with the pickup point prefilled.',
        hotelsBody: 'Open a dedicated page with the hotel area, estimated transfer time and booking form ready to use.',
        hotelTime: 'approx. to the ranch',
        faqKicker: 'Frequently asked questions', faqTitle: 'Everything you need before booking.', allQuestions: 'See all 100 buggy questions',
        ctaTitle: 'Your buggy is waiting in Punta Cana.', ctaBody: 'Choose the right vehicle for your group and reserve directly.', ctaButton: 'See prices and book',
        footerBody: 'Direct buggy tours in Punta Cana and Bayahibe with coordinated pickup and secure payment.',
        footerBooking: 'Booking', footerRoute: 'Explore', whatsapp: 'WhatsApp support', footerPrices: 'Buggy options', footerFaq: 'Questions',
      }
    : {
        prices: 'Precios', route: 'Ruta', included: 'Incluye', faq: 'FAQ', book: 'Reservar',
        eyebrow: 'Punta Cana · Playa Macao · Recogida incluida',
        title: 'El tour en buggy de Punta Cana que viniste a vivir.',
        intro: 'Lodo, caminos rurales, cultura dominicana, cenote y Playa Macao, con precio directo y recogida coordinada en tu hotel.',
        seeOptions: 'Ver opciones', ask: 'Preguntar por WhatsApp',
        heroProof: ['Pago seguro con tarjeta o PayPal', 'Recogida coordinada por WhatsApp', 'Precio claro por vehículo'],
        from: 'Desde', dealBody: 'Buggy individual con transporte ida y vuelta incluido.',
        dealItems: ['Recogida en hotel', 'Cenote + Playa Macao', 'Guía local y equipo de seguridad'], dealCta: 'Elegir mi buggy',
        highlights: [
          ['Recogida incluida', 'Transporte ida y vuelta desde hoteles principales de Punta Cana y Bávaro.', Car],
          ['Ruta auténtica', 'Lodo, Playa Macao, rancho dominicano y parada en cenote.', MapPin],
          ['Precio directo', 'Tarifas claras por vehículo, sin comisiones del hotel.', BadgeDollarSign],
          ['Reserva segura', 'Paga con tarjeta o PayPal y recibe instrucciones claras.', ShieldCheck],
        ] as Array<[string, string, LucideIcon]>,
        optionsKicker: 'Elige tu destino', optionsTitle: 'Un precio claro. El buggy correcto para tu grupo.',
        optionsBody: 'Compara capacidad y destino; después completa la reserva en pocos pasos.',
        pcTitle: 'Punta Cana y Macao', pcBody: 'Recogida en hotel, lodo, rancho, cenote y Playa Macao.',
        byTitle: 'Bayahibe y La Romana', byBody: 'Ruta rural 4x4 con recogida local coordinada.',
        popular: 'Más reservado', before: 'Antes', details: 'Ver detalle y reservar',
        bookingKicker: 'Reserva sencilla', bookingTitle: 'Reserva en tres pasos claros.',
        bookingBody: 'Sin mensajes largos ni cotizaciones confusas. Elige el tour, agrega la recogida y paga seguro.',
        bookingSteps: [
          ['Elige tu buggy', 'Compara individual, doble o familiar y selecciona el destino.', Users],
          ['Agrega fecha y hotel', 'Indica cuándo vas y dónde coordinamos la recogida.', CalendarDays],
          ['Confirma seguro', 'Revisa el total y paga con tarjeta o PayPal.', CreditCard],
        ] as Array<[string, string, LucideIcon]>,
        routeKicker: 'La experiencia', routeTitle: 'Cuatro paradas. Un día de lodo inolvidable.',
        routeBody: 'La ruta combina conducción off-road real, cultura local y paradas naturales. El orden puede variar según la operación.',
        routeNote: 'Guía local, instrucciones de seguridad y asistencia durante toda la experiencia.',
        routeSteps: [
          ['Salida del hotel', 'Transporte coordinado desde tu hotel o punto acordado.', Car],
          ['Caminos de Macao', 'Senderos rurales, charcos y conducción off-road real.', Waves],
          ['Rancho dominicano', 'Degustación de café, cacao y mamajuana.', Coffee],
          ['Cenote y playa', 'Parada de agua y Playa Macao según la operación.', MapPin],
        ] as Array<[string, string, LucideIcon]>,
        includedKicker: 'Todo explicado', includedTitle: 'Conoce exactamente qué está incluido.',
        important: 'Antes de reservar', importantTitle: 'La seguridad primero.', bring: 'Qué llevar', bringTitle: 'Listo para el lodo.',
        galleryLabels: ['Lodo real de Macao', 'Momentos del recorrido', 'Rancho y cultura local', 'Ruta guiada y organizada'],
        hotelsKicker: 'Recogida por hotel', hotelsTitle: 'Encuentra tu hotel y reserva con la recogida preparada.',
        hotelsBody: 'Abre una página dedicada con la zona, el tiempo estimado de traslado y el formulario listo.',
        hotelTime: 'aprox. al rancho',
        faqKicker: 'Preguntas frecuentes', faqTitle: 'Todo lo que necesitas antes de reservar.', allQuestions: 'Ver las 100 preguntas de buggy',
        ctaTitle: 'Tu buggy te espera en Punta Cana.', ctaBody: 'Elige el vehículo correcto para tu grupo y reserva directo.', ctaButton: 'Ver precios y reservar',
        footerBody: 'Tours directos en buggy por Punta Cana y Bayahibe con recogida coordinada y pago seguro.',
        footerBooking: 'Reservas', footerRoute: 'Explorar', whatsapp: 'Ayuda por WhatsApp', footerPrices: 'Opciones de buggy', footerFaq: 'Preguntas',
      };

  const renderProductGroup = (groupProducts: BuggyProduct[], title: string, description: string, destination: string) => (
    <section className="destination-block" aria-labelledby={`destination-${destination}`}>
      <div className="destination-head">
        <div>
          <span><MapPin size={15} /> {destination}</span>
          <h3 id={`destination-${destination}`}>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
      <div className="product-grid">
        {groupProducts.map((product) => (
          <article className={`product-card ${product.popular ? 'popular' : ''}`} id={product.id} key={product.id}>
            {product.popular ? <div className="badge"><Sparkles size={14} /> {copy.popular}</div> : null}
            <div className="product-top">
              <div>
                <span>{productCapacity(product, locale)}</span>
                <h3>{productTitle(product, locale)}</h3>
              </div>
              <Users aria-hidden="true" />
            </div>
            <div className="product-image-shell">
              <Image
                className="product-photo"
                src={product.image}
                alt={`${productTitle(product, locale)} · ${product.destination}`}
                width={800}
                height={530}
                sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
              />
              <span>{product.destination}</span>
            </div>
            <p className="hook">{isEn ? (product.capacityNumber === 2 ? 'The favorite for couples and friends.' : product.capacityNumber === 4 ? 'Keep the whole group together.' : 'Your own buggy, your own wheel.') : product.hook}</p>
            <p>{productDescription(product, locale)}</p>
            <div className="price-row">
              <small>{copy.before} US${product.regular}</small>
              <strong>US${product.promo}</strong>
            </div>
            <div className="meta">
              <span><Users size={16} /> {productCapacity(product, locale)}</span>
              <span><Clock3 size={16} /> {isEn ? 'Approx. 4 hours with transfer' : product.durationLabel}</span>
              <span><BadgeDollarSign size={16} /> {productNote(product, locale)}</span>
            </div>
            <TripAdvisorReviewLink locale={locale} destination={destination === 'Bayahibe' ? 'bayahibe' : 'punta-cana'} location={`product_card_${product.id}`} />
            <a href={`${base}/buggy/${product.id}`} data-product-id={product.id}>{copy.details} <ArrowRight size={17} /></a>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <main className="public-site">
      <header className="site-header">
        <a className="brand" href={base || '/'} aria-label="Caribbean Buggy"><span>Caribbean</span><b>Buggy</b></a>
        <nav aria-label={isEn ? 'Main navigation' : 'Navegación principal'}>
          <a href={`#${sectionIds.prices}`}>{copy.prices}</a><a href={`#${sectionIds.route}`}>{copy.route}</a><a href={`#${sectionIds.included}`}>{copy.included}</a><a href={questionsPath(locale)}>{copy.faq}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch current={locale} esHref="/" enHref="/en" />
          <a className="header-cta" href={`#${sectionIds.prices}`} data-track-event="booking_cta_click" data-track-location="header">{copy.book}</a>
        </div>
      </header>

      <section className="hero">
        <Image className="hero-bg-image" src="/buggy/doble.jpeg" alt="" fill priority sizes="100vw" />
        <div className="hero-bg" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><MapPin size={16} /> {copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
            <div className="hero-actions">
              <a className="primary-btn" href={`#${sectionIds.prices}`} data-track-event="booking_cta_click" data-track-location="hero">{copy.seeOptions} <ArrowRight size={18} /></a>
              <a className="secondary-btn" href={whatsappHref(bookingMessage(locale))} data-track-location="hero"><MessageCircle size={18} /> {copy.ask}</a>
            </div>
            <div className="hero-proof-row">
              {copy.heroProof.map((item) => <span key={item}><CheckCircle2 size={16} /> {item}</span>)}
            </div>
          </div>
          <aside className="deal-card">
            <span>{copy.from}</span><strong>US$40</strong><p>{copy.dealBody}</p>
            <ul>{copy.dealItems.map((item) => <li key={item}><CheckCircle2 size={17} /> {item}</li>)}</ul>
            <a href={`#${sectionIds.prices}`} data-track-event="booking_cta_click" data-track-location="hero_deal">{copy.dealCta} <ArrowRight size={17} /></a>
          </aside>
        </div>
      </section>

      <section className="trust-strip" aria-label={isEn ? 'Why book direct' : 'Ventajas de reservar directo'}>
        <div className="wrap trust-grid">
          {copy.highlights.map(([title, text, Icon]) => <article key={title}><Icon size={24} /><b>{title}</b><span>{text}</span></article>)}
        </div>
      </section>

      <section id={sectionIds.prices} className="section options-section">
        <div className="wrap section-head"><span className="kicker">{copy.optionsKicker}</span><h2>{copy.optionsTitle}</h2><p>{copy.optionsBody}</p></div>
        <div className="wrap destination-list">
          {renderProductGroup(puntaCanaProducts, copy.pcTitle, copy.pcBody, 'Punta-Cana')}
          {renderProductGroup(bayahibeProducts, copy.byTitle, copy.byBody, 'Bayahibe')}
        </div>
      </section>

      <section className="section booking-flow-section">
        <div className="wrap booking-flow-layout">
          <div className="booking-flow-copy"><span className="kicker">{copy.bookingKicker}</span><h2>{copy.bookingTitle}</h2><p>{copy.bookingBody}</p><a className="primary-btn" href={`#${sectionIds.prices}`}>{copy.seeOptions} <ArrowRight size={18} /></a></div>
          <div className="booking-flow-grid">
            {copy.bookingSteps.map(([title, text, Icon], index) => <article key={title}><b>{index + 1}</b><Icon size={24} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id={sectionIds.route} className="section route-section">
        <div className="wrap split">
          <div><span className="kicker">{copy.routeKicker}</span><h2>{copy.routeTitle}</h2><p>{copy.routeBody}</p><div className="route-note"><ShieldCheck /><span>{copy.routeNote}</span></div></div>
          <div className="route-grid">
            {copy.routeSteps.map(([title, text, Icon], index) => <article key={title}><b>{index + 1}</b><Icon /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id={sectionIds.included} className="section">
        <div className="wrap info-grid">
          <article className="info-card"><span className="kicker">{copy.includedKicker}</span><h2>{copy.includedTitle}</h2><div className="check-grid">{pageIncluded.map((item) => <span key={item}><CheckCircle2 size={17} /> {item}</span>)}</div></article>
          <article className="info-card dark"><span className="kicker">{copy.important}</span><h2>{copy.importantTitle}</h2><ul>{pageRequirements.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="info-card bring"><span className="kicker">{copy.bring}</span><h2>{copy.bringTitle}</h2><ul>{pageBring.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
      </section>

      <section className="gallery-band" aria-label={isEn ? 'Tour gallery' : 'Galería del tour'}>
        <div className="wrap gallery-grid">
          {['/buggy/ruta-1.jpeg', '/buggy/ruta-2.jpeg', '/buggy/ruta-3.jpeg', '/buggy/doble.jpeg'].map((image, index) => {
            const Icon = [Waves, Camera, Coffee, ShieldCheck][index];
            return <figure key={image}><Image src={image} alt={copy.galleryLabels[index]} width={800} height={530} sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 25vw" /><figcaption><Icon /> {copy.galleryLabels[index]}</figcaption></figure>;
          })}
        </div>
      </section>

      <section className="section hotel-link-section">
        <div className="wrap section-head"><span className="kicker">{copy.hotelsKicker}</span><h2>{copy.hotelsTitle}</h2><p>{copy.hotelsBody}</p></div>
        <div className="wrap hotel-link-grid">
          {featuredHotels.map((hotel) => <a key={hotel.slug} href={hotelBuggyUrl(hotel.slug, locale).replace(siteUrl, '')} data-hotel-slug={hotel.slug}><span>{hotel.zone}</span><b>{hotel.name}</b><small>{hotel.driveTime} {copy.hotelTime}</small><ArrowRight size={17} /></a>)}
        </div>
      </section>

      <section className="section home-guide-section">
        <div className="wrap section-head"><span className="kicker">{isEn ? 'Buggy knowledge center' : 'Centro de conocimiento buggy'}</span><h2>{isEn ? 'Plan your tour with complete local guides.' : 'Planifica tu tour con guías completas.'}</h2><p>{isEn ? 'Routes, prices, pickup, families, safety and everything needed before booking.' : 'Rutas, precios, recogida, familias, seguridad y todo lo necesario antes de reservar.'}</p></div>
        <div className="wrap seo-guide-card-grid">
          {seoGuides.slice(0, 6).map((guide) => <a href={guidePath(guide, locale)} className="seo-guide-card seo-guide-card-home" key={guide.id}><Image src={guide.image} alt={guide[locale].title} width={700} height={464} sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" /><div><span>{guide[locale].eyebrow}</span><h3>{guide[locale].title}</h3><p>{guide[locale].description}</p><b>{isEn ? 'Read complete guide' : 'Leer guía completa'} <ArrowRight size={16} /></b></div></a>)}
        </div>
        <div className="wrap faq-all-wrap"><a className="faq-all-link" href={guidesPath(locale)}>{isEn ? `Explore all ${seoGuides.length} guides` : `Explorar las ${seoGuides.length} guías`} <ArrowRight size={18} /></a></div>
      </section>

      <section id={sectionIds.faq} className="section faq-section">
        <div className="wrap section-head"><span className="kicker">{copy.faqKicker}</span><h2>{copy.faqTitle}</h2></div>
        <div className="wrap faq-grid">
          {pageFaqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><ChevronDown size={20} /></summary><p>{answer}</p></details>)}
        </div>
        <div className="wrap faq-all-wrap"><a className="faq-all-link" href={questionsPath(locale)}>{copy.allQuestions} <ArrowRight size={18} /></a></div>
      </section>

      <section className="final-cta"><div className="wrap"><span className="kicker">Caribbean Buggy</span><h2>{copy.ctaTitle}</h2><p>{copy.ctaBody}</p><a className="primary-btn" href={`#${sectionIds.prices}`} data-track-event="booking_cta_click" data-track-location="final_cta">{copy.ctaButton} <ArrowRight size={18} /></a></div></section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div><a className="brand footer-brand" href={base || '/'}><span>Caribbean</span><b>Buggy</b></a><p>{copy.footerBody}</p></div>
          <div><h3>{copy.footerBooking}</h3><a href={whatsappHref(bookingMessage(locale))}>{copy.whatsapp}</a><a href={`#${sectionIds.prices}`}>{copy.footerPrices}</a><a href={questionsPath(locale)}>{copy.footerFaq}</a><a href={guidesPath(locale)}>{isEn ? 'Buggy guides' : 'Guías de buggy'}</a></div>
          <div><h3>{copy.footerRoute}</h3><a href={`#${sectionIds.route}`}>Playa Macao</a><a href={`#${sectionIds.route}`}>Cenote</a><a href={`#${sectionIds.route}`}>{isEn ? 'Dominican ranch' : 'Rancho dominicano'}</a></div>
        </div>
        <div className="wrap footer-credit"><a href="https://cynador.com" target="_blank" rel="noreferrer">{isEn ? 'Designed and developed by Cynador' : 'Diseño y desarrollo web por Cynador'}</a></div>
      </footer>

      <a className="floating-whatsapp" href={whatsappHref(bookingMessage(locale))} data-track-location="floating_cta"><MessageCircle size={20} /> {copy.book}</a>
    </main>
  );
}
