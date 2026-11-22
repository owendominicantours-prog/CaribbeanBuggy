import type { MetadataRoute } from 'next';
import { products, siteUrl } from '../lib/buggyProducts';
import { hotelBuggyLandings, hotelBuggyUrl } from '../lib/hotelBuggyLandings';
import { buggyQuestions, questionPath, questionsPath } from '../lib/buggyQuestions';
import { guideCanonical, guidesPath, seoGuides } from '../lib/seoGuides';
import { searchLandingCanonical, searchLandings, searchLandingsPath } from '../lib/searchLandings';
import { photosFor, puntaCanaPhotos } from '../lib/sitePhotos';
import { isBayahibeHotel } from '../lib/hotelBuggyLandings';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-22T00:00:00.000Z");
  // Pages rebuilt in the Caribbean Buggy redesign (22 Nov 2026): home, products, hotels, hotel directory and every guide/question/search page (new funnel block).
  const redesigned = new Date("2026-11-22T00:00:00.000Z");
  const img = (src: string) => `${siteUrl}${src}`;
  const homeImages = puntaCanaPhotos.slice(0, 10).map((p) => img(p.src));

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: redesigned,
      changeFrequency: 'weekly',
      priority: 1,
      images: homeImages,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: redesigned,
      changeFrequency: 'weekly',
      priority: 0.98,
      images: homeImages,
    },
    {
      url: `${siteUrl}/es/buggy-tour`,
      lastModified: redesigned,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en/buggy-tour`,
      lastModified: redesigned,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${siteUrl}${questionsPath('es')}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: `${siteUrl}${questionsPath('en')}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}${guidesPath('es')}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.86,
    },
    {
      url: `${siteUrl}${guidesPath('en')}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.84,
    },
    {
      url: `${siteUrl}${searchLandingsPath('es')}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${siteUrl}${searchLandingsPath('en')}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.86,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/buggy/${product.id}`,
      lastModified: redesigned,
      images: [img(product.image), ...(product.destination.includes('Bayahibe') ? [] : photosFor(product.id, 4).map((p) => img(p.src)))],
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/en/buggy/${product.id}`,
      lastModified: redesigned,
      images: [img(product.image), ...(product.destination.includes('Bayahibe') ? [] : photosFor(product.id, 4).map((p) => img(p.src)))],
      changeFrequency: 'weekly' as const,
      priority: 0.88,
    })),
    ...buggyQuestions.flatMap((question) => [
      {
        url: `${siteUrl}${questionPath(question, 'es')}`,
        lastModified: redesigned,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${siteUrl}${questionPath(question, 'en')}`,
        lastModified: redesigned,
        changeFrequency: 'monthly' as const,
        priority: 0.68,
      },
    ]),
    ...seoGuides.flatMap((guide) => [
      {
        url: guideCanonical(guide, 'es'),
        lastModified: redesigned,
        images: [img(guide.image)],
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: guideCanonical(guide, 'en'),
        lastModified: redesigned,
        images: [img(guide.image)],
        changeFrequency: 'monthly' as const,
        priority: 0.78,
      },
    ]),
    ...searchLandings.flatMap((landing) => [
      {
        url: searchLandingCanonical(landing, 'es'),
        lastModified: redesigned,
        changeFrequency: 'monthly' as const,
        priority: 0.76,
      },
      {
        url: searchLandingCanonical(landing, 'en'),
        lastModified: redesigned,
        changeFrequency: 'monthly' as const,
        priority: 0.74,
      },
    ]),
    ...hotelBuggyLandings.flatMap((hotel) => [
      {
        url: hotelBuggyUrl(hotel.slug, 'es'),
        lastModified: redesigned,
        images: isBayahibeHotel(hotel) ? undefined : photosFor(hotel.slug, 4).map((p) => img(p.src)),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      {
        url: hotelBuggyUrl(hotel.slug, 'en'),
        lastModified: redesigned,
        images: isBayahibeHotel(hotel) ? undefined : photosFor(hotel.slug, 4).map((p) => img(p.src)),
        changeFrequency: 'weekly' as const,
        priority: 0.84,
      },
    ]),
  ];
  return entries.filter((entry, index) => entries.findIndex(other => other.url === entry.url) === index);
}
