import type { Metadata } from 'next';
import { ArrowRight, BadgeDollarSign, Car, CheckCircle2, Clock3, Coffee, MapPin, MessageCircle, Users, Waves } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import LanguageSwitch from '../../components/LanguageSwitch';
import { products, siteUrl } from '../../lib/buggyProducts';
import { hotelBuggyLandings, hotelBuggyUrl } from '../../lib/hotelBuggyLandings';

export const metadata: Metadata = {
  title: 'Buggy Tours in Punta Cana | Caribbean Buggy',
  description:
    'Book Punta Cana buggy tours with hotel pickup, Macao off-road trails, Dominican ranch, cenote stop, Macao Beach and secure payment.',
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: {
      en: `${siteUrl}/en`,
      es: siteUrl,
      'x-default': siteUrl,
    },
  },
  openGraph: {
    title: 'Buggy Tours in Punta Cana | Caribbean Buggy',
    description: 'Compare single, double and family buggy tours in Punta Cana and Bayahibe with hotel pickup.',
    url: `${siteUrl}/en`,
    images: ['/buggy/doble.jpeg'],
    locale: 'en_US',
    type: 'website',
  },
};

const highlights: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: 'Hotel pickup included', text: 'Pickup and return from main Bavaro and Punta Cana hotel zones.', icon: Car },
  { title: 'Real off-road route', text: 'Mud trails, Macao Beach, Dominican ranch and cenote stop.', icon: MapPin },
  { title: 'Direct ranch pricing', text: 'Clear vehicle prices without hotel desk commissions.', icon: BadgeDollarSign },
  { title: 'Secure payment', text: 'Pay by card or PayPal and receive clear pickup instructions.', icon: MessageCircle },
];

function englishTitle(title: string) {
  return title
    .replace('Buggy Individual', 'Single Buggy')
    .replace('Buggy Doble', 'Double Buggy')
    .replace('Buggy Familiar', 'Family Buggy')
    .replace('Bayahibe Buggy Individual', 'Bayahibe Single Buggy')
    .replace('Bayahibe Buggy Doble', 'Bayahibe Double Buggy')
    .replace('Bayahibe Buggy Familiar', 'Bayahibe Family Buggy');
}

function englishDescription(destination: string) {
  if (destination.includes('Bayahibe')) {
    return 'Off-road buggy experience from Bayahibe and La Romana with coordinated pickup, rural trails and local support.';
  }
  return 'Punta Cana buggy experience with hotel pickup, muddy trails, Dominican ranch, cenote stop and Macao Beach.';
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Caribbean Buggy',
      url: siteUrl,
      areaServed: 'Punta Cana, Dominican Republic',
    },
    {
      '@type': 'ItemList',
      name: 'Buggy tours in Punta Cana and Bayahibe',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: englishTitle(product.title),
          description: englishDescription(product.destination),
          image: `${siteUrl}${product.image}`,
          offers: {
            '@type': 'Offer',
            price: product.promo,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${siteUrl}/en/buggy/${product.id}`,
          },
        },
      })),
    },
  ],
};

export default function EnglishHome() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="site-header">
        <a className="brand" href="/en" aria-label="Caribbean Buggy">
          <span>Caribbean</span>
          <b>Buggy</b>
        </a>
        <nav aria-label="Main">
          <a href="#prices">Prices</a>
          <a href="#route">Route</a>
          <a href="#included">Included</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch current="en" esHref="/" enHref="/en" />
          <a className="header-cta" href="#prices">Book now</a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-bg" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><MapPin size={16} /> Buggy tour in Punta Cana and Macao Beach</span>
            <h1>The wildest buggy adventure in Punta Cana.</h1>
            <p>
              Book direct with ranch pricing. Hotel pickup, muddy off-road trails, Dominican ranch, cenote stop and
              Macao Beach in one easy reservation flow.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#prices">
                See prices <ArrowRight size={18} />
              </a>
              <a className="secondary-btn" href="#prices">Book now</a>
            </div>
          </div>

          <aside className="deal-card">
            <span>From</span>
            <strong>US$40</strong>
            <p>Single buggy with hotel pickup included.</p>
            <ul>
              <li><CheckCircle2 size={17} /> Hotel pickup</li>
              <li><CheckCircle2 size={17} /> Cenote + Macao Beach</li>
              <li><CheckCircle2 size={17} /> Coffee, cacao and local culture</li>
            </ul>
            <a href="#prices">Compare options</a>
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

      <section id="prices" className="section">
        <div className="wrap section-head">
          <span className="kicker">Buggy options</span>
          <h2>Choose your buggy and reserve.</h2>
          <p>Prices are per vehicle, not per person. Select the option that matches your group.</p>
        </div>
        <div className="wrap product-grid">
          {products.map((product) => (
            <article className={`product-card ${product.popular ? 'popular' : ''}`} key={product.id}>
              {product.popular && <span className="popular-badge">Most booked</span>}
              <div className="product-top">
                <span>{product.subtitle}</span>
                <Users />
              </div>
              <h3>{englishTitle(product.title)}</h3>
              <img src={product.image} alt={`${englishTitle(product.title)} in ${product.destination}`} />
              <p>{englishDescription(product.destination)}</p>
              <div className="price-row">
                <span>From</span>
                <b>US${product.promo}</b>
              </div>
              <ul>
                <li><Users size={17} /> {product.capacityLabel}</li>
                <li><Clock3 size={17} /> {product.durationLabel}</li>
                <li><BadgeDollarSign size={17} /> {product.note}</li>
              </ul>
              <a href={`/en/buggy/${product.id}`}>
                Details and booking <ArrowRight size={18} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="route" className="section route-section">
        <div className="wrap section-head">
          <span className="kicker">Tour route</span>
          <h2>Mud, ranch, cenote and Macao Beach.</h2>
          <p>Operations may change by weather and road conditions, but the tour is built around real off-road fun.</p>
        </div>
        <div className="wrap route-grid">
          {[
            ['Hotel pickup', 'Coordinated pickup from your hotel or agreed meeting point.', Car],
            ['Macao trails', 'Rural roads, mud sections and off-road driving.', Waves],
            ['Dominican ranch', 'Coffee, cacao and mamajuana tasting.', Coffee],
            ['Cenote and beach', 'Water stop and Macao Beach visit when operation allows.', MapPin],
          ].map(([title, text, Icon]) => (
            <article key={title as string}>
              {typeof Icon !== 'string' && <Icon size={24} />}
              <h3>{title as string}</h3>
              <p>{text as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section hotel-link-section">
        <div className="wrap section-head">
          <span className="kicker">Hotel pickup pages</span>
          <h2>Book from popular Punta Cana hotels.</h2>
        </div>
        <div className="wrap hotel-link-grid">
          {hotelBuggyLandings.slice(0, 12).map((hotel) => (
            <a href={hotelBuggyUrl(hotel.slug, 'en')} key={hotel.slug}>
              <span>{hotel.zone}</span>
              <b>Buggy tour from {hotel.name}</b>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
