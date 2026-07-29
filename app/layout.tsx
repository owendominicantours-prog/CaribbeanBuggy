import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { siteUrl } from '../lib/buggyProducts';

const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Buggies en Punta Cana al Mejor Precio | Caribbean Buggy Tours',
  description:
    'Reserva tours de buggies en Punta Cana. Explora Playa Macao, banate en un cenote y descubre el campo dominicano desde 40 USD. Sin intermediarios.',
  alternates: {
    canonical: '/',
  },
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
    url: siteUrl,
    siteName: 'Caribbean Buggy',
    images: [
      {
        url: '/buggy/doble.jpeg',
        width: 1200,
        height: 630,
        alt: 'Tour de buggy en Punta Cana',
      },
    ],
    type: 'website',
    locale: 'es_DO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caribbean Buggy Tours | Buggy en Punta Cana desde 40 USD',
    description: 'Buggy tour con recogida, cenote y Playa Macao.',
    images: ['/buggy/doble.jpeg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        {analyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsId}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
