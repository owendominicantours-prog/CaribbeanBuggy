import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  Camera,
  Car,
  CheckCircle2,
  Clock3,
  Coffee,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  bring,
  faqs,
  included,
  products,
  requirements,
  siteUrl,
  whatsappHref,
} from '../lib/buggyProducts';
import { hotelBuggyLandings, hotelBuggyUrl } from '../lib/hotelBuggyLandings';

function bookingMessage(option = 'Buggy tour en Punta Cana') {
  return [
    `Hola Proactivitis, quiero reservar ${option} con Caribbean Buggy.`,
    '',
    'Fecha del tour:',
    'Hotel o zona de recogida:',
    'Cantidad de personas:',
    'Nombre del cliente:',
    'Idioma:',
    '',
    'Por favor confirmame disponibilidad, hora de recogida y detalles de la reserva.',
  ].join('\n');
}

const highlights: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: 'Recogida incluida', text: 'Te buscamos y te dejamos en tu hotel en Bavaro o Punta Cana sin costo extra.', icon: Car },
  { title: 'Ruta autentica', text: 'Off-road real, Playa Macao, parada cultural y bano en cenote privado.', icon: MapPin },
  { title: 'Precio de rancho', text: 'Tarifas directas, claras y sin comisiones de hotel ni intermediarios.', icon: BadgeDollarSign },
  { title: 'Pago seguro', text: 'Reserva con PayPal o tarjeta y recibe instrucciones claras antes del tour.', icon: MessageCircle },
];

const route: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: 'Salida del hotel', text: 'Transporte incluido desde zonas principales de Punta Cana y Bavaro.', icon: Car },
  { title: 'Camino de lodo', text: 'Conduce por caminos rurales, charcos y senderos off-road de Macao.', icon: Waves },
  { title: 'Rancho dominicano', text: 'Degustacion de cafe, cacao, mamajuana y productos locales.', icon: Coffee },
  { title: 'Cenote y Macao', text: 'Tiempo para nadar en cenote privado y visitar la famosa Playa Macao.', icon: MapPin },
];

