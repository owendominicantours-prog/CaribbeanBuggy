import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BadgeDollarSign, CalendarCheck2, CheckCircle2, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react';
import BookingCalculator from '../../../../components/BookingCalculator';
import LanguageSwitch from '../../../../components/LanguageSwitch';
import { getProduct, products, proactivitisPhone, siteUrl } from '../../../../lib/buggyProducts';
import { guidePath, seoGuides } from '../../../../lib/seoGuides';

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

const included = [
  'Round-trip hotel pickup',
  'Buggy according to selected option',
  'Helmet and safety briefing',
  'Multilingual local guide',
  'Coffee, cacao and mamajuana tasting',
  'Cenote stop',
  'Macao Beach visit',
  'Route support during the tour',
];

const requirements = [
  'Driver must be 18+ and able to drive.',
  'Minimum age for accompanying children: 3 years.',
  'Not recommended for pregnant travelers or people with severe back problems.',
];

const bring = [
  'Old clothes that can get muddy.',
  'Swimsuit and towel.',
  'Biodegradable sunscreen and sunglasses.',
  'Optional cash for photos, drinks or souvenirs.',
];

const faqs = [
  ['Is the price per person or per vehicle?', 'The listed price is per vehicle depending on the option: single, double or family buggy.'],
  ['Is hotel pickup included?', 'Yes, pickup and return are included from main Bavaro and Punta Cana hotel zones.'],
  ['Do we visit Macao Beach?', 'Yes, the route normally includes Macao Beach and a cenote stop, subject to daily operations.'],
  ['Will I get muddy?', 'Yes. This is an off-road buggy experience with mud, rural roads and water stops. Old clothes are recommended.'],
];

function englishTitle(title: string) {
  return title
    .replace('Bayahibe Buggy Individual', 'Bayahibe Single Buggy')
    .replace('Bayahibe Buggy Doble', 'Bayahibe Double Buggy')
    .replace('Bayahibe Buggy Familiar', 'Bayahibe Family Buggy')
    .replace('Buggy Individual', 'Single Buggy')
    .replace('Buggy Doble', 'Double Buggy')
    .replace('Buggy Familiar', 'Family Buggy');
}

