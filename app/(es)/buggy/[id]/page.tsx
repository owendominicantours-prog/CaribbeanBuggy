import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductLanding from '../../../../components/cb/ProductLanding';
import { bring, getProduct, products, requirements, siteUrl } from '../../../../lib/buggyProducts';
import { seoGuides } from '../../../../lib/seoGuides';
import { tripadvisorSchemaReference } from '../../../../lib/tripadvisor';
import { getPuntaCanaBuggyContent } from '../../../../lib/puntaCanaBuggyContent';

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

  const isBayahibe = product.destination.toLowerCase().includes('bayahibe');
  const completeContent = getPuntaCanaBuggyContent(product, 'es');
  const localizedIncluded = isBayahibe ? bayahibeIncluded : completeContent.included;
  const localizedRequirements = isBayahibe ? requirements : completeContent.requirements;
  const localizedBring = isBayahibe ? bring : completeContent.bring;
  const localizedFaqs = isBayahibe ? bayahibeFaqs : completeContent.faqs.map(([q, a]) => [q, /precio|price/i.test(q) ? "El precio se cobra por buggy: individual US$50, doble US$60 y familiar US$120. Elige la cantidad de cada tipo para tu grupo. Cinco individuales cuestan US$250; dos dobles y un individual, US$170. Cada persona necesita asiento." : a]);
  const productGuides = seoGuides.filter((guide) => guide.destination === (isBayahibe ? 'bayahibe' : 'punta-cana') || guide.destination === 'general').slice(0, 4);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: `${product.title} en ${product.destination}`,
        description: isBayahibe ? product.longDescription : completeContent.summary,
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductLanding
        product={product}
        locale="es"
        h1={`${product.title} en ${product.destination}`}
        displayTitle={product.title}
        summary={isBayahibe ? product.longDescription : completeContent.summary}
        included={localizedIncluded}
        notIncluded={isBayahibe ? undefined : completeContent.notIncluded}
        requirements={localizedRequirements}
        bring={localizedBring}
        faqs={localizedFaqs}
        itinerary={isBayahibe ? undefined : completeContent.itinerary}
        activityDuration={isBayahibe ? undefined : completeContent.activityDuration}
        totalDuration={isBayahibe ? undefined : completeContent.totalDuration}
        routeHeading={isBayahibe ? 'Bayahibe, La Romana y caminos rurales.' : completeContent.routeHeading}
        routeBody={isBayahibe ? 'La experiencia combina aventura off-road, cultura local y paradas naturales. El orden puede variar según operación, clima y condiciones del camino.' : product.longDescription}
        routeNote={isBayahibe ? 'El equipo confirma la hora exacta de recogida por WhatsApp antes del servicio.' : completeContent.routeNote}
        routeImage={isBayahibe ? '/buggy/bayahibe/convoy-rural-bayahibe.jpg' : '/buggy/ruta-1.jpeg'}
        routeImageAlt={isBayahibe ? 'Ruta real de buggy entre cañaverales de Bayahibe' : 'Ruta de buggy en Macao'}
        guides={productGuides}
      />
    </>
  );
}
