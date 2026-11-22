import { ArrowLeft, BadgeDollarSign, Clock3, Hotel, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import BookingWizard from './cb/BookingWizard';
import { CbFooter, CbHeader, StickyBook, homeAnchors } from './cb/Chrome';
import { DayTimeline, FaqList, GuideCards, HotelLinks, IncludedPanel, PickupPanel, QuickAnswers } from './cb/Sections';
import { areaForHotel } from '../lib/pickupLookup';
import { photosFor } from '../lib/sitePhotos';
import { getRelatedHotelBuggyLandings, hotelBuggyPath, isBayahibeHotel, isMeetingPointHotel, type HotelBuggyLanding } from '../lib/hotelBuggyLandings';
import type { BuggyProduct } from '../lib/buggyProducts';
import { bring, requirements } from '../lib/buggyProducts';
import { getHotelBuggyProducts } from '../lib/hotelBuggySeo';
import { getPuntaCanaBuggyContent } from '../lib/puntaCanaBuggyContent';
import { seoGuides } from '../lib/seoGuides';
import TripAdvisorReviews from './TripAdvisorReviews';

type HotelBuggyTourPageProps = {
  hotel: HotelBuggyLanding;
  canonical: string;
  locale?: 'es' | 'en';
};

const bayahibeGallery = [
  '/buggy/bayahibe/buggy-lodo-bayahibe.jpg',
  '/buggy/bayahibe/convoy-lodo-bayahibe.jpg',
  '/buggy/bayahibe/parada-cana-azucar-bayahibe.jpg',
  '/buggy/bayahibe/rio-chavon-bayahibe.jpg',
];
const BUGGY_VIDEO_URL = '';
const BAYAHIBE_VIDEO_URL = '/buggy/bayahibe/tour-buggy-bayahibe.mp4';


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
  'Propinas opcionales para guía, chofer o equipo local.',
  'Gastos por daños causados al buggy por manejo irresponsable.',
  'Recogidas fuera de la zona confirmada sin coordinación previa.',
];

