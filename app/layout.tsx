import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://caribbeanbuggy.com'),
  title: 'Buggies en Punta Cana al Mejor Precio | Caribbean Buggy Tours',
  description:
    'Reserva tours de buggies en Punta Cana. Explora Playa Macao, banate en un cenote y descubre el campo dominicano desde 40 USD. Sin intermediarios.',
  verification: {
    google: 'JLsVcMBEgvZM3eun203eBUPvswVTLFbuGzEj-4l4Puk',
  },
  keywords: [
    'buggy punta cana',
    'boogie punta cana',
    'boggie punta cana',
    'excursion buggies macao',
    'buggy tour barato',
    'renta de buggies punta cana',
    'caribbean buggy',
  ],
  openGraph: {
    title: 'Caribbean Buggy Tours | Buggy en Punta Cana desde 40 USD',
    description: 'Buggy tour con recogida, cenote, Playa Macao y precio directo de rancho.',
    type: 'website',
    locale: 'es_DO',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
