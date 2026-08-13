import { getProduct, siteUrl } from './buggyProducts';
import { searchLandingCanonical, searchLandingPath, searchLandingsPath, type SearchLanding, type SearchLandingLocale } from './searchLandings';
import { tripadvisorSchemaReference } from './tripadvisor';

export function buildSearchLandingJsonLd(landing: SearchLanding, locale: SearchLandingLocale) {
  const copy = landing[locale];
  const canonical = searchLandingCanonical(landing, locale);
  const product = getProduct(landing.productId)!;
  const destination = landing.destination === 'bayahibe' ? 'bayahibe' : 'punta-cana';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: copy.title,
        description: copy.description,
        inLanguage: locale === 'en' ? 'en-US' : 'es-DO',
        primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}${landing.image}` },
        about: { '@id': `${canonical}#service` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Caribbean Buggy', item: locale === 'en' ? `${siteUrl}/en` : siteUrl },
          { '@type': 'ListItem', position: 2, name: locale === 'en' ? 'Buggy excursions' : 'Excursiones en buggy', item: `${siteUrl}${searchLandingsPath(locale)}` },
          { '@type': 'ListItem', position: 3, name: copy.title, item: canonical },
        ],
      },
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: copy.title,
        description: copy.answer,
        provider: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Caribbean Buggy', url: siteUrl },
        areaServed: landing.destination === 'bayahibe' ? 'Bayahibe and La Romana, Dominican Republic' : 'Punta Cana, Dominican Republic',
        ...tripadvisorSchemaReference(destination, locale),
        offers: {
          '@type': 'Offer',
          price: product.promo,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}${locale === 'en' ? '/en' : ''}/buggy/${product.id}`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: copy.faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      ...(landing.destination === 'bayahibe' ? [{
        '@type': 'VideoObject',
        '@id': `${canonical}#video`,
        name: locale === 'en' ? 'Real Bayahibe buggy tour video' : 'Video real del buggy de Bayahibe',
        description: locale === 'en' ? 'Original footage from the Bayahibe buggy route.' : 'Material original de la ruta de buggy de Bayahibe.',
        thumbnailUrl: [`${siteUrl}/buggy/bayahibe/buggy-lodo-bayahibe.jpg`],
        contentUrl: `${siteUrl}/buggy/bayahibe/tour-buggy-bayahibe.mp4`,
        uploadDate: '2026-08-13T12:00:00-04:00',
        duration: 'PT47S',
      }] : []),
    ],
  };
}

export function buildSearchLandingsDirectoryJsonLd(locale: SearchLandingLocale, landings: SearchLanding[]) {
  const canonical = `${siteUrl}${searchLandingsPath(locale)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': canonical,
    name: locale === 'en' ? 'Punta Cana and Bayahibe buggy excursion searches' : 'Búsquedas de excursiones en buggy de Punta Cana y Bayahibe',
    url: canonical,
    inLanguage: locale === 'en' ? 'en-US' : 'es-DO',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: landings.length,
      itemListElement: landings.map((landing, index) => ({ '@type': 'ListItem', position: index + 1, name: landing[locale].title, url: `${siteUrl}${searchLandingPath(landing, locale)}` })),
    },
  };
}
