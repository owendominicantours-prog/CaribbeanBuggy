import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Caribbean Buggy Tours',
    short_name: 'Caribbean Buggy',
    description: 'Tours en buggy por Punta Cana, Macao y Bayahibe.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff9ed',
    theme_color: '#070806',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
