import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, BadgeDollarSign, CalendarCheck2, CheckCircle2, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react';
import BookingCalculator from '../../../components/BookingCalculator';
import LanguageSwitch from '../../../components/LanguageSwitch';
import { bring, faqs, getProduct, included, products, proactivitisPhone, requirements, siteUrl } from '../../../lib/buggyProducts';

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

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
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [product.image],
      type: 'website',
      locale: 'es_DO',
    },
  };
}

export default async function BuggyDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = products.filter((item) => item.id !== product.id);
  const isBayahibe = product.destination.toLowerCase().includes('bayahibe');
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
        areaServed: `${product.destination}, Dominican Republic`,
        offers: {
          '@type': 'Offer',
          price: product.promo,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/buggy/${product.id}`,
        },
      },
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
        mainEntity: faqs.map(([question, answer]) => ({
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
          <img src={product.image} alt={`${product.title} en ${product.destination}`} />
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
              {included.map((item) => <span key={item}><CheckCircle2 size={17} /> {item}</span>)}
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
          <img src="/buggy/ruta-1.jpeg" alt="Ruta de buggy en Macao" />
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

      <section id="faq" className="section faq-section">
        <div className="wrap section-head">
          <span className="kicker">FAQ</span>
          <h2>Preguntas comunes sobre {product.title}.</h2>
        </div>
        <div className="wrap faq-grid">
          {faqs.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section related-section">
        <div className="wrap section-head">
          <span className="kicker">Mas opciones</span>
          <h2>Tambien puedes reservar.</h2>
        </div>
        <div className="wrap related-grid">
          {related.map((item) => (
            <a href={`/buggy/${item.id}`} key={item.id}>
              <img src={item.image} alt={item.title} />
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
