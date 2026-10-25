import type { Metadata } from 'next';
import SearchLandingsDirectoryPage from '../../../components/SearchLandingsDirectoryPage';
import { buildSearchLandingsDirectoryJsonLd } from '../../../lib/searchLandingSchema';
import { searchLandings, searchLandingsPath } from '../../../lib/searchLandings';
import { siteUrl } from '../../../lib/buggyProducts';

const canonical = `${siteUrl}${searchLandingsPath('en')}`;
export const metadata: Metadata = {
  title: 'Punta Cana & Bayahibe Buggy Tours: Routes, Prices & Pickup',
  description: 'Compare Punta Cana and Bayahibe buggy routes, vehicle prices and hotel pickup. Find answers about preparation and choose the tour for your group.',
  alternates: { canonical, languages: { en: canonical, es: `${siteUrl}${searchLandingsPath('es')}`, 'x-default': `${siteUrl}${searchLandingsPath('es')}` } },
  openGraph: { title: 'Buggy excursion search directory', description: 'Find the exact answer and book an actual buggy tour.', url: canonical, siteName: 'Caribbean Buggy', type: 'website', locale: 'en_US', images: ['/buggy/doble.jpeg'] },
};

export default function EnglishExcursionsDirectory() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSearchLandingsDirectoryJsonLd('en', searchLandings)) }} /><SearchLandingsDirectoryPage locale="en" /></>;
}

