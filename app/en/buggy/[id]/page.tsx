import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductLanding from '../../../../components/cb/ProductLanding';
import { getProduct, products, siteUrl } from '../../../../lib/buggyProducts';
import { seoGuides } from '../../../../lib/seoGuides';
import { tripadvisorSchemaReference } from '../../../../lib/tripadvisor';
import { getPuntaCanaBuggyContent } from '../../../../lib/puntaCanaBuggyContent';

type DetailPageProps = {
  params: Promise<{ id: string }>;
};


const bayahibeIncluded = [
  'Round-trip transport from the hotel or confirmed meeting point',
  'Buggy according to the selected option',
  'Helmet and safety briefing',
  'Local guide throughout the route',
  'Sugar-cane roads, rural communities and mud trails',
  'Chavón River stop according to operations',
  'Tour support throughout the experience',
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


const bayahibeFaqs = [
  ['Is the price per person or per vehicle?', 'The published price is per vehicle according to the selected option.'],
  ['Is pickup available from Bayahibe and La Romana hotels?', 'Yes. The authorized pickup or meeting point is confirmed by WhatsApp according to the hotel and daily operations.'],
  ['What does the Bayahibe route visit?', 'The route covers sugar-cane roads, rural communities, puddles and mud trails, with a Chavón River stop according to operations.'],
  ['Are the photos and video real?', 'Yes. The media shown comes from the actual Bayahibe and La Romana buggy operation.'],
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
  return 'A Punta Cana buggy adventure with pickup in covered areas, muddy Macao trails, Dominican ranch, cenote stop and Macao Beach in one organized tour.';
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
  const isBayahibe = product.destination.toLowerCase().includes('bayahibe');
  const completeContent = getPuntaCanaBuggyContent(product, 'en');
  const localizedIncluded = isBayahibe ? bayahibeIncluded : completeContent.included;
  const localizedRequirements = isBayahibe ? requirements : completeContent.requirements;
  const localizedBring = isBayahibe ? bring : completeContent.bring;
  const localizedFaqs = isBayahibe ? bayahibeFaqs : completeContent.faqs.map(([q, a]) => [q, /precio|price/i.test(q) ? "Prices are per buggy: single US$50, double US$60 and family US$120. Choose how many of each type your group wants. Five singles cost US$250; two doubles and one single cost US$170. Every traveler needs a seat." : a]);
  const productGuides = seoGuides.filter((guide) => guide.destination === (isBayahibe ? 'bayahibe' : 'punta-cana') || guide.destination === 'general').slice(0, 4);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${title} in ${product.destination}`,
        description: isBayahibe ? englishDescription(product.destination) : completeContent.summary,
        image: `${siteUrl}${product.image}`,
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Caribbean Buggy' },
        ...tripadvisorSchemaReference(isBayahibe ? 'bayahibe' : 'punta-cana', 'en'),
        areaServed: `${product.destination}, Dominican Republic`,
        offers: {
          '@type': 'Offer',
          price: product.promo,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/en/buggy/${product.id}`,
        },
      },
      ...(isBayahibe ? [{
        '@type': 'VideoObject',
        name: 'Real Bayahibe and La Romana buggy tour video',
        description: 'Original footage of the Bayahibe buggy route with red buggies, sugar-cane roads, rural trails and mud.',
        thumbnailUrl: [`${siteUrl}/buggy/bayahibe/buggy-lodo-bayahibe.jpg`],
        contentUrl: `${siteUrl}/buggy/bayahibe/tour-buggy-bayahibe.mp4`,
        uploadDate: '2026-08-13T12:00:00-04:00',
        duration: 'PT47S',
      }] : []),
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
        mainEntity: localizedFaqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductLanding
        product={product}
        locale="en"
        h1={`${title} in ${product.destination}`}
        displayTitle={title}
        summary={isBayahibe ? englishDescription(product.destination) : completeContent.summary}
        included={localizedIncluded}
        notIncluded={isBayahibe ? undefined : completeContent.notIncluded}
        requirements={localizedRequirements}
        bring={localizedBring}
        faqs={localizedFaqs}
        itinerary={isBayahibe ? undefined : completeContent.itinerary}
        activityDuration={isBayahibe ? undefined : completeContent.activityDuration}
        totalDuration={isBayahibe ? undefined : completeContent.totalDuration}
        routeHeading={isBayahibe ? 'Bayahibe, La Romana and rural roads.' : completeContent.routeHeading}
        routeBody={isBayahibe ? 'The experience combines off-road driving, local culture and natural stops. The exact order may change depending on operation, weather and road conditions.' : englishDescription(product.destination)}
        routeNote={isBayahibe ? 'The team confirms the exact pickup time by WhatsApp before the service.' : completeContent.routeNote}
        routeImage={isBayahibe ? '/buggy/bayahibe/convoy-rural-bayahibe.jpg' : '/buggy/ruta-1.jpeg'}
        routeImageAlt={isBayahibe ? 'Real buggy route through Bayahibe sugar cane fields' : 'Buggy route in Macao'}
        guides={productGuides}
      />
    </>
  );
}
