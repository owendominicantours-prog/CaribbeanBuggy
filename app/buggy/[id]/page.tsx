import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BadgeDollarSign, CalendarCheck2, CheckCircle2, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react';
import BookingCalculator from '../../../components/BookingCalculator';
import LanguageSwitch from '../../../components/LanguageSwitch';
import { bring, faqs, getProduct, included, products, proactivitisPhone, requirements, siteUrl } from '../../../lib/buggyProducts';
import { guidePath, seoGuides } from '../../../lib/seoGuides';
import TripAdvisorReviews from '../../../components/TripAdvisorReviews';
import { tripadvisorSchemaReference } from '../../../lib/tripadvisor';
import BayahibeRealMedia from '../../../components/BayahibeRealMedia';

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

const bayahibeIncluded = [
  'Transporte ida y vuelta desde el hotel o punto confirmado',
  'Buggy según la modalidad elegida',
  'Casco e instrucciones de seguridad',
  'Guía local durante la ruta',
  'Ruta por cañaverales, comunidades rurales y caminos de lodo',
  'Parada en el río Chavón según la operación',
  'Asistencia durante toda la excursión',
];

const bayahibeFaqs = [
  ['¿El precio es por persona o por vehículo?', 'El precio publicado es por vehículo según la modalidad elegida.'],
  ['¿Hay recogida desde hoteles de Bayahibe y La Romana?', 'Sí. La recogida o punto de encuentro autorizado se confirma por WhatsApp según el hotel y la operación.'],
  ['¿Qué visita la ruta de Bayahibe?', 'La ruta recorre cañaverales, comunidades rurales, charcos y caminos de lodo, con parada en el río Chavón según la operación.'],
  ['¿Las fotos y el video son reales?', 'Sí. El material mostrado pertenece a la operación real de buggy en Bayahibe y La Romana.'],
];

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `${siteUrl}/buggy/${product.id}`,
      languages: {
        es: `${siteUrl}/buggy/${product.id}`,
        en: `${siteUrl}/en/buggy/${product.id}`,
        'x-default': `${siteUrl}/buggy/${product.id}`,
      },
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: `${siteUrl}/buggy/${product.id}`,
      siteName: 'Caribbean Buggy',
      images: [product.image],
      type: 'website',
      locale: 'es_DO',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.image],
    },
  };
}

