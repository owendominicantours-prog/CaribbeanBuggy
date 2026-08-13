import type { MetadataRoute } from 'next';
import { products, siteUrl } from '../lib/buggyProducts';
import { hotelBuggyLandings, hotelBuggyUrl } from '../lib/hotelBuggyLandings';
import { buggyQuestions, questionPath, questionsPath } from '../lib/buggyQuestions';
import { guideCanonical, guidesPath, seoGuides } from '../lib/seoGuides';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/en`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.98,
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
    ...products.map((product) => ({
      url: `${siteUrl}/buggy/${product.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/en/buggy/${product.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.88,
    })),
    ...buggyQuestions.flatMap((question) => [
      {
        url: `${siteUrl}${questionPath(question, 'es')}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${siteUrl}${questionPath(question, 'en')}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.68,
      },
    ]),
    ...seoGuides.flatMap((guide) => [
      {
        url: guideCanonical(guide, 'es'),
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: guideCanonical(guide, 'en'),
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.78,
      },
    ]),
    ...hotelBuggyLandings.flatMap((hotel) => [
      {
        url: hotelBuggyUrl(hotel.slug, 'es'),
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      {
        url: hotelBuggyUrl(hotel.slug, 'en'),
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.84,
      },
    ]),
  ];
}
