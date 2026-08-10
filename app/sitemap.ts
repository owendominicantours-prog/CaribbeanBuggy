import type { MetadataRoute } from 'next';
import { products, siteUrl } from '../lib/buggyProducts';
import { hotelBuggyLandings, hotelBuggyUrl } from '../lib/hotelBuggyLandings';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/buggy/${product.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
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
