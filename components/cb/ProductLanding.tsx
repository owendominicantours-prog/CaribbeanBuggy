import Image from 'next/image';
import { ArrowLeft, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react';
import type { BuggyProduct } from '../../lib/buggyProducts';
import { products } from '../../lib/buggyProducts';
import type { SeoGuide } from '../../lib/seoGuides';
import { getFeaturedHotelBuggyLandings } from '../../lib/hotelBuggyLandings';
import BookingWizard from './BookingWizard';
import { CbFooter, CbHeader, StickyBook, homeAnchors } from './Chrome';
import { DayTimeline, FaqList, GuideCards, HotelLinks, IncludedPanel, PickupPanel, QuickAnswers } from './Sections';
import TripAdvisorReviews from '../TripAdvisorReviews';
import BayahibeRealMedia from '../BayahibeRealMedia';
import { money } from '../../lib/bookingFleet';
import { photosFor } from '../../lib/sitePhotos';
import { siteUrl } from '../../lib/buggyProducts';

type Locale = 'es' | 'en';

export type ProductLandingProps = {
  product: BuggyProduct;
  locale: Locale;
  h1: string;
  displayTitle: string;
  summary: string;
  included: string[];
  notIncluded?: string[];
  requirements: string[];
  bring: string[];
  faqs: Array<[string, string]> | string[][];
  itinerary?: Array<{ time: string; title: string; description: string }>;
  activityDuration?: string;
  totalDuration?: string;
  routeHeading: string;
  routeBody: string;
  routeNote: string;
  routeImage: string;
  routeImageAlt: string;
  guides: SeoGuide[];
};

function vehicleLabel(p: BuggyProduct, en: boolean) {
  const base = en ? p.title.replace('Buggy Individual', 'Single Buggy').replace('Buggy Doble', 'Double Buggy').replace('Buggy Familiar', 'Family Buggy') : p.title;
  return base;
}

export default function ProductLanding(props: ProductLandingProps) {
  const { product, locale } = props;
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const a = homeAnchors(locale);
  const isBayahibe = product.destination.includes('Bayahibe');
  const photos = [product.image, ...(isBayahibe ? ['/buggy/bayahibe/ruta-charcos-bayahibe.jpg', '/buggy/bayahibe/salida-buggies-bayahibe.jpg', '/buggy/bayahibe/viajeros-buggy-bayahibe.jpg'] : photosFor(product.id, 4).map((p) => p.src))].filter((p, i, arr) => arr.indexOf(p) === i).slice(0, 4);
  const related = products.filter((p) => p.id !== product.id && p.destination === product.destination);
  const otherRoute = products.filter((p) => p.destination !== product.destination);
  const perPerson = money(product.promo / product.capacityNumber);
  const hotels = getFeaturedHotelBuggyLandings().filter((h) => (isBayahibe ? /bayahibe|dominicus|romana/i.test(`${h.name} ${h.zone}`) : !/bayahibe|dominicus|romana/i.test(`${h.name} ${h.zone}`))).slice(0, isBayahibe ? 6 : 12);
  const t = en
    ? { back: 'All buggies', perPerson: 'per person', perBuggy: `US$${product.promo} per buggy`, why: 'Before you ask', day: 'How the day goes', pickup: 'Pickup', included: 'Included and what to bring', route: 'The route', faq: `Questions about the ${props.displayTitle}`, guides: 'Guides to decide', more: 'Other buggies for this route', otherRoute: isBayahibe ? 'Prefer Punta Cana and Macao?' : 'Staying in Bayahibe or La Romana?', hotels: 'Booking from your hotel', hotelTime: 'to the ranch', reviews: 'Traveler reviews' }
    : { back: 'Todos los buggies', perPerson: 'por persona', perBuggy: `US$${product.promo} por buggy`, why: 'Antes de preguntar', day: 'Cómo es el día', pickup: 'Recogida', included: 'Incluye y qué llevar', route: 'La ruta', faq: `Preguntas sobre el ${props.displayTitle}`, guides: 'Guías para decidir', more: 'Otros buggies de esta ruta', otherRoute: isBayahibe ? '¿Prefieres Punta Cana y Macao?' : '¿Te hospedas en Bayahibe o La Romana?', hotels: 'Reserva desde tu hotel', hotelTime: 'aprox. al rancho', reviews: 'Opiniones' };

  const pageUrl = `${siteUrl}${base}/buggy/${product.id}`;
  const tripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${pageUrl}#trip`,
    name: props.h1,
    description: props.summary,
    url: pageUrl,
    inLanguage: en ? 'en' : 'es',
    touristType: en ? ['Adventure travelers', 'Couples', 'Families'] : ['Viajeros de aventura', 'Parejas', 'Familias'],
    image: photos.map((src) => `${siteUrl}${src}`),
    provider: { '@type': 'Organization', name: 'Caribbean Buggy', url: siteUrl },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: (isBayahibe
        ? [en ? 'Sugar-cane roads' : 'Cañaverales', en ? 'Rural mud trails' : 'Caminos rurales de lodo', en ? 'Chavón River' : 'Río Chavón']
        : [en ? 'Macao rural trails' : 'Caminos rurales de Macao', en ? 'Dominican ranch' : 'Rancho dominicano', en ? 'Cave and cenote' : 'Cueva y cenote', en ? 'Macao Beach' : 'Playa Macao']
      ).map((name, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'TouristAttraction', name } })),
    },
    offers: { '@type': 'Offer', price: product.promo, priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: pageUrl, description: en ? `Price per buggy (${product.capacityNumber} ${product.capacityNumber === 1 ? 'seat' : 'seats'})` : `Precio por buggy (${product.capacityNumber} ${product.capacityNumber === 1 ? 'plaza' : 'plazas'})` },
  };

  return (
    <main className="cb cb-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }} />
      <CbHeader locale={locale} esHref={`/buggy/${product.id}`} enHref={`/en/buggy/${product.id}`} bookingHref={`#${a.book}`} />
      <div className="cb-wrap cb-detail-hero">
        <div className="cb-detail-grid">
          <div className="cb-detail-main">
            <nav className="cb-crumbs" aria-label="Breadcrumb"><a href={base || '/'}><ArrowLeft size={13} /> {t.back}</a><span>/</span><span>{props.displayTitle}</span></nav>
            <span className="cb-kicker"><MapPin size={13} /> {product.routeLabel}</span>
            <h1>{props.h1}</h1>
            <p className="cb-lead">{props.summary}</p>
            <div className="cb-facts">
              <span><Users size={16} /> {en ? (product.capacityNumber === 1 ? '1 person' : product.capacityNumber === 2 ? 'Driver + passenger' : 'Up to 4 people') : product.capacityLabel}</span>
              <span><Clock3 size={16} /> {en ? 'About 4 hours with transfer' : product.durationLabel}</span>
              <span><ShieldCheck size={16} /> US${perPerson} {t.perPerson} · {t.perBuggy}</span>
            </div>
            <div className="cb-gallery">
              {photos.map((src, i) => <Image key={src} src={src} alt={`${props.displayTitle} · ${en ? 'Real tour photograph' : 'Foto real del recorrido'} ${i + 1}`} width={i === 0 ? 1200 : 600} height={i === 0 ? 800 : 400} priority={i === 0} sizes={i === 0 ? '(max-width: 1060px) 100vw, 50vw' : '(max-width: 1060px) 50vw, 25vw'} />)}
            </div>
          </div>
          <aside className="cb-aside" id={a.book}>
            <BookingWizard product={product} locale={locale} />
          </aside>
        </div>
      </div>

      <div className="cb-wrap cb-detail-grid">
        <div className="cb-detail-main">
          <section className="cb-detail-block">
            <span className="cb-kicker">{t.why}</span>
            <QuickAnswers locale={locale} bayahibe={isBayahibe} />
          </section>

          {props.itinerary ? (
            <section className="cb-detail-block" id={a.route}>
              <span className="cb-kicker">{t.day}</span>
              <h2>{props.routeHeading}</h2>
              {props.activityDuration ? <p><strong>{props.activityDuration}.</strong> {props.totalDuration}.</p> : null}
              <DayTimeline steps={props.itinerary} />
            </section>
          ) : null}

          {!isBayahibe ? (
            <section className="cb-detail-block" id={a.pickup}>
              <span className="cb-kicker">{t.pickup}</span>
              <h2>{en ? 'Will you pick me up?' : '¿Me recogen en mi hotel?'}</h2>
              <PickupPanel locale={locale} />
            </section>
          ) : null}

          <section className="cb-detail-block" id={a.included}>
            <span className="cb-kicker">{t.included}</span>
            <h2>{en ? `What the ${props.displayTitle} includes` : `Lo que incluye el ${props.displayTitle}`}</h2>
            <IncludedPanel locale={locale} included={props.included} notIncluded={props.notIncluded} requirements={props.requirements} bring={props.bring} />
          </section>

          <section className="cb-detail-block">
            <span className="cb-kicker">{t.route}</span>
            {props.itinerary ? null : <h2>{props.routeHeading}</h2>}
            <Image src={props.routeImage} alt={props.routeImageAlt} width={1000} height={560} sizes="(max-width: 1060px) 100vw, 60vw" style={{ width: '100%', height: 'auto', borderRadius: 20, marginBottom: 16 }} />
            <p>{props.routeBody}</p>
            <p className="cb-route-note"><ShieldCheck size={18} /> {props.routeNote}</p>
          </section>

          {isBayahibe ? <div className="cb-legacy cb-legacy-media"><BayahibeRealMedia locale={locale} /></div> : null}

          <section className="cb-detail-block" id={a.faq}>
            <span className="cb-kicker">FAQ</span>
            <h2>{t.faq}</h2>
            <FaqList faqs={props.faqs} />
          </section>

          <section className="cb-detail-block cb-legacy" aria-label={t.reviews}>
            <TripAdvisorReviews locale={locale} destination={isBayahibe ? 'bayahibe' : 'punta-cana'} location={`product_landing_${product.id}`} />
          </section>

          <section className="cb-detail-block">
            <span className="cb-kicker">{t.hotels}</span>
            <HotelLinks hotels={hotels} locale={locale} timeLabel={t.hotelTime} />
          </section>

          <section className="cb-detail-block">
            <span className="cb-kicker">{t.guides}</span>
            <GuideCards guides={props.guides} locale={locale} withImages={false} />
          </section>

          <section className="cb-detail-block">
            <span className="cb-kicker">{t.more}</span>
            <div className="cb-related">
              {[...related, ...otherRoute].map((p) => (
                <a key={p.id} href={`${base}/buggy/${p.id}`}>
                  <Image src={p.image} alt={vehicleLabel(p, en)} width={600} height={398} sizes="(max-width: 760px) 50vw, 220px" />
                  <span>{p.destination === product.destination ? (en ? `${p.capacityNumber === 1 ? '1 person' : p.capacityNumber === 2 ? '2 people' : 'up to 4 people'}` : p.subtitle) : t.otherRoute}</span>
                  <b>{vehicleLabel(p, en)}</b>
                  <strong>US${p.promo}</strong>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <CbFooter locale={locale} />
      <StickyBook locale={locale} href={`#${a.book}`} price={`US$${perPerson} ${t.perPerson}`} />
    </main>
  );
}
