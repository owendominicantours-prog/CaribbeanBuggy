import type { Metadata } from 'next';
import HomePage, { buildHomeSchema } from '../../components/HomePage';
import { siteUrl } from '../../lib/buggyProducts';

export const metadata: Metadata = {
  title: 'Buggy Tours in Punta Cana | Caribbean Buggy',
  description: 'Book Punta Cana buggy tours with hotel pickup, Macao trails, Dominican ranch, cenote, beach and secure payment.',
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: { en: `${siteUrl}/en`, es: siteUrl, 'x-default': siteUrl },
  },
  openGraph: {
    title: 'Buggy Tours in Punta Cana | Caribbean Buggy',
    description: 'Compare single, double and family buggy tours in Punta Cana and Bayahibe with hotel pickup.',
    url: `${siteUrl}/en`,
    images: ['/buggy/doble.jpeg'],
    locale: 'en_US',
    type: 'website',
  },
};

const schema = buildHomeSchema('en');

export default function EnglishHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HomePage locale="en" />
    </>
  );
}
