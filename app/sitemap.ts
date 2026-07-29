import type { MetadataRoute } from 'next';
import { products, siteUrl } from '../lib/buggyProducts';

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
  ];
}
