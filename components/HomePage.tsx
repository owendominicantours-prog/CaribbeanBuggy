import Image from 'next/image';
import { ArrowRight, Check, Clock3, MapPin, ShieldCheck } from 'lucide-react';
import { pickupPolicy } from '../lib/pickupPolicy';
import VehicleComparison from './VehicleComparison';
import { faqs, products, siteUrl, whatsappHref, type BuggyProduct } from '../lib/buggyProducts';
import { getFeaturedHotelBuggyLandings } from '../lib/hotelBuggyLandings';
import { questionsPath } from '../lib/buggyQuestions';
import { guidesPath, seoGuides } from '../lib/seoGuides';
import TripAdvisorReviews from './TripAdvisorReviews';
import { tripadvisorProfiles, tripadvisorSchemaReference } from '../lib/tripadvisor';
import { searchLandingsPath } from '../lib/searchLandings';
import { getPuntaCanaBuggyContent } from '../lib/puntaCanaBuggyContent';
import QuickQuote from './cb/QuickQuote';
import { CbFooter, CbHeader, StickyBook, homeAnchors } from './cb/Chrome';
import { DayTimeline, FaqList, GuideCards, HotelLinks, IncludedPanel, PickupPanel, ProductCards, QuickAnswers, SectionHead } from './cb/Sections';
import PhotoCarousel from './cb/PhotoCarousel';
import { puntaCanaPhotos } from '../lib/sitePhotos';

type Locale = 'es' | 'en';

