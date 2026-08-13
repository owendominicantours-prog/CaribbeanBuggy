import { getProduct, siteUrl } from './buggyProducts';
import { guideCanonical, guidePath, guidesPath, seoGuides, type SeoGuide, type SeoGuideLocale } from './seoGuides';
import { tripadvisorSchemaReference } from './tripadvisor';

export function buildSeoGuideJsonLd(guide: SeoGuide, locale: SeoGuideLocale) {
  const copy = guide[locale];
  const canonical = guideCanonical(guide, locale);
  const product = getProduct(guide.productId)!;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: copy.title,
        description: copy.description,
        image: `${siteUrl}${guide.image}`,
        inLanguage: locale === 'en' ? 'en-US' : 'es-DO',
        mainEntityOfPage: canonical,
        author: { '@type': 'Organization', name: 'Caribbean Buggy', url: siteUrl },
        publisher: { '@type': 'Organization', name: 'Caribbean Buggy', url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.svg` } },
        about: [copy.eyebrow, product.destination, product.routeLabel],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Caribbean Buggy', item: locale === 'en' ? `${siteUrl}/en` : siteUrl },
          { '@type': 'ListItem', position: 2, name: locale === 'en' ? 'Buggy guides' : 'Guías de buggy', item: `${siteUrl}${guidesPath(locale)}` },
          { '@type': 'ListItem', position: 3, name: copy.title, item: canonical },
        ],
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
      {
        '@type': 'Service',
        '@id': `${canonical}#tour`,
        name: locale === 'en' ? product.title.replace('Doble', 'Double').replace('Familiar', 'Family').replace('Individual', 'Single') : product.title,
        description: product.description,
        ...(guide.destination !== 'general' ? tripadvisorSchemaReference(guide.destination, locale) : {}),
        provider: { '@type': 'Organization', name: 'Caribbean Buggy', url: siteUrl },
        areaServed: product.destination,
        offers: { '@type': 'Offer', price: product.promo, priceCurrency: 'USD', url: `${siteUrl}${locale === 'en' ? '/en' : ''}/buggy/${product.id}`, availability: 'https://schema.org/InStock' },
      },
      ...(guide.destination === 'bayahibe' ? [{
        '@type': 'VideoObject',
        '@id': `${canonical}#video`,
        name: locale === 'en' ? 'Real Bayahibe buggy tour video' : 'Video real del tour en buggy de Bayahibe',
        description: locale === 'en'
          ? 'Original footage from the Bayahibe and La Romana buggy route.'
          : 'Material original de la ruta de buggy por Bayahibe y La Romana.',
        thumbnailUrl: [`${siteUrl}/buggy/bayahibe/buggy-lodo-bayahibe.jpg`],
        contentUrl: `${siteUrl}/buggy/bayahibe/tour-buggy-bayahibe.mp4`,
        uploadDate: '2026-08-13T12:00:00-04:00',
        duration: 'PT47S',
      }] : []),
    ],
  };
}

export function buildSeoGuidesDirectoryJsonLd(locale: SeoGuideLocale) {
  const canonical = `${siteUrl}${guidesPath(locale)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': canonical,
    name: locale === 'en' ? 'Punta Cana and Bayahibe buggy guides' : 'Guías de buggy en Punta Cana y Bayahibe',
    url: canonical,
    inLanguage: locale === 'en' ? 'en-US' : 'es-DO',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: seoGuides.length,
      itemListElement: seoGuides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide[locale].title,
        url: `${siteUrl}${guidePath(guide, locale)}`,
      })),
    },
  };
}