export default async function BuggyDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = products.filter((item) => item.id !== product.id);
  const isBayahibe = product.destination.toLowerCase().includes('bayahibe');
  const localizedIncluded = isBayahibe ? bayahibeIncluded : included;
  const localizedFaqs = isBayahibe ? bayahibeFaqs : faqs;
  const productGuides = seoGuides.filter((guide) => guide.destination === (isBayahibe ? 'bayahibe' : 'punta-cana') || guide.destination === 'general').slice(0, 4);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${product.title} en ${product.destination}`,
        description: product.longDescription,
        image: `${siteUrl}${product.image}`,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Caribbean Buggy' },
        ...tripadvisorSchemaReference(isBayahibe ? 'bayahibe' : 'punta-cana', 'es'),
        areaServed: `${product.destination}, Dominican Republic`,
        offers: {
          '@type': 'Offer',
          price: product.promo,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/buggy/${product.id}`,
        },
      },
      ...(isBayahibe ? [{
        '@type': 'VideoObject',
        name: 'Video real del tour en buggy de Bayahibe y La Romana',
        description: 'Video original de la ruta con buggies, cañaverales, caminos rurales y lodo en Bayahibe.',
        thumbnailUrl: [`${siteUrl}/buggy/bayahibe/buggy-lodo-bayahibe.jpg`],
        contentUrl: `${siteUrl}/buggy/bayahibe/tour-buggy-bayahibe.mp4`,
        uploadDate: '2026-08-13T12:00:00-04:00',
        duration: 'PT47S',
      }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Buggies Punta Cana', item: `${siteUrl}/#precios` },
          { '@type': 'ListItem', position: 3, name: product.title, item: `${siteUrl}/buggy/${product.id}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: localizedFaqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <main className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="site-header">
        <a className="brand" href="/" aria-label="Caribbean Buggy">
          <span>Caribbean</span>
          <b>Buggy</b>
        </a>
        <nav aria-label="Detalle">
          <a href="/#precios">Precios</a>
          <a href="#reservar">Reservar</a>
          <a href="#incluye">Incluye</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch current="es" esHref={`/buggy/${product.id}`} enHref={`/en/buggy/${product.id}`} />
          <a className="header-cta" href="#reservar">Reservar</a>
        </div>
      </header>

      <section className="detail-hero">
        <div className="wrap detail-hero-grid">
          <div>
            <a className="back-link" href="/"><ArrowLeft size={17} /> Volver a todos los buggies</a>
            <span className="eyebrow"><MapPin size={16} /> {product.routeLabel}</span>
            <h1>{product.title} en {product.destination}</h1>
            <p>{product.longDescription}</p>
            <div className="detail-badges">
              <span><Users size={17} /> {product.capacityLabel}</span>
              <span><Clock3 size={17} /> {product.durationLabel}</span>
              <span><BadgeDollarSign size={17} /> Desde US${product.promo}</span>
            </div>
          </div>
          <Image src={product.image} alt={`${product.title} en ${product.destination}`} width={1200} height={795} priority sizes="(max-width: 980px) 100vw, 46vw" />
        </div>
      </section>

      <section id="reservar" className="section detail-booking-section">
        <div className="wrap detail-booking-grid">
          <BookingCalculator product={product} />
          <div className="detail-copy">
            <span className="kicker">Reserva con datos completos</span>
            <h2>Calcula el total y solicita tu plaza.</h2>
            <p>
              El sistema calcula los vehiculos necesarios segun el grupo y la zona, y prepara una
              solicitud completa para que el equipo confirme disponibilidad sin volver a pedirte todos los datos.
            </p>
            <div className="logic-grid">
              <article><b>1</b><span>Elige fecha, hotel, zona y cantidad de personas.</span></article>
              <article><b>2</b><span>Selecciona si prefieres deposito, pago total o confirmar primero.</span></article>
              <article><b>3</b><span>Recibe confirmacion y un enlace de pago seguro por WhatsApp.</span></article>
            </div>
          </div>
        </div>
      </section>

      <section id="incluye" className="section">
        <div className="wrap detail-info-grid">
          <article className="info-card">
            <span className="kicker">Incluido</span>
            <h2>Lo que recibes con {product.title}.</h2>
            <div className="check-grid">
              {localizedIncluded.map((item) => <span key={item}><CheckCircle2 size={17} /> {item}</span>)}
            </div>
          </article>
          <article className="info-card dark">
            <span className="kicker">Seguridad</span>
            <h2>Antes de manejar.</h2>
            <ul>{requirements.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="info-card bring">
            <span className="kicker">Que llevar</span>
            <h2>Preparate para el lodo.</h2>
            <ul>{bring.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="detail-route">
        <div className="wrap detail-route-grid">
          <Image src={isBayahibe ? '/buggy/bayahibe/convoy-rural-bayahibe.jpg' : '/buggy/ruta-1.jpeg'} alt={isBayahibe ? 'Ruta real de buggy entre cañaverales de Bayahibe' : 'Ruta de buggy en Macao'} width={1000} height={663} sizes="(max-width: 980px) 100vw, 46vw" />
          <div>
            <span className="kicker">Ruta del tour</span>
            <h2>{isBayahibe ? 'Bayahibe, La Romana y caminos rurales.' : 'Macao, cenote y rancho dominicano.'}</h2>
            <p>
              La experiencia combina aventura off-road, cultura local y paradas naturales. El orden puede variar segun
              operacion, clima y condiciones del camino.
            </p>
            <div className="route-note">
              <ShieldCheck />
              <span>El equipo confirma la hora exacta de recogida por WhatsApp antes del servicio.</span>
            </div>
          </div>
        </div>
      </section>

      {isBayahibe ? <BayahibeRealMedia locale="es" /> : null}

      <section id="faq" className="section faq-section">
        <div className="wrap section-head">
          <span className="kicker">FAQ</span>
          <h2>Preguntas comunes sobre {product.title}.</h2>
        </div>
        <div className="wrap faq-grid">
          {localizedFaqs.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tripadvisor" className="section tripadvisor-section"><div className="wrap"><TripAdvisorReviews locale="es" destination={isBayahibe ? 'bayahibe' : 'punta-cana'} location={`product_landing_${product.id}`} /></div></section>

      <section className="section related-section">
        <div className="wrap section-head"><span className="kicker">Guías para decidir</span><h2>Conoce la ruta antes de pagar.</h2></div>
        <div className="wrap seo-guide-related-grid">{productGuides.map((guide) => <a href={guidePath(guide, 'es')} key={guide.id}><span>{guide.es.eyebrow}</span><b>{guide.es.title}</b><ArrowRight size={17} /></a>)}</div>
      </section>

      <section className="section related-section">
        <div className="wrap section-head">
          <span className="kicker">Mas opciones</span>
          <h2>Tambien puedes reservar.</h2>
        </div>
        <div className="wrap related-grid">
          {related.map((item) => (
            <a href={`/buggy/${item.id}`} key={item.id}>
              <Image src={item.image} alt={item.title} width={600} height={398} sizes="(max-width: 680px) 100vw, 33vw" />
              <span>{item.subtitle}</span>
              <b>{item.title}</b>
              <strong>US${item.promo}</strong>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <a className="brand footer-brand" href="/"><span>Caribbean</span><b>Buggy</b></a>
            <p>Reservas operadas y confirmadas por WhatsApp con Proactivitis: {proactivitisPhone}.</p>
          </div>
          <div>
            <h3>Productos</h3>
            {products.map((item) => <a href={`/buggy/${item.id}`} key={item.id}>{item.title}</a>)}
          </div>
          <div>
            <h3>Reservar</h3>
            <a href="#reservar">Calculadora</a>
            <a href="/#precios">Ver precios</a>
            <a href="/guias">Guías de buggy</a>
          </div>
        </div>
        <div className="wrap footer-credit">
          <a href="https://cynador.com" target="_blank" rel="noreferrer">
            Desarrollada por Cynador - Advertising, Marketing Online & Design - Diseño y Desarrollo Web
          </a>
        </div>
      </footer>

      <a className="detail-floating-cta" href="#reservar">
        <CalendarCheck2 size={19} /> Reservar desde US${product.promo}
      </a>
    </main>
  );
}