function englishDescription(destination: string) {
  if (destination.includes('Bayahibe')) {
    return 'A Bayahibe and La Romana off-road buggy route with coordinated pickup, rural trails, local assistance and WhatsApp confirmation before departure.';
  }
  return 'A Punta Cana buggy adventure with hotel pickup, muddy Macao trails, Dominican ranch, cenote stop and Macao Beach in one organized tour.';
}

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  const title = `${englishTitle(product.title)} in ${product.destination} | Caribbean Buggy`;
  const description = `${englishDescription(product.destination)} From US$${product.promo} per vehicle with secure payment.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/en/buggy/${product.id}`,
      languages: {
        en: `${siteUrl}/en/buggy/${product.id}`,
        es: `${siteUrl}/buggy/${product.id}`,
        'x-default': `${siteUrl}/buggy/${product.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/en/buggy/${product.id}`,
      siteName: 'Caribbean Buggy',
      images: [product.image],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function EnglishBuggyDetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const title = englishTitle(product.title);
  const related = products.filter((item) => item.id !== product.id);
  const isBayahibe = product.destination.toLowerCase().includes('bayahibe');
  const productGuides = seoGuides.filter((guide) => guide.destination === (isBayahibe ? 'bayahibe' : 'punta-cana') || guide.destination === 'general').slice(0, 4);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${title} in ${product.destination}`,
        description: englishDescription(product.destination),
        image: `${siteUrl}${product.image}`,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Caribbean Buggy' },
        areaServed: `${product.destination}, Dominican Republic`,
        offers: {
          '@type': 'Offer',
          price: product.promo,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/en/buggy/${product.id}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/en` },
          { '@type': 'ListItem', position: 2, name: 'Punta Cana buggies', item: `${siteUrl}/en#prices` },
          { '@type': 'ListItem', position: 3, name: title, item: `${siteUrl}/en/buggy/${product.id}` },
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
        <a className="brand" href="/en" aria-label="Caribbean Buggy">
          <span>Caribbean</span>
          <b>Buggy</b>
        </a>
        <nav aria-label="Detail">
          <a href="/en#prices">Prices</a>
          <a href="#book">Book</a>
          <a href="#included">Included</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch current="en" esHref={`/buggy/${product.id}`} enHref={`/en/buggy/${product.id}`} />
          <a className="header-cta" href="#book">Book now</a>
        </div>
      </header>

      <section className="detail-hero">
        <div className="wrap detail-hero-grid">
          <div>
            <a className="back-link" href="/en"><ArrowLeft size={17} /> Back to all buggies</a>
            <span className="eyebrow"><MapPin size={16} /> {product.destination}</span>
            <h1>{title} in {product.destination}</h1>
            <p>{englishDescription(product.destination)}</p>
            <div className="detail-badges">
              <span><Users size={17} /> {product.capacityLabel}</span>
              <span><Clock3 size={17} /> {product.durationLabel}</span>
              <span><BadgeDollarSign size={17} /> From US${product.promo}</span>
            </div>
          </div>
          <Image src={product.image} alt={`${title} in ${product.destination}`} width={1200} height={795} priority sizes="(max-width: 980px) 100vw, 46vw" />
        </div>
      </section>

      <section id="book" className="section detail-booking-section">
        <div className="wrap detail-booking-grid">
          <BookingCalculator product={product} locale="en" />
          <div className="detail-copy">
            <span className="kicker">Complete booking details</span>
            <h2>Calculate your total and request your spot.</h2>
            <p>
              The booking tool calculates the vehicles needed for your group and pickup zone, then prepares a
              complete reservation request so the team can confirm availability quickly.
            </p>
            <div className="logic-grid">
              <article><b>1</b><span>Select date, hotel, pickup zone and travelers.</span></article>
              <article><b>2</b><span>Choose deposit, full payment or confirm first.</span></article>
              <article><b>3</b><span>Receive confirmation and secure payment instructions.</span></article>
            </div>
          </div>
        </div>
      </section>

      <section id="included" className="section">
        <div className="wrap detail-info-grid">
          <article className="info-card">
            <span className="kicker">Included</span>
            <h2>What you get with {title}.</h2>
            <div className="check-grid">
              {included.map((item) => <span key={item}><CheckCircle2 size={17} /> {item}</span>)}
            </div>
          </article>
          <article className="info-card dark">
            <span className="kicker">Safety</span>
            <h2>Before driving.</h2>
            <ul>{requirements.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="info-card bring">
            <span className="kicker">What to bring</span>
            <h2>Get ready for mud.</h2>
            <ul>{bring.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="detail-route">
        <div className="wrap detail-route-grid">
          <Image src="/buggy/ruta-1.jpeg" alt="Buggy route in Macao" width={1000} height={663} sizes="(max-width: 980px) 100vw, 46vw" />
          <div>
            <span className="kicker">Tour route</span>
            <h2>{isBayahibe ? 'Bayahibe, La Romana and rural roads.' : 'Macao, cenote and Dominican ranch.'}</h2>
            <p>
              The experience combines off-road driving, local culture and natural stops. The exact order may change
              depending on operation, weather and road conditions.
            </p>
            <div className="route-note">
              <ShieldCheck />
              <span>The team confirms the exact pickup time by WhatsApp before the service.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section faq-section">
        <div className="wrap section-head">
          <span className="kicker">FAQ</span>
          <h2>Common questions about {title}.</h2>
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
        <div className="wrap section-head"><span className="kicker">Booking guides</span><h2>Understand the route before paying.</h2></div>
        <div className="wrap seo-guide-related-grid">{productGuides.map((guide) => <a href={guidePath(guide, 'en')} key={guide.id}><span>{guide.en.eyebrow}</span><b>{guide.en.title}</b><ArrowRight size={17} /></a>)}</div>
      </section>

      <section className="section related-section">
        <div className="wrap section-head">
          <span className="kicker">More options</span>
          <h2>You can also book.</h2>
        </div>
        <div className="wrap related-grid">
          {related.map((item) => (
            <a href={`/en/buggy/${item.id}`} key={item.id}>
              <Image src={item.image} alt={englishTitle(item.title)} width={600} height={398} sizes="(max-width: 680px) 100vw, 33vw" />
              <span>{item.subtitle}</span>
              <b>{englishTitle(item.title)}</b>
              <strong>US${item.promo}</strong>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <a className="brand footer-brand" href="/en"><span>Caribbean</span><b>Buggy</b></a>
            <p>Reservations operated and confirmed by WhatsApp with Proactivitis: {proactivitisPhone}.</p>
          </div>
          <div>
            <h3>Products</h3>
            {products.map((item) => <a href={`/en/buggy/${item.id}`} key={item.id}>{englishTitle(item.title)}</a>)}
          </div>
          <div>
            <h3>Booking</h3>
            <a href="#book">Calculator</a>
            <a href="/en#prices">See prices</a>
            <a href="/en/guides">Buggy guides</a>
          </div>
        </div>
      </footer>

      <a className="detail-floating-cta" href="#book">
        <CalendarCheck2 size={19} /> Book from US${product.promo}
      </a>
    </main>
  );
}
