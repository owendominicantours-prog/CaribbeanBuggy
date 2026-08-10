import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Hotel,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import BookingCalculator from '../../../../components/BookingCalculator';
import {
  bring,
  faqs,
  included,
  products,
  requirements,
  siteUrl,
  whatsappHref,
} from '../../../../lib/buggyProducts';
import {
  getHotelBuggyLanding,
  hotelBuggyLandings,
  hotelBuggyUrl,
} from '../../../../lib/hotelBuggyLandings';

type HotelBuggyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return hotelBuggyLandings.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({ params }: HotelBuggyPageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) return {};

  const title = `Buggy tour desde ${hotel.name} | Caribbean Buggy`;
  const description = `Reserva un tour en buggy desde ${hotel.name}. Recogida coordinada en ${hotel.zone}, ruta Macao, cenote, playa y pago seguro desde US$40.`;
  const canonical = hotelBuggyUrl(hotel.slug);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [`${siteUrl}/buggy/doble.jpeg`],
    },
  };
}

export default async function HotelBuggyPage({ params }: HotelBuggyPageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) notFound();

  const featuredProduct = products.find((product) => product.popular) ?? products[0];
  const canonical = hotelBuggyUrl(hotel.slug);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Caribbean Buggy', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Buggy tours', item: `${siteUrl}/#precios` },
          { '@type': 'ListItem', position: 3, name: hotel.name, item: canonical },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: `Buggy tour from ${hotel.name}`,
        serviceType: 'Buggy tour with hotel pickup',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Caribbean Buggy',
          url: siteUrl,
          telephone: '+1-829-475-6298',
        },
        areaServed: {
          '@type': 'Place',
          name: `${hotel.zone}, Punta Cana`,
        },
        description: `Buggy tour with pickup from ${hotel.name}, Macao off-road route, cenote stop, Dominican ranch and beach visit.`,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: Math.min(...products.map((product) => product.promo)),
          highPrice: Math.max(...products.map((product) => product.promo)),
          offerCount: products.length,
          availability: 'https://schema.org/InStock',
          url: canonical,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Can I book a buggy tour from ${hotel.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes. Caribbean Buggy coordinates pickup from ${hotel.name} or the closest authorized tour pickup point.`,
            },
          },
          ...faqs.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        ],
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="site-header">
        <a className="brand" href="/">
          <span>Caribbean</span>
          <b>Buggy</b>
        </a>
        <nav aria-label="Principal">
          <a href="/#precios">Precios</a>
          <a href="/#ruta">Ruta</a>
          <a href="/#incluye">Incluye</a>
          <a href="/#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="#reservar">Reservar</a>
      </header>

      <section className="hotel-buggy-hero">
        <div className="wrap hotel-buggy-grid">
          <div>
            <span className="eyebrow">
              <Hotel size={16} /> Recogida desde {hotel.zone}
            </span>
            <h1>Buggy tour desde {hotel.name}</h1>
            <p>
              Sal de {hotel.name} hacia una ruta off-road en Macao con lodo, rancho dominicano,
              cenote y Playa Macao. Reserva directo con precio claro y confirmacion por WhatsApp.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#reservar">
                Reservar desde {hotel.name} <ArrowRight size={18} />
              </a>
              <a
                className="secondary-btn"
                href={whatsappHref(`Hola, quiero reservar buggy desde ${hotel.name}. Fecha: `)}
              >
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
          <img src="/buggy/doble.jpeg" alt={`Buggy tour con recogida desde ${hotel.name}`} />
        </div>
      </section>

      <section className="section compact-section">
        <div className="wrap hotel-facts">
          <article>
            <MapPin />
            <b>Zona</b>
            <span>{hotel.zone}</span>
          </article>
          <article>
            <Clock3 />
            <b>Tiempo estimado al rancho</b>
            <span>{hotel.driveTime}</span>
          </article>
          <article>
            <Users />
            <b>Modalidades</b>
            <span>Individual, doble o familiar</span>
          </article>
          <article>
            <ShieldCheck />
            <b>Pickup</b>
            <span>{hotel.pickupNote}</span>
          </article>
        </div>
      </section>

      <section id="reservar" className="section booking-section">
        <div className="wrap detail-layout">
          <div className="detail-main">
            <span className="kicker">Como funciona desde tu hotel</span>
            <h2>Ruta organizada para huespedes de {hotel.name}</h2>
            <p>
              El equipo confirma tu hora de recogida segun la tanda disponible, te envia instrucciones
              claras por WhatsApp y coordina el punto autorizado del hotel. Al llegar al rancho recibes
              instrucciones de seguridad, eliges el buggy reservado y sales con guia por la ruta de Macao.
            </p>
            <div className="check-grid">
              {included.slice(0, 8).map((item) => (
                <span key={item}><CheckCircle2 size={17} /> {item}</span>
              ))}
            </div>

            <div className="info-card hotel-copy-card">
              <span className="kicker">Antes de reservar</span>
              <h2>Detalles importantes para {hotel.name}</h2>
              <ul>
                {requirements.map((item) => <li key={item}>{item}</li>)}
                <li>{hotel.pickupNote}</li>
                <li>La hora exacta puede variar por ruta de recogida, trafico y tanda confirmada.</li>
              </ul>
            </div>

            <div className="info-card hotel-copy-card">
              <span className="kicker">Que llevar</span>
              <h2>Preparado para lodo, agua y fotos</h2>
              <ul>
                {bring.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
          <BookingCalculator
            product={featuredProduct}
            defaultHotel={hotel.name}
            defaultPickupZone={hotel.zone.includes('Uvero') ? 'Uvero Alto' : hotel.zone.includes('Cap Cana') ? 'Cap Cana' : 'Bavaro / Punta Cana'}
          />
        </div>
      </section>
    </main>
  );
}
