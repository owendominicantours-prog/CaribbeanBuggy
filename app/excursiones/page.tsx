import type { Metadata } from 'next';
import SearchLandingsDirectoryPage from '../../components/SearchLandingsDirectoryPage';
import { buildSearchLandingsDirectoryJsonLd } from '../../lib/searchLandingSchema';
import { searchLandings, searchLandingsPath } from '../../lib/searchLandings';
import { siteUrl } from '../../lib/buggyProducts';

const canonical = `${siteUrl}${searchLandingsPath('es')}`;
export const metadata: Metadata = {
  title: 'Excursiones Buggy Punta Cana y Bayahibe | 304 Búsquedas',
  description: 'Directorio de 304 búsquedas comerciales sobre buggy, ATV, precios, rutas, recogida y reserva en Punta Cana, Bayahibe y La Romana.',
  alternates: { canonical, languages: { es: canonical, en: `${siteUrl}${searchLandingsPath('en')}`, 'x-default': canonical } },
  openGraph: { title: 'Directorio de excursiones en buggy', description: 'Encuentra la respuesta exacta y reserva un buggy real.', url: canonical, siteName: 'Caribbean Buggy', type: 'website', locale: 'es_DO', images: ['/buggy/doble.jpeg'] },
};

export default function ExcursionsDirectory() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSearchLandingsDirectoryJsonLd('es', searchLandings)) }} /><SearchLandingsDirectoryPage locale="es" /></>;
}