const englishFaqs: Array<[string, string]> = [
  ['Is the price per person or per vehicle?', 'The displayed price is per vehicle according to the selected single, double or family option.'],
  ['Is hotel pickup included?', pickupPolicy.en.coverage + " " + pickupPolicy.en.meeting],
  ['Do we visit Macao Beach?', 'Yes. The route normally includes Macao Beach and a cenote stop, subject to daily operating conditions.'],
  ['Will I get muddy?', 'Yes. This is a real off-road experience with mud, rural roads and water. Wear clothes you do not mind getting dirty.'],
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
        sameAs: [tripadvisorProfiles['punta-cana'].urls.en, tripadvisorProfiles.bayahibe.urls.en],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'reservations',
          telephone: '+1-829-553-9900',
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
  const base = isEn ? '/en' : '';
  const a = homeAnchors(locale);
  const featuredHotels = getFeaturedHotelBuggyLandings();
  const puntaCanaProducts = products.filter((product) => !product.destination.includes('Bayahibe'));
  const bayahibeProducts = products.filter((product) => product.destination.includes('Bayahibe'));
  const pageFaqs = isEn ? englishFaqs : faqs;
  const content = getPuntaCanaBuggyContent(products.find((p) => p.id === 'buggy-doble') as BuggyProduct, locale);
  const copy = isEn
    ? {
        eyebrow: 'Punta Cana · Macao Beach · Pickup in covered areas',
        title: 'Trade the resort for a Punta Cana buggy adventure.',
        lead: 'Drive your own off-road buggy through mud trails, a Dominican ranch, a cenote and Macao Beach. About 4 hours, guide included, from US$30 per person.',
        chips: ['About 4 hours', 'Pickup in covered areas', 'Card payment · e-ticket by email'],
        answersKicker: 'Before you ask',
        answersTitle: 'The four things everyone wants to know.',
        pricesKicker: 'Prices',
        pricesTitle: 'Pick the buggy for your group. The price is per buggy.',
        pricesBody: 'Two people share a double, families share a 4-seater. In the booking you only say how many you are and we suggest the cheapest mix.',
        bayahibeKicker: 'Another route · Bayahibe and La Romana',
        bayahibeTitle: 'Staying in Bayahibe or La Romana?',
        bayahibeBody: 'Different tour, different route: sugar-cane roads, rural villages and the Chavón River. It does not go to Macao.',
        dayKicker: 'How the day goes',
        dayTitle: 'From your hotel to Macao Beach and back.',
        dayBody: `${content.activityDuration}. ${content.totalDuration}.`,
        pickupKicker: 'Pickup',
        pickupTitle: 'Will you pick me up? Check your area.',
        hotelsTitle: 'Find your hotel',
        hotelsBody: 'Each page shows your area, the estimated drive and the booking with your hotel ready.',
        hotelTime: 'to the ranch',
        includedKicker: 'Included',
        includedTitle: 'What you get and what to bring.',
        reviewsKicker: 'Travelers',
        guidesKicker: 'Guides',
        guidesTitle: 'Plan your buggy day.',
        allGuides: `Explore all ${seoGuides.length} guides`,
        faqKicker: 'Questions',
        faqTitle: 'Quick answers before booking.',
        allQuestions: 'See all buggy questions',
        searches: '304 excursion searches',
        finalTitle: 'Your buggy is waiting in Punta Cana.',
        finalBody: 'Say how many you are, choose the date and pay by card. We confirm the exact time on WhatsApp.',
        finalCta: 'Book my buggy',
        whatsapp: 'Prefer WhatsApp? Write to us',
      }
    : {
        eyebrow: 'Punta Cana · Playa Macao · Recogida en zonas cubiertas',
        title: 'Tu día de barro. Tu Punta Cana en buggy.',
        lead: 'Maneja tu propio buggy por caminos de lodo, un rancho dominicano, un cenote y Playa Macao. Unas 4 horas, con guía, desde US$30 por persona.',
        chips: ['Unas 4 horas', 'Recogida en zonas cubiertas', 'Pago con tarjeta · e-ticket por correo'],
        answersKicker: 'Antes de preguntar',
        answersTitle: 'Lo que todo el mundo quiere saber.',
        pricesKicker: 'Precios',
        pricesTitle: 'Elige el buggy para tu grupo. Se paga por buggy.',
        pricesBody: 'Dos personas comparten un doble y una familia, uno de 4 plazas. En la reserva solo dices cuántos son y te proponemos la combinación más barata.',
        bayahibeKicker: 'Otra ruta · Bayahibe y La Romana',
        bayahibeTitle: '¿Te hospedas en Bayahibe o La Romana?',
        bayahibeBody: 'Es otro tour con otra ruta: cañaverales, comunidades rurales y el río Chavón. No va a Macao.',
        dayKicker: 'Cómo es el día',
        dayTitle: 'De tu hotel a Playa Macao y de vuelta.',
        dayBody: `${content.activityDuration}. ${content.totalDuration}.`,
        pickupKicker: 'Recogida',
        pickupTitle: '¿Me recogen? Revisa tu zona.',
        hotelsTitle: 'Busca tu hotel',
        hotelsBody: 'Cada página muestra tu zona, el tiempo estimado y la reserva con tu hotel ya puesto.',
        hotelTime: 'aprox. al rancho',
        includedKicker: 'Incluye',
        includedTitle: 'Lo que recibes y lo que debes llevar.',
        reviewsKicker: 'Viajeros',
        guidesKicker: 'Guías',
        guidesTitle: 'Planifica tu día en buggy.',
        allGuides: `Explorar las ${seoGuides.length} guías`,
        faqKicker: 'Preguntas',
        faqTitle: 'Respuestas rápidas antes de reservar.',
        allQuestions: 'Ver todas las preguntas de buggy',
        searches: '304 búsquedas de excursiones',
        finalTitle: 'Tu buggy te espera en Punta Cana.',
        finalBody: 'Di cuántos son, elige la fecha y paga con tarjeta. La hora exacta te la confirmamos por WhatsApp.',
        finalCta: 'Reservar mi buggy',
        whatsapp: '¿Prefieres WhatsApp? Escríbenos',
      };

  return (
    <main className="cb cb-home">
      <CbHeader locale={locale} esHref="/" enHref="/en" bookingHref={`#${a.prices}`} />

      <section className="cb-hero">
        <Image className="cb-hero-bg" src="/buggy/doble.jpeg" alt="" fill priority sizes="100vw" />
        <div className="cb-wrap cb-hero-grid">
          <div className="cb-hero-copy">
            <span className="cb-eyebrow"><MapPin size={15} /> {copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
            <ul className="cb-hero-chips">{copy.chips.map((c) => <li key={c}><Check size={15} /> {c}</li>)}</ul>
            <a className="cb-hero-link" href={`#${a.prices}`}>{isEn ? 'See the 3 buggies and prices' : 'Ver los 3 buggies y sus precios'} <ArrowRight size={16} /></a>
          </div>
          <QuickQuote locale={locale} />
        </div>
      </section>

      <section className="cb-band">
        <div className="cb-wrap">
          <SectionHead kicker={copy.answersKicker} title={copy.answersTitle} />
          <QuickAnswers locale={locale} />
        </div>
      </section>

      <section className="cb-section" id={a.prices}>
        <div className="cb-wrap">
          <SectionHead kicker={copy.pricesKicker} title={copy.pricesTitle} body={copy.pricesBody} />
          <ProductCards items={puntaCanaProducts} locale={locale} />
        </div>
      </section>
      <div className="cb-legacy cb-compare"><VehicleComparison locale={locale} /></div>

      <section className="cb-section" id={a.route}>
        <div className="cb-wrap cb-day">
          <div>
            <SectionHead kicker={copy.dayKicker} title={copy.dayTitle} body={copy.dayBody} />
            <p className="cb-note"><Clock3 size={16} /> {content.routeNote}</p>
          </div>
          <DayTimeline steps={content.itinerary} />
        </div>
      </section>

      <section className="cb-section cb-section-tight">
        <div className="cb-wrap">
          <SectionHead kicker={isEn ? 'Real photos' : 'Fotos reales'} title={isEn ? 'This is what your day looks like.' : 'Así se ve tu día en buggy.'} body={isEn ? 'Photos from our own Punta Cana and Macao tours: mud, the cenote and Macao Beach.' : 'Fotos de nuestros propios tours por Punta Cana y Macao: lodo, cenote y Playa Macao.'} />
          <PhotoCarousel photos={puntaCanaPhotos.slice(0, 10)} locale={locale} />
        </div>
      </section>

      <section className="cb-section cb-section-sand" id={a.pickup}>
        <div className="cb-wrap">
          <SectionHead kicker={copy.pickupKicker} title={copy.pickupTitle} body={pickupPolicy[locale].coverage} />
          <PickupPanel locale={locale} />
          <h3 className="cb-subtitle">{copy.hotelsTitle}</h3>
          <p className="cb-subbody">{copy.hotelsBody}</p>
          <HotelLinks hotels={featuredHotels} locale={locale} timeLabel={copy.hotelTime} />
          <p className="cb-more"><a href={isEn ? '/en/buggy-tour' : '/es/buggy-tour'}>{isEn ? 'See every hotel with buggy pickup' : 'Ver todos los hoteles con recogida'} <ArrowRight size={16} /></a></p>
        </div>
      </section>

      <section className="cb-section" id={a.included}>
        <div className="cb-wrap">
          <SectionHead kicker={copy.includedKicker} title={copy.includedTitle} />
          <IncludedPanel locale={locale} included={content.included} notIncluded={content.notIncluded} requirements={content.requirements} bring={content.bring} />
        </div>
      </section>

      <section className="cb-section cb-section-dark">
        <div className="cb-wrap">
          <SectionHead kicker={copy.bayahibeKicker} title={copy.bayahibeTitle} body={copy.bayahibeBody} />
          <ProductCards items={bayahibeProducts} locale={locale} compact />
        </div>
      </section>

      <section className="cb-section cb-legacy cb-reviews" aria-label={copy.reviewsKicker}>
        <div className="cb-wrap"><TripAdvisorReviews locale={locale} destination="punta-cana" location="home" /></div>
      </section>

      <section className="cb-section">
        <div className="cb-wrap">
          <SectionHead kicker={copy.guidesKicker} title={copy.guidesTitle} />
          <GuideCards guides={seoGuides.slice(0, 6)} locale={locale} />
          <p className="cb-more"><a href={guidesPath(locale)}>{copy.allGuides} <ArrowRight size={16} /></a> <a href={searchLandingsPath(locale)}>{copy.searches} <ArrowRight size={16} /></a></p>
        </div>
      </section>

      <section className="cb-section cb-section-sand" id={a.faq}>
        <div className="cb-wrap cb-narrow">
          <SectionHead kicker={copy.faqKicker} title={copy.faqTitle} />
          <FaqList faqs={pageFaqs} />
          <p className="cb-more"><a href={questionsPath(locale)}>{copy.allQuestions} <ArrowRight size={16} /></a></p>
        </div>
      </section>

      <section className="cb-final">
        <div className="cb-wrap">
          <ShieldCheck size={30} />
          <h2>{copy.finalTitle}</h2>
          <p>{copy.finalBody}</p>
          <a className="cb-cta" href={`${base}/buggy/buggy-doble#${a.book}`} data-track-event="booking_cta_click" data-track-location="final_cta">{copy.finalCta} <ArrowRight size={18} /></a>
          <a className="cb-final-wa" href={whatsappHref(isEn ? 'Hello, I have a question before booking on Caribbean Buggy.' : 'Hola, tengo una duda antes de reservar en Caribbean Buggy.')}>{copy.whatsapp}</a>
        </div>
      </section>

      <CbFooter locale={locale} />
      <StickyBook locale={locale} href={`#${a.prices}`} price={isEn ? 'US$30 / person' : 'US$30 / persona'} />
    </main>
  );
}
