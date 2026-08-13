import type { Metadata } from 'next';
import SeoGuidesDirectoryPage from '../../components/SeoGuidesDirectoryPage';
import { buildSeoGuidesDirectoryJsonLd } from '../../lib/seoGuideSchema';
import { guidesPath } from '../../lib/seoGuides';
import { siteUrl } from '../../lib/buggyProducts';

const canonical = `${siteUrl}${guidesPath('es')}`;

export const metadata: Metadata = {
  title: 'Guías de Buggy en Punta Cana y Bayahibe | Caribbean Buggy',
  description: 'Guías completas para comparar rutas, precios, vehículos, recogida, seguridad y reservar buggy en Punta Cana o Bayahibe.',
  alternates: { canonical, languages: { es: canonical, en: `${siteUrl}${guidesPath('en')}`, 'x-default': canonical } },
  openGraph: { title: 'Guías de buggy en Punta Cana y Bayahibe', description: 'Todo lo necesario para elegir y reservar un buggy.', url: canonical, siteName: 'Caribbean Buggy', type: 'website', locale: 'es_DO', images: ['/buggy/doble.jpeg'] },
};

export default function SpanishGuidesPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoGuidesDirectoryJsonLd('es')) }} /><SeoGuidesDirectoryPage locale="es" /></>;
}
