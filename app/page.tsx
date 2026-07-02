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

const whatsapp = 'https://wa.me/18294756298';
const siteUrl = 'https://caribbeanbuggy.com';

function whatsappHref(message: string) {
  return `${whatsapp}?text=${encodeURIComponent(message)}`;
}

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
    'Por favor confirmame disponibilidad, hora de recogida, precio final y detalles para completar la reserva por WhatsApp.',
  ].join('\n');
}

const products = [
  {
    id: 'buggy-individual',
    title: 'Buggy Individual',
    subtitle: '1 persona',
    hook: 'Para los amantes de la adrenalina pura.',
    description:
      'Toma el control absoluto del volante en un buggy todo terreno exclusivo para ti. Ideal para devorar el lodo, manejar a tu ritmo y vivir la ruta de Macao sin compartir el volante.',
    regular: 55,
    promo: 40,
    capacity: '1 adulto',
    note: 'Precio por vehiculo',
    image: '/buggy/individual.jpeg',
    popular: false,
  },
  {
    id: 'buggy-doble',
    title: 'Buggy Doble',
    subtitle: '2 personas',
    hook: 'Perfecto para parejas y amigos.',
    description:
      'La excursion mas popular de Punta Cana. Compartan la adrenalina, cambien de conductor si lo desean y exploren juntos el lado salvaje del Caribe.',
    regular: 95,
    promo: 75,
    capacity: 'Piloto + copiloto',
    note: 'Precio total por 2 pasajeros',
    image: '/buggy/doble.jpeg',
    popular: true,
  },
  {
    id: 'buggy-familiar',
    title: 'Buggy Familiar',
    subtitle: 'hasta 4 personas',
    hook: 'Diversion para toda la familia.',
    description:
      'Nadie se queda atras. Viajen juntos en un buggy de 4 plazas, seguro y espacioso para disfrutar lodo, cultura dominicana, cenote y Playa Macao en grupo.',
    regular: 180,
    promo: 140,
    capacity: 'Hasta 4 personas',
    note: 'Precio total por las 4 plazas',
    image: '/buggy/familiar.jpeg',
    popular: false,
  },
];

const highlights: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: 'Recogida incluida', text: 'Te buscamos y te dejamos en tu hotel en Bavaro o Punta Cana sin costo extra.', icon: Car },
  { title: 'Ruta autentica', text: 'Off-road real, Playa Macao, parada cultural y bano en cenote privado.', icon: MapPin },
  { title: 'Precio de rancho', text: 'Tarifas directas, claras y sin comisiones de hotel ni intermediarios.', icon: BadgeDollarSign },
  { title: 'Confirmacion rapida', text: 'Reserva por WhatsApp y recibe instrucciones claras antes del tour.', icon: MessageCircle },
];

const route: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: 'Salida del hotel', text: 'Transporte incluido desde zonas principales de Punta Cana y Bavaro.', icon: Car },
  { title: 'Camino de lodo', text: 'Conduce por caminos rurales, charcos y senderos off-road de Macao.', icon: Waves },
  { title: 'Rancho dominicano', text: 'Degustacion de cafe, cacao, mamajuana y productos locales.', icon: Coffee },
  { title: 'Cenote y Macao', text: 'Tiempo para nadar en cenote privado y visitar la famosa Playa Macao.', icon: MapPin },
];

const included = [
  'Transporte ida y vuelta al hotel',
  'Buggy segun modalidad elegida',
  'Casco y equipo de seguridad',
  'Guia oficial multilingue',
  'Degustacion de cafe, cacao y mamajuana',
  'Parada en cenote privado',
  'Visita a Playa Macao',
  'Asistencia durante la ruta',
];

const requirements = [
  'El conductor debe ser mayor de 18 anos y saber conducir.',
  'Edad minima para ninos acompanantes: 3 anos.',
  'No apto para mujeres embarazadas o personas con problemas severos de espalda.',
];

const bring = [
  'Ropa vieja que se pueda manchar.',
  'Traje de bano y toalla.',
  'Protector solar biodegradable y gafas de sol.',
  'Efectivo opcional para fotos, bebidas o souvenirs.',
];

const faqs = [
  ['El precio es por persona o por vehiculo?', 'El precio publicado es por vehiculo segun la modalidad: individual, doble o familiar.'],
  ['Incluye recogida en hotel?', 'Si, incluye recogida y regreso en hoteles de zonas principales de Bavaro y Punta Cana.'],
  ['Visitamos Playa Macao?', 'Si, la ruta incluye tiempo en Playa Macao y parada para cenote, sujeto a condiciones operativas del dia.'],
  ['Me voy a ensuciar?', 'Si. Es una aventura off-road con lodo, caminos rurales y agua. Recomendamos ropa vieja.'],
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
        <a className="header-cta" href={whatsappHref(bookingMessage())}>
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
              <a className="secondary-btn" href={whatsappHref(bookingMessage())}>
                WhatsApp
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
            <a href={whatsappHref(bookingMessage('buggy para hoy'))}>
              Reservar y confirmar por WhatsApp
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
                <span><Users size={16} /> {product.capacity}</span>
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
          <p>Pregunta disponibilidad para hoy o para la fecha de tu viaje. Te confirmamos horario, recogida y modalidad por WhatsApp.</p>
          <a className="primary-btn" href={whatsappHref(bookingMessage())}>
            Reservar y confirmar ahora <ArrowRight size={18} />
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
            <a href={whatsappHref(bookingMessage())}>WhatsApp Proactivitis</a>
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
