import { faqs, products, siteUrl, type BuggyProduct } from './buggyProducts';
import { hotelBuggyUrl, type HotelBuggyLanding } from './hotelBuggyLandings';

export type HotelBuggyLocale = 'es' | 'en';

type LocalFaq = {
  question: string;
  answer: string;
};

const enFaqs: LocalFaq[] = [
  {
    question: 'Is hotel pickup included?',
    answer:
      'Yes. Pickup is coordinated from the authorized tours area at the hotel or the closest confirmed meeting point.',
  },
  {
    question: 'How long does the buggy tour take?',
    answer:
      'The full experience usually takes about 4 hours including coordinated transport, the off-road route, a cenote stop and Macao Beach when operated.',
  },
  {
    question: 'Can I book from this hotel today?',
    answer:
      'Yes when there is availability. Choose your buggy option and confirm pickup details before payment.',
  },
  {
    question: 'Do I need a driver license?',
    answer:
      'Drivers must know how to drive and follow local guide safety instructions. Passengers do not need to drive.',
  },
];

const productNameEn: Record<string, string> = {
  'buggy-individual': 'Individual buggy in Punta Cana',
  'buggy-doble': 'Double buggy in Punta Cana',
  'buggy-familiar': 'Family buggy in Punta Cana',
  'bayahibe-buggy-individual': 'Individual buggy in Bayahibe and La Romana',
  'bayahibe-buggy-doble': 'Double buggy in Bayahibe and La Romana',
  'bayahibe-buggy-familiar': 'Family buggy in Bayahibe and La Romana',
};

export function getHotelBuggyProducts(hotel: HotelBuggyLanding) {
  const isBayahibe = /bayahibe|romana/i.test(`${hotel.name} ${hotel.zone}`);
  const scopedProducts = products.filter((product) =>
    isBayahibe ? product.id.startsWith('bayahibe-') : !product.id.startsWith('bayahibe-'),
  );

  return scopedProducts.length ? scopedProducts : products;
}

function productName(product: BuggyProduct, locale: HotelBuggyLocale) {
  return locale === 'en' ? productNameEn[product.id] ?? product.title : product.title;
}

function productDescription(product: BuggyProduct, hotel: HotelBuggyLanding, locale: HotelBuggyLocale) {
  if (locale === 'en') {
    return `${productName(product, locale)} with coordinated pickup from ${hotel.name}, local guide, off-road route, cenote stop and Macao Beach when operated.`;
  }

  return `${product.title} con recogida coordinada desde ${hotel.name}, guia local, ruta off-road, parada en cenote y Playa Macao segun operacion.`;
}

function productUrl(product: BuggyProduct, locale: HotelBuggyLocale) {
  return `${siteUrl}${locale === 'en' ? '/en' : ''}/buggy/${product.id}`;
}

export function getHotelBuggySeoCopy(hotel: HotelBuggyLanding, locale: HotelBuggyLocale) {
  const scopedProducts = getHotelBuggyProducts(hotel);
  const lowPrice = Math.min(...scopedProducts.map((product) => product.promo));

  if (locale === 'en') {
    return {
      title: `Buggy tour from ${hotel.name} | From US$${lowPrice}`,
      description: `Book a buggy tour from ${hotel.name}. Hotel pickup in ${hotel.zone}, Macao off-road route, cenote stop, beach time and secure online payment.`,
    };
  }

  return {
    title: `Buggy tour desde ${hotel.name} | Desde US$${lowPrice}`,
    description: `Reserva buggy tour desde ${hotel.name}. Recogida en ${hotel.zone}, ruta off-road en Macao, cenote, playa y pago seguro online.`,
  };
}

export function getHotelBuggyFaqs(locale: HotelBuggyLocale) {
  if (locale === 'en') return enFaqs;

  return faqs.map(([question, answer]) => ({ question, answer }));
}

export function buildHotelBuggyJsonLd(hotel: HotelBuggyLanding, locale: HotelBuggyLocale) {
  const canonical = hotelBuggyUrl(hotel.slug, locale);
  const scopedProducts = getHotelBuggyProducts(hotel);
  const lowPrice = Math.min(...scopedProducts.map((product) => product.promo));
  const highPrice = Math.max(...scopedProducts.map((product) => product.promo));
  const localizedFaqs = getHotelBuggyFaqs(locale);
  const routeName = locale === 'en' ? `Buggy tour from ${hotel.name}` : `Buggy tour desde ${hotel.name}`;
  const routeDescription =
    locale === 'en'
      ? `Buggy tour with coordinated pickup from ${hotel.name}, Macao off-road route, Dominican ranch, cenote stop and Macao Beach.`
      : `Buggy tour con recogida coordinada desde ${hotel.name}, ruta off-road en Macao, rancho dominicano, cenote y Playa Macao.`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#business`,
        name: 'Caribbean Buggy',
        url: siteUrl,
        telephone: '+1-829-475-6298',
        areaServed: { '@type': 'Country', name: 'Dominican Republic' },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'en' ? 'Home' : 'Inicio',
            item: locale === 'en' ? `${siteUrl}/en` : siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Buggy tours',
            item: canonical,
          },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: routeName,
        url: canonical,
        description: routeDescription,
        provider: { '@id': `${siteUrl}/#business` },
        serviceType: 'Buggy tour with hotel pickup',
        areaServed: { '@type': 'Place', name: hotel.zone },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: canonical,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice,
          highPrice,
          offerCount: scopedProducts.length,
          availability: 'https://schema.org/InStock',
          url: canonical,
          seller: { '@id': `${siteUrl}/#business` },
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#buggy-options`,
        name: locale === 'en' ? `Buggy options from ${hotel.name}` : `Opciones de buggy desde ${hotel.name}`,
        itemListElement: scopedProducts.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            '@id': `${canonical}#${product.id}`,
            name: productName(product, locale),
            image: `${siteUrl}${product.image}`,
            description: productDescription(product, hotel, locale),
            brand: { '@type': 'Brand', name: 'Caribbean Buggy' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: product.promo,
              availability: 'https://schema.org/InStock',
              url: productUrl(product, locale),
              seller: { '@id': `${siteUrl}/#business` },
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: localizedFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}