const schema = {
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
      '@type': 'ItemList',
      name: 'Buggy tours in Punta Cana',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: `${product.title} en Punta Cana`,
          description: product.description,
          image: `${siteUrl}${product.image}`,
          sku: product.id,
          brand: { '@type': 'Brand', name: 'Caribbean Buggy' },
          offers: {
            '@type': 'Offer',
            price: product.promo,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${siteUrl}/buggy/${product.id}`,
          },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Caribbean Buggy">
          <span>Caribbean</span>
          <b>Buggy</b>
        </a>
        <nav aria-label="Principal">
          <a href="#precios">Precios</a>
          <a href="#ruta">Ruta</a>
          <a href="#incluye">Incluye</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="#precios">
          Reservar
        </a>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-bg" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <MapPin size={16} /> Buggy tour en Punta Cana y Playa Macao
            </span>
            <h1>La aventura en buggy mas salvaje de Punta Cana.</h1>
            <p>
              Reserva directo con precio de rancho. Sin intermediarios, sin comisiones de hotel y con recogida incluida.
              Conduce por lodo, visita un rancho dominicano, nada en un cenote y termina en Playa Macao.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#precios">
                Ver precios <ArrowRight size={18} />
              </a>
              <a className="secondary-btn" href="#precios">
                Reservar ahora
              </a>
            </div>
          </div>

          <aside className="deal-card">
            <span>Desde</span>
            <strong>US$40</strong>
            <p>Buggy individual con transporte incluido.</p>
            <ul>
              <li><CheckCircle2 size={17} /> Recogida en hotel</li>
              <li><CheckCircle2 size={17} /> Cenote + Playa Macao</li>
              <li><CheckCircle2 size={17} /> Cafe, cacao y cultura local</li>
            </ul>
            <a href="#precios">
              Ver opciones y pagar seguro
            </a>
          </aside>
        </div>
      </section>

      <section className="trust-strip">
        <div className="wrap trust-grid">
          {highlights.map(({ title, text, icon: Icon }) => (
            <article key={title}>
              <Icon size={24} />
              <b>{title}</b>
              <span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="precios" className="section">
        <div className="wrap section-head">
          <span className="kicker">Precios directos</span>
          <h2>Elige tu buggy y paga por vehiculo, no por sorpresa.</h2>
          <p>Tarifas claras para turistas que quieren reservar rapido y evitar cargos ocultos.</p>
        </div>

        <div className="wrap product-grid">
          {products.map((product) => (
            <article className={`product-card ${product.popular ? 'popular' : ''}`} id={product.id} key={product.id}>
              {product.popular ? <div className="badge">Mas reservado</div> : null}
              <div className="product-top">
                <div>
                  <span>{product.subtitle}</span>
                  <h3>{product.title}</h3>
                </div>
                <Users />
              </div>
              <img className="product-photo" src={product.image} alt={`${product.title} en Punta Cana`} />
              <p className="hook">{product.hook}</p>
              <p>{product.description}</p>
              <div className="price-row">
                <small>Antes US${product.regular}</small>
                <strong>US${product.promo}</strong>
              </div>
              <div className="meta">
                <span><Users size={16} /> {product.capacityLabel}</span>
                <span><Clock3 size={16} /> 4 horas con traslado</span>
                <span><BadgeDollarSign size={16} /> {product.note}</span>
              </div>
              <a href={`/buggy/${product.id}`}>
                Ver detalle y reservar
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section hotel-link-section">
        <div className="wrap section-head">
          <span className="kicker">Recogida por hotel</span>
          <h2>Reserva buggy desde hoteles populares de Punta Cana.</h2>
          <p>Elige tu hotel y abre una pagina preparada con zona, recogida y reserva directa.</p>
        </div>
        <div className="wrap hotel-link-grid">
          {hotelBuggyLandings.slice(0, 18).map((hotel) => (
            <a key={hotel.slug} href={hotelBuggyUrl(hotel.slug).replace(siteUrl, '')}>
              <span>{hotel.zone}</span>
              <b>{hotel.name}</b>
              <small>{hotel.driveTime} al rancho aprox.</small>
            </a>
          ))}
        </div>
      </section>

      <section id="ruta" className="section route-section">
        <div className="wrap split">
          <div>
            <span className="kicker">Ruta autentica</span>
            <h2>Lodo, campo dominicano, cenote y Playa Macao en una sola salida.</h2>
            <p>
              No es una vuelta aburrida. Es una experiencia off-road pensada para ensuciarse, tomar fotos, probar sabores
              dominicanos y conocer el lado rural de Punta Cana.
            </p>
            <div className="route-note">
              <ShieldCheck />
              <span>Guia en ruta, equipo de seguridad y asistencia durante todo el recorrido.</span>
            </div>
          </div>
          <div className="route-grid">
            {route.map(({ title, text, icon: Icon }, index) => (
              <article key={title}>
                <b>{index + 1}</b>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="incluye" className="section">
        <div className="wrap info-grid">
          <article className="info-card">
            <span className="kicker">Incluido</span>
            <h2>Todo lo esencial ya va dentro del precio.</h2>
            <div className="check-grid">
              {included.map((item) => (
                <span key={item}><CheckCircle2 size={17} /> {item}</span>
              ))}
            </div>
          </article>
          <article className="info-card dark">
            <span className="kicker">Importante</span>
            <h2>Antes de reservar.</h2>
            <ul>
              {requirements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="info-card bring">
            <span className="kicker">Que llevar</span>
            <h2>Ven preparado para el lodo.</h2>
            <ul>
              {bring.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="gallery-band">
        <div className="wrap gallery-grid">
          <figure><img src="/buggy/ruta-1.jpeg" alt="Buggy tour en caminos de Macao" /><figcaption><Waves /> Lodo real de Macao</figcaption></figure>
          <figure><img src="/buggy/ruta-2.jpeg" alt="Grupo disfrutando tour de buggy en Punta Cana" /><figcaption><Camera /> Fotos del recorrido</figcaption></figure>
          <figure><img src="/buggy/ruta-3.jpeg" alt="Buggy en ruta off road en Punta Cana" /><figcaption><Coffee /> Rancho y cultura local</figcaption></figure>
          <figure><img src="/buggy/doble.jpeg" alt="Buggy doble en Punta Cana" /><figcaption><ShieldCheck /> Ruta guiada y segura</figcaption></figure>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="wrap section-head">
          <span className="kicker">Preguntas frecuentes</span>
          <h2>Respuestas rapidas antes de reservar.</h2>
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

      <section className="final-cta">
        <div className="wrap">
          <h2>Reserva tu buggy directo y evita comisiones.</h2>
          <p>Elige fecha, calcula el total y completa el pago seguro con tarjeta o PayPal.</p>
          <a className="primary-btn" href="#precios">
            Ver precios y reservar <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <a className="brand footer-brand" href="#inicio"><span>Caribbean</span><b>Buggy</b></a>
            <p>Buggy, boogie y boggie tours en Punta Cana con ruta a Macao, cenote y recogida incluida.</p>
          </div>
          <div>
            <h3>Reservas</h3>
            <a href={whatsappHref(bookingMessage())}>Ayuda por WhatsApp</a>
            <a href="#precios">Precios</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h3>Ruta</h3>
            <a href="#ruta">Playa Macao</a>
            <a href="#ruta">Cenote privado</a>
            <a href="#ruta">Rancho dominicano</a>
          </div>
        </div>
        <div className="wrap footer-credit">
          <a href="https://cynador.com" target="_blank" rel="noreferrer">
            Desarrollada por Cynador - Advertising, Marketing Online & Design - Diseño y Desarrollo Web
          </a>
        </div>
      </footer>

      <a className="floating-whatsapp" href={whatsappHref(bookingMessage())}>
        <MessageCircle size={20} /> Reservar
      </a>
    </main>
  );
}
