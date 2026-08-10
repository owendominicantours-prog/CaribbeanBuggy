import { notFound } from 'next/navigation';
import HotelBuggyTourPage from '../../../../../components/HotelBuggyTourPage';
import { products, siteUrl } from '../../../../../lib/buggyProducts';
import {
  getHotelBuggyLanding,
  hotelBuggyLandings,
  hotelBuggyUrl,
} from '../../../../../lib/hotelBuggyLandings';

type HotelBuggyPageProps = {
  params: Promise<{ slug: string }>;
};

const enFaqs = [
  ['Is pickup available from this hotel?', 'Yes. We coordinate pickup from the hotel lobby or the authorized tour pickup point confirmed by the property.'],
  ['Is the buggy tour private?', 'The route is shared unless you request a private pickup or private arrangement before booking.'],
  ['Can I pay by card?', 'Yes. Secure card and PayPal payment are available before final confirmation.'],
  ['What should I bring?', 'Bring old clothes, swimsuit, towel, sunscreen and optional cash for photos or drinks.'],
];

export function generateStaticParams() {
  return hotelBuggyLandings.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({ params }: HotelBuggyPageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) return {};

  const title = `Buggy tour from ${hotel.name} | Caribbean Buggy`;
  const description = `Book a Punta Cana buggy tour from ${hotel.name}. Coordinated pickup in ${hotel.zone}, Macao off-road route, cenote, beach and secure payment.`;
  const canonical = hotelBuggyUrl(hotel.slug, 'en');

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        es: hotelBuggyUrl(hotel.slug, 'es'),
        'x-default': hotelBuggyUrl(hotel.slug, 'es'),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [`${siteUrl}/buggy/doble.jpeg`],
    },
  };
}

export default async function EnglishHotelBuggyPage({ params }: HotelBuggyPageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) notFound();

  const canonical = hotelBuggyUrl(hotel.slug, 'en');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Caribbean Buggy', item: `${siteUrl}/en` },
          { '@type': 'ListItem', position: 2, name: 'Buggy tours', item: `${siteUrl}/en#prices` },
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
        description: `Buggy tour with pickup from ${hotel.name}, Macao off-road route, cenote stop, Dominican ranch and Macao Beach visit.`,
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
        mainEntity: enFaqs.map(([question, answer]) => ({
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
      <HotelBuggyTourPage hotel={hotel} canonical={canonical} locale="en" />
    </>
  );
}
