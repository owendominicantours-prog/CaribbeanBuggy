import type { Metadata } from 'next';
import SearchLandingsDirectoryPage from '../../../components/SearchLandingsDirectoryPage';
import { buildSearchLandingsDirectoryJsonLd } from '../../../lib/searchLandingSchema';
import { searchLandings, searchLandingsPath } from '../../../lib/searchLandings';
import { siteUrl } from '../../../lib/buggyProducts';

const canonical = `${siteUrl}${searchLandingsPath('en')}`;
export const metadata: Metadata = {
  title: 'Punta Cana and Bayahibe Buggy Excursions | 304 Searches',
  description: 'Directory of 304 commercial searches about buggy tours, ATV, prices, routes, pickup and booking in Punta Cana, Bayahibe and La Romana.',
  alternates: { canonical, languages: { en: canonical, es: `${siteUrl}${searchLandingsPath('es')}`, 'x-default': `${siteUrl}${searchLandingsPath('es')}` } },
  openGraph: { title: 'Buggy excursion search directory', description: 'Find the exact answer and book an actual buggy tour.', url: canonical, siteName: 'Caribbean Buggy', type: 'website', locale: 'en_US', images: ['/buggy/doble.jpeg'] },
};

export default function EnglishExcursionsDirectory() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSearchLandingsDirectoryJsonLd('en', searchLandings)) }} /><SearchLandingsDirectoryPage locale="en" /></>;
}