const enNotIncluded = [
  'Photos, extra drinks or souvenirs purchased during the route.',
  'Optional tips for the guide, driver or local team.',
  'Damage charges caused by irresponsible buggy driving.',
  'Pickup outside the confirmed zone without previous coordination.',
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
  const meetingPoint = hotelDestination === 'punta-cana' && isMeetingPointHotel(hotel);
  const pickupNoteText = isEn
    ? meetingPoint
      ? 'No accommodation pickup here: meeting point at KFC Downtown, near Coco Bongo. We will confirm the exact KFC meeting time for your departure before the activity.'
      : hotelDestination === 'bayahibe'
        ? 'Pickup or meeting point confirmed by WhatsApp before the tour.'
        : 'Hotel pickup point confirmed by WhatsApp before the tour.'
    : hotel.pickupNote;
  const gallery = hotelDestination === 'bayahibe' ? bayahibeGallery : photosFor(hotel.slug, 4).map((p) => p.src);
  const videoUrl = hotelDestination === 'bayahibe' ? BAYAHIBE_VIDEO_URL : BUGGY_VIDEO_URL;
  const hotelGuides = seoGuides.filter((guide) => guide.destination === hotelDestination || guide.destination === 'general').slice(0, 4);
  const featuredProduct = scopedProducts.find((product) => product.popular) ?? scopedProducts[0];
  const completePuntaCanaContent = getPuntaCanaBuggyContent(featuredProduct, locale);
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
        priceNote: 'Secure card payment with Stripe',
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
        priceNote: 'Pago seguro con tarjeta mediante Stripe',
        facts: ['Zona', 'Tiempo estimado al rancho', 'Modalidades', 'Pickup'],
        options: 'Individual, doble o familiar',
        videoKicker: 'Vista real',
        videoTitle: 'Mira la ruta en buggy antes de reservar',
        videoBody: 'Lodo, caminos rurales, parada en rancho y ambiente de Macao. El video ayuda a entender la excursión antes de pagar.',
        includedTitle: 'Qué incluye',
        notIncludedTitle: 'No incluye',
        includedIntro: 'Todo lo necesario para una experiencia clara desde la recogida en hotel hasta el regreso.',
        bookingSteps: ['Elige fecha y hotel', 'Agrega tus datos', 'Paga o reserva seguro'],
        how: 'Cómo funciona',
        h2: `Ruta organizada para huéspedes de ${hotel.name}`,
        body: `Después de reservar, nuestro equipo confirma la hora exacta por WhatsApp según la tanda seleccionada. Recibes instrucciones claras para el punto autorizado de ${hotel.name}. En el rancho recibes instrucciones de seguridad, el buggy reservado y sales con guía por la ruta de Macao.`,
        important: `Detalles importantes para ${hotel.name}`,
        bring: 'Qué llevar',
        ready: 'Preparado para lodo, agua y fotos',
        itinerary: 'Itinerario',
        itineraryTitle: 'Del pickup en hotel a la aventura en Macao',
        steps: [
          ['Coordinación de recogida', `Confirmamos el punto autorizado más cercano para ${hotel.name}.`],
          ['Llegada al rancho', 'Instrucciones de seguridad, casco y asignación del buggy.'],
          ['Ruta off-road', 'Caminos rurales de Macao, lodo y paradas locales.'],
          ['Cenote y playa', 'Tiempo para fotos, parada de agua y Playa Macao según la operación.'],
        ],
        more: 'Más opciones de buggy',
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
    : meetingPoint
      ? {
          ...basePageCopy,
          eyebrow: isEn ? 'Meeting point: KFC Downtown' : 'Punto de encuentro: KFC Downtown',
          intro: isEn
            ? `Buggy tour for guests of ${hotel.name}. Accommodation pickup is not included in this area next to PUJ airport: meet us at KFC Downtown, near Coco Bongo, for the Macao off-road route, Dominican ranch, cenote stop and Macao Beach.`
            : `Tour en buggy para huéspedes de ${hotel.name}. En esta zona próxima al aeropuerto PUJ no incluimos recogida en el alojamiento: nos encontramos en el KFC de Downtown, cerca de Coco Bongo, para la ruta off-road de Macao, rancho dominicano, cenote y Playa Macao.`,
          badgePickup: isEn ? 'Meet at KFC Downtown' : 'Encuentro en KFC Downtown',
          includedIntro: isEn ? 'Everything included from the KFC Downtown meeting point until you are back there.' : 'Todo lo incluido desde el punto de encuentro en el KFC de Downtown hasta el regreso al mismo punto.',
          how: isEn ? 'How the meeting point works' : 'Cómo funciona el punto de encuentro',
          h2: isEn ? `Meeting point for guests of ${hotel.name}` : `Punto de encuentro para huéspedes de ${hotel.name}`,
          body: isEn
            ? `${hotel.name} is in the Punta Cana area next to PUJ airport, where accommodation pickup is not included. You can still book: get to KFC Downtown, near Coco Bongo, on your own. We will confirm the exact KFC meeting time for your departure before the activity.`
            : `${hotel.name} está en la zona de Punta Cana próxima al aeropuerto PUJ, donde la recogida en el alojamiento no está incluida. Puedes reservar igualmente y llegar por tu cuenta al KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.`,
          itineraryTitle: isEn ? 'From KFC Downtown to the Macao adventure' : 'Del KFC de Downtown a la aventura en Macao',
          facts: isEn ? ['Zone', 'Estimated drive to ranch', 'Options', 'Meeting point'] : ['Zona', 'Tiempo estimado al rancho', 'Modalidades', 'Punto de encuentro'],
        }
      : basePageCopy;

  const listIncluded = hotelDestination === 'bayahibe'
    ? (isEn ? enBayahibeIncluded : bayahibeIncluded)
    : completePuntaCanaContent.included;
  const listNotIncluded = hotelDestination === 'bayahibe'
    ? (isEn ? enNotIncluded : notIncluded)
    : completePuntaCanaContent.notIncluded;
  const listRequirements = hotelDestination === 'bayahibe'
    ? (isEn ? enRequirements : requirements)
    : completePuntaCanaContent.requirements;
  const listBring = hotelDestination === 'bayahibe'
    ? (isEn ? enBring : bring)
    : completePuntaCanaContent.bring;
  const listFaqs = hotelDestination === 'bayahibe'
    ? (isEn ? enBayahibeFaqs : bayahibeFaqs)
    : completePuntaCanaContent.faqs;
  const itinerarySteps = hotelDestination === 'bayahibe'
    ? pageCopy.steps
    : completePuntaCanaContent.itinerary.map((step, index, all) => {
        if (meetingPoint && index === 0) {
          return isEn
            ? ['Meet at KFC Downtown · time confirmed', 'Get to KFC Downtown, near Coco Bongo, on your own. We will confirm the exact KFC meeting time for your departure before the activity.']
            : ['Encuentro en KFC Downtown · hora confirmada', 'Llegas por tu cuenta al KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.'] as [string, string];
        }
        if (meetingPoint && index === all.length - 1) {
          return [
            `${step.title} · ${step.time}`,
            isEn ? 'Final drive to the ranch, equipment return and transport back to the KFC Downtown meeting point.' : 'Tramo final al rancho, devolución del equipo y traslado de vuelta al punto de encuentro en el KFC de Downtown.',
          ] as [string, string];
        }
        return [`${step.title} · ${step.time}`, step.description] as [string, string];
      });

  const a = homeAnchors(locale);
  const base = isEn ? '/en' : '';
  const area = areaForHotel(hotel);
  const statusTitle = meetingPoint
    ? (isEn ? 'No pickup at this hotel: meet us at KFC Downtown' : 'Sin recogida en este hotel: encuentro en el KFC de Downtown')
    : area.status === 'capcana'
      ? (isEn ? 'Cap Cana: US$10 zone fee' : 'Cap Cana: cargo de zona de US$10')
      : hotelDestination === 'bayahibe'
        ? (isEn ? 'Pickup or meeting point confirmed on WhatsApp' : 'Recogida o punto de encuentro confirmado por WhatsApp')
        : (isEn ? `Pickup and return included from ${hotel.name}` : `Recogida y regreso incluidos desde ${hotel.name}`);

  return (
    <main className="cb cb-detail cb-hotel">
      <CbHeader locale={locale} esHref={hotelBuggyPath(hotel.slug, 'es')} enHref={hotelBuggyPath(hotel.slug, 'en')} bookingHref={`#${a.book}`} />
      <div className="cb-wrap cb-detail-hero">
        <div className="cb-detail-grid">
          <div className="cb-detail-main">
            <nav className="cb-crumbs" aria-label="Breadcrumb"><a href={base || '/'}><ArrowLeft size={13} /> {pageCopy.back}</a><span>/</span><a href={isEn ? '/en/buggy-tour' : '/es/buggy-tour'}>{pageCopy.breadcrumb}</a><span>/</span><span>{hotel.name}</span></nav>
            <span className="cb-kicker"><MapPin size={13} /> {pageCopy.eyebrow}</span>
            <h1>{pageCopy.h1}</h1>
            <p className="cb-lead">{pageCopy.intro}</p>
            <div className={`cb-status cb-status-${meetingPoint ? 'meeting' : area.status} cb-hotel-status`}><b>{statusTitle}</b><span>{meetingPoint ? (isEn ? 'Get there on your own. We will confirm the exact KFC meeting time for your departure before the activity.' : 'Llegas por tu cuenta. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.') : pickupNoteText}</span></div>
            <div className="cb-facts">
              <span><BadgeDollarSign size={16} /> {pageCopy.badgePrice}</span>
              <span><Clock3 size={16} /> {pageCopy.badgeTime}</span>
              <span><Hotel size={16} /> {hotel.zone} · {hotel.driveTime} {isEn ? 'to the ranch' : 'al rancho'}</span>
              <span><Users size={16} /> {pageCopy.options}</span>
            </div>
            <div className="cb-gallery">
              {gallery.map((image, index) => <Image key={image} src={image} alt={index === 0 ? pageCopy.h1 : `${pageCopy.h1} ${index + 1}`} width={index === 0 ? 1200 : 600} height={index === 0 ? 795 : 398} priority={index === 0} sizes={index === 0 ? '(max-width: 1060px) 100vw, 50vw' : '(max-width: 1060px) 50vw, 25vw'} />)}
            </div>
          </div>
          <aside className="cb-aside" id={a.book}>
            <BookingWizard product={featuredProduct} defaultHotel={hotel.name} defaultPickupZone={zoneForCalculator(hotel.zone)} locale={locale} />
          </aside>
        </div>
      </div>

      <div className="cb-wrap cb-detail-grid">
        <div className="cb-detail-main">
          <section className="cb-detail-block">
            <span className="cb-kicker">{isEn ? 'Before you ask' : 'Antes de preguntar'}</span>
            <QuickAnswers locale={locale} bayahibe={hotelDestination === 'bayahibe'} />
          </section>

          {videoUrl ? (
            <section className="cb-detail-block" id="video">
              <span className="cb-kicker">{pageCopy.videoKicker}</span>
              <h2>{pageCopy.videoTitle}</h2>
              <p>{pageCopy.videoBody}</p>
              <video controls playsInline preload="metadata" poster={gallery[0]} style={{ width: '100%', borderRadius: 20 }}>
                <source src={videoUrl} type="video/mp4" />
              </video>
            </section>
          ) : null}

          <section className="cb-detail-block" id={a.pickup}>
            <span className="cb-kicker">{pageCopy.how}</span>
            <h2>{pageCopy.h2}</h2>
            <p>{pageCopy.body}</p>
            {hotelDestination === 'punta-cana' ? <PickupPanel locale={locale} /> : null}
          </section>

          <section className="cb-detail-block" id={a.route}>
            <span className="cb-kicker">{pageCopy.itinerary}</span>
            <h2>{pageCopy.itineraryTitle}</h2>
            <DayTimeline steps={itinerarySteps.map(([title, body]) => { const [name, time] = title.split(' · '); return { title: name, time: time || '', description: body }; })} />
          </section>

          <section className="cb-detail-block" id={a.included}>
            <span className="cb-kicker">{pageCopy.includedTitle}</span>
            <h2>{pageCopy.important}</h2>
            <p>{pageCopy.includedIntro}</p>
            <IncludedPanel locale={locale} included={listIncluded} notIncluded={listNotIncluded} requirements={[...listRequirements, pickupNoteText, meetingPoint ? (isEn ? 'We confirm the exact KFC meeting time for your departure before the activity.' : 'Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.') : (isEn ? 'Exact pickup time may vary by route, traffic and confirmed departure.' : 'La hora exacta puede variar por ruta de recogida, tráfico y tanda confirmada.')]} bring={listBring} />
          </section>

          <section className="cb-detail-block" id={a.faq}>
            <span className="cb-kicker">FAQ</span>
            <h2>{pageCopy.faq}</h2>
            <FaqList faqs={listFaqs} />
          </section>

          <section className="cb-detail-block cb-legacy" id="tripadvisor">
            <TripAdvisorReviews locale={locale} destination={hotelDestination} location={`hotel_landing_${hotel.slug}`} />
          </section>

          <section className="cb-detail-block">
            <span className="cb-kicker">{pageCopy.more}</span>
            <h2>{pageCopy.related}</h2>
            <div className="cb-related">
              {scopedProducts.map((product) => (
                <a href={`${base}/buggy/${product.id}`} key={product.id}>
                  <Image src={product.image} alt={titleFor(product, locale)} width={500} height={331} sizes="(max-width: 760px) 50vw, 220px" />
                  <span>{product.subtitle}</span>
                  <b>{titleFor(product, locale)}</b>
                  <strong>US${product.promo}</strong>
                </a>
              ))}
            </div>
          </section>

          <section className="cb-detail-block" aria-labelledby="related-hotels-title">
            <span className="cb-kicker">{pageCopy.nearbyHotelsKicker}</span>
            <h2 id="related-hotels-title">{pageCopy.nearbyHotelsTitle}</h2>
            <p>{pageCopy.nearbyHotelsBody}</p>
            <HotelLinks hotels={relatedHotels} locale={locale} timeLabel={isEn ? 'approx. to the ranch' : 'aprox. al rancho'} />
          </section>

          <section className="cb-detail-block" aria-labelledby="hotel-guides-title">
            <span className="cb-kicker">{isEn ? 'Plan before booking' : 'Planifica antes de reservar'}</span>
            <h2 id="hotel-guides-title">{isEn ? `Buggy guides for guests at ${hotel.name}` : `Guías de buggy para huéspedes de ${hotel.name}`}</h2>
            <GuideCards guides={hotelGuides} locale={locale} withImages={false} />
          </section>
        </div>
      </div>

      <CbFooter locale={locale} />
      <StickyBook locale={locale} href={`#${a.book}`} price={pageCopy.badgePrice.replace(/^(Desde|From) /, '')} />
    </main>
  );
}
