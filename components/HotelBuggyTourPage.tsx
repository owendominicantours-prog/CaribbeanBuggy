import {
  ArrowLeft,
  ArrowRight,
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
import Image from 'next/image';
import BookingCalculator from './BookingCalculator';
import { getRelatedHotelBuggyLandings, hotelBuggyPath, isBayahibeHotel, type HotelBuggyLanding } from '../lib/hotelBuggyLandings';
import type { BuggyProduct } from '../lib/buggyProducts';
import {
  bring,
  faqs,
  included,
  requirements,
} from '../lib/buggyProducts';
import { getHotelBuggyProducts } from '../lib/hotelBuggySeo';
import LanguageSwitch from './LanguageSwitch';
import { guidePath, seoGuides } from '../lib/seoGuides';
import TripAdvisorReviews from './TripAdvisorReviews';

type HotelBuggyTourPageProps = {
  hotel: HotelBuggyLanding;
  canonical: string;
  locale?: 'es' | 'en';
};

const puntaCanaGallery = ['/buggy/doble.jpeg', '/buggy/ruta-1.jpeg', '/buggy/ruta-2.jpeg', '/buggy/ruta-3.jpeg'];
const bayahibeGallery = [
  '/buggy/bayahibe/buggy-lodo-bayahibe.jpg',
  '/buggy/bayahibe/convoy-lodo-bayahibe.jpg',
  '/buggy/bayahibe/parada-cana-azucar-bayahibe.jpg',
  '/buggy/bayahibe/rio-chavon-bayahibe.jpg',
];
const BUGGY_VIDEO_URL = 'https://cfplxlfjp1i96vih.public.blob.vercel-storage.com/Videos/Buggy%20Punta%20cana.mp4';
const BAYAHIBE_VIDEO_URL = '/buggy/bayahibe/tour-buggy-bayahibe.mp4';

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

const bayahibeIncluded = [
  'Transporte ida y vuelta desde el hotel o punto confirmado',
  'Buggy según la modalidad elegida',
  'Casco e instrucciones de seguridad',
  'Guía local durante la ruta',
  'Ruta por cañaverales, comunidades rurales y caminos de lodo',
  'Parada en el río Chavón según la operación',
  'Asistencia durante toda la excursión',
];

const enBayahibeIncluded = [
  'Round-trip transport from the hotel or confirmed meeting point',
  'Buggy according to the selected option',
  'Helmet and safety briefing',
  'Local guide throughout the route',
  'Sugar-cane roads, rural communities and mud trails',
  'Chavón River stop according to operations',
  'Tour support throughout the experience',
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

const notIncluded = [
  'Fotos, bebidas extra o souvenirs comprados durante la ruta.',
  'Propinas opcionales para guia, chofer o equipo local.',
  'Gastos por danos causados al buggy por manejo irresponsable.',
  'Recogidas fuera de la zona confirmada sin coordinacion previa.',
];

const enNotIncluded = [
  'Photos, extra drinks or souvenirs purchased during the route.',
  'Optional tips for the guide, driver or local team.',
  'Damage charges caused by irresponsible buggy driving.',
  'Pickup outside the confirmed zone without previous coordination.',
];

const enFaqs = [
  ['Is the price per person or per vehicle?', 'The listed price is per vehicle depending on the option: single, double or family buggy.'],
  ['Is hotel pickup included?', 'Yes, pickup and return are included from main Bavaro and Punta Cana hotel zones.'],
  ['Do we visit Macao Beach?', 'Yes, the route normally includes Macao Beach and a cenote stop, subject to daily operations.'],
  ['Will I get muddy?', 'Yes. This is an off-road buggy experience with mud, rural roads and water stops. Old clothes are recommended.'],
];

const bayahibeFaqs = [
  ['¿El precio es por persona o por vehículo?', 'El precio publicado es por vehículo según la modalidad: individual, doble o familiar.'],
  ['¿Hay recogida desde hoteles de Bayahibe y La Romana?', 'Sí. Confirmamos por WhatsApp la recogida o el punto de encuentro autorizado según el hotel y la operación del día.'],
  ['¿Qué visita la ruta de Bayahibe?', 'La ruta recorre cañaverales, comunidades rurales, charcos y caminos de lodo, con parada en el río Chavón según la operación.'],
  ['¿Las fotos y el video son reales?', 'Sí. El material mostrado pertenece a la operación real de buggy en Bayahibe y La Romana.'],
];

const enBayahibeFaqs = [
  ['Is the price per person or per vehicle?', 'The published price is per vehicle according to the selected single, double or family option.'],
  ['Is pickup available from Bayahibe and La Romana hotels?', 'Yes. We confirm the authorized pickup or meeting point by WhatsApp according to the hotel and daily operations.'],
  ['What does the Bayahibe route visit?', 'The route covers sugar-cane roads, rural communities, puddles and mud trails, with a Chavón River stop according to operations.'],
  ['Are the photos and video real?', 'Yes. The media shown comes from the actual Bayahibe and La Romana buggy operation.'],
];

function zoneForCalculator(zone: string) {
  if (/Bayahibe|Romana|Dominicus/i.test(zone)) return 'Bayahibe / La Romana';
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
  const scopedProducts = getHotelBuggyProducts(hotel);
  const relatedHotels = getRelatedHotelBuggyLandings(hotel, 10);
  const hotelDestination = isBayahibeHotel(hotel) ? 'bayahibe' : 'punta-cana';
  const gallery = hotelDestination === 'bayahibe' ? bayahibeGallery : puntaCanaGallery;
  const videoUrl = hotelDestination === 'bayahibe' ? BAYAHIBE_VIDEO_URL : BUGGY_VIDEO_URL;
  const hotelGuides = seoGuides.filter((guide) => guide.destination === hotelDestination || guide.destination === 'general').slice(0, 4);
  const featuredProduct = scopedProducts.find((product) => product.popular) ?? scopedProducts[0];
  const basePageCopy = isEn
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
        videoKicker: 'Real preview',
        videoTitle: 'See the buggy route before booking',
        videoBody: 'Mud trails, rural roads, ranch stop and Macao scenery. The video helps travelers understand the activity before they pay.',
        includedTitle: 'What is included',
        notIncludedTitle: 'Not included',
        includedIntro: 'Everything needed for a clear buggy experience from hotel pickup to return.',
        bookingSteps: ['Choose date and hotel', 'Add traveler details', 'Pay or reserve securely'],
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
        nearbyHotelsKicker: 'More hotel pickup pages',
        nearbyHotelsTitle: `Buggy pickup near ${hotel.name}`,
        nearbyHotelsBody: `Compare dedicated booking pages for nearby hotels in ${hotel.zone} and the same destination.`,
        nearbyHotelLink: 'Buggy tour from',
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
        videoKicker: 'Vista real',
        videoTitle: 'Mira la ruta en buggy antes de reservar',
        videoBody: 'Lodo, caminos rurales, parada en rancho y ambiente de Macao. El video ayuda al cliente a entender la excursion antes de pagar.',
        includedTitle: 'Que incluye',
        notIncludedTitle: 'No incluye',
        includedIntro: 'Todo lo necesario para una experiencia clara desde la recogida en hotel hasta el regreso.',
        bookingSteps: ['Elige fecha y hotel', 'Agrega tus datos', 'Paga o reserva seguro'],
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
        nearbyHotelsKicker: 'Más páginas de recogida',
        nearbyHotelsTitle: `Recogida de buggy cerca de ${hotel.name}`,
        nearbyHotelsBody: `Compara páginas de reserva para hoteles cercanos en ${hotel.zone} y el mismo destino.`,
        nearbyHotelLink: 'Buggy tour desde',
      };
  const pageCopy = hotelDestination === 'bayahibe'
    ? {
        ...basePageCopy,
        intro: isEn
          ? `Book a real Bayahibe and La Romana buggy tour from ${hotel.name} with coordinated pickup, sugar-cane roads, rural villages, mud trails and a Chavón River stop.`
          : `Reserva un tour real en buggy por Bayahibe y La Romana desde ${hotel.name}, con recogida coordinada, cañaverales, comunidades rurales, caminos de lodo y parada en el río Chavón.`,
        videoBody: isEn
          ? 'Original footage from the Bayahibe operation: red buggies, sugar-cane roads, mud and rural scenery.'
          : 'Video original de la operación de Bayahibe: buggies rojos, caminos entre cañaverales, lodo y paisaje rural.',
        body: isEn
          ? `After booking, the team confirms pickup from ${hotel.name}. At the Bayahibe base you receive safety instructions, the reserved buggy and a local guide for the rural 4x4 route.`
          : `Después de reservar, el equipo confirma la recogida desde ${hotel.name}. En la base de Bayahibe recibes instrucciones de seguridad, el buggy reservado y un guía local para la ruta rural 4x4.`,
        itineraryTitle: isEn ? 'From hotel pickup to the real Bayahibe route' : 'De la recogida en hotel a la ruta real de Bayahibe',
        steps: isEn
          ? [
              ['Pickup coordination', `We confirm the authorized pickup point for ${hotel.name}.`],
              ['Bayahibe base', 'Safety briefing, helmet and buggy assignment.'],
              ['Sugar-cane route', 'Rural communities, plantations, puddles and mud trails.'],
              ['Chavón River', 'Swimming stop and local refreshments according to operations.'],
            ]
          : [
              ['Coordinación de recogida', `Confirmamos el punto autorizado para ${hotel.name}.`],
              ['Base de Bayahibe', 'Instrucciones de seguridad, casco y asignación del buggy.'],
              ['Ruta entre cañaverales', 'Comunidades rurales, plantaciones, charcos y caminos de lodo.'],
              ['Río Chavón', 'Parada para nadar y refrigerio local según la operación.'],
            ],
      }
    : basePageCopy;

  const listIncluded = hotelDestination === 'bayahibe'
    ? (isEn ? enBayahibeIncluded : bayahibeIncluded)
    : (isEn ? enIncluded : included);
  const listNotIncluded = isEn ? enNotIncluded : notIncluded;
  const listRequirements = isEn ? enRequirements : requirements;
  const listBring = isEn ? enBring : bring;
  const listFaqs = hotelDestination === 'bayahibe'
    ? (isEn ? enBayahibeFaqs : bayahibeFaqs)
    : (isEn ? enFaqs : faqs);

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
            esHref={hotelBuggyPath(hotel.slug, 'es')}
            enHref={hotelBuggyPath(hotel.slug, 'en')}
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
            <div className="tour-proof-strip" aria-label={isEn ? 'Booking confidence' : 'Confianza para reservar'}>
              <span>
                <ShieldCheck size={16} />
                {isEn ? 'Verified local operator' : 'Operador local verificado'}
              </span>
              <span>
                <CalendarCheck2 size={16} />
                {isEn ? 'Pickup time confirmed by WhatsApp' : 'Hora confirmada por WhatsApp'}
              </span>
              <span>
                <BadgeDollarSign size={16} />
                {isEn ? 'Clear price before checkout' : 'Precio claro antes de pagar'}
              </span>
            </div>

            <div className="tour-gallery" aria-label={isEn ? 'Buggy tour photos' : 'Fotos del tour en buggy'}>
              <Image className="tour-gallery-main" src={gallery[0]} alt={pageCopy.h1} width={1200} height={795} priority sizes="(max-width: 980px) 100vw, 55vw" />
              <div className="tour-gallery-side">
                {gallery.slice(1).map((image, index) => (
                  <Image key={image} src={image} alt={`${pageCopy.h1} ${index + 2}`} width={600} height={398} sizes="(max-width: 680px) 33vw, 24vw" />
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

            <section className="tour-video-section" id="video">
              <div>
                <span className="tour-kicker">{pageCopy.videoKicker}</span>
                <h2>{pageCopy.videoTitle}</h2>
                <p>{pageCopy.videoBody}</p>
              </div>
              <div className="tour-video-frame">
                <video controls playsInline preload="metadata" poster={gallery[0]}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
              </div>
            </section>

            <section id="included" className="tour-section tour-service-grid">
              <span className="tour-kicker">{pageCopy.how}</span>
              <h2>{pageCopy.h2}</h2>
              <p>{pageCopy.body}</p>
              <div className="tour-service-lists">
                <article className="tour-list-card tour-list-card-positive">
                  <h3>{pageCopy.includedTitle}</h3>
                  <p>{pageCopy.includedIntro}</p>
                  <div className="tour-checklist">
                    {listIncluded.map((item) => (
                      <span key={item}><CheckCircle2 size={17} /> {item}</span>
                    ))}
                  </div>
                </article>
                <article className="tour-list-card">
                  <h3>{pageCopy.notIncludedTitle}</h3>
                  <ul>
                    {listNotIncluded.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
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
                {scopedProducts.map((product) => (
                  <a href={`${isEn ? '/en' : ''}/buggy/${product.id}`} key={product.id}>
                    <Image src={product.image} alt={titleFor(product, locale)} width={500} height={331} sizes="(max-width: 680px) 100vw, 240px" />
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

            <section id="tripadvisor" className="tour-section hotel-tripadvisor-section"><TripAdvisorReviews locale={locale} destination={hotelDestination} location={`hotel_landing_${hotel.slug}`} /></section>

            <section className="tour-section hotel-related-section" aria-labelledby="related-hotels-title">
              <span className="tour-kicker">{pageCopy.nearbyHotelsKicker}</span>
              <h2 id="related-hotels-title">{pageCopy.nearbyHotelsTitle}</h2>
              <p>{pageCopy.nearbyHotelsBody}</p>
              <div className="hotel-link-grid hotel-link-grid-compact">
                {relatedHotels.map((relatedHotel) => (
                  <a href={hotelBuggyPath(relatedHotel.slug, locale)} key={relatedHotel.slug}>
                    <span>{relatedHotel.zone}</span>
                    <b>{pageCopy.nearbyHotelLink} {relatedHotel.name}</b>
                    <small>{relatedHotel.driveTime} {isEn ? 'approx. to the ranch' : 'aprox. al rancho'}</small>
                    <ArrowRight size={17} />
                  </a>
                ))}
              </div>
            </section>

            <section className="tour-section hotel-related-section" aria-labelledby="hotel-guides-title">
              <span className="tour-kicker">{isEn ? 'Plan before booking' : 'Planifica antes de reservar'}</span>
              <h2 id="hotel-guides-title">{isEn ? `Buggy guides for guests at ${hotel.name}` : `Guías de buggy para huéspedes de ${hotel.name}`}</h2>
              <p>{isEn ? 'Understand the route, price, pickup and vehicle before choosing.' : 'Entiende la ruta, el precio, la recogida y el vehículo antes de elegir.'}</p>
              <div className="seo-guide-related-grid">
                {hotelGuides.map((guide) => <a href={guidePath(guide, locale)} key={guide.id}><span>{guide[locale].eyebrow}</span><b>{guide[locale].title}</b><ArrowRight size={17} /></a>)}
              </div>
            </section>
          </article>

          <aside id="book" className="tour-sidebar">
            <div className="tour-mobile-booking-intro">
              <span>{pageCopy.eyebrow}</span>
              <strong>{hotel.name}</strong>
              <small>{isEn ? 'Choose your date and reserve below.' : 'Elige tu fecha y reserva a continuación.'}</small>
            </div>
            <div id="booking-form" className="tour-booking-form-shell">
              <BookingCalculator
                product={featuredProduct}
                defaultHotel={hotel.name}
                defaultPickupZone={zoneForCalculator(hotel.zone)}
                locale={locale}
              />
            </div>
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
            <div className="tour-booking-steps" aria-label={isEn ? 'Booking steps' : 'Pasos de reserva'}>
              {pageCopy.bookingSteps.map((step, index) => (
                <span key={step}>
                  <b>{index + 1}</b>
                  {step}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
