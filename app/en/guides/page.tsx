import type { Metadata } from 'next';
import SeoGuidesDirectoryPage from '../../../components/SeoGuidesDirectoryPage';
import { buildSeoGuidesDirectoryJsonLd } from '../../../lib/seoGuideSchema';
import { guidesPath } from '../../../lib/seoGuides';
import { siteUrl } from '../../../lib/buggyProducts';

const canonical = `${siteUrl}${guidesPath('en')}`;

export const metadata: Metadata = {
  title: 'Punta Cana and Bayahibe Buggy Guides | Caribbean Buggy',
  description: 'Complete guides to compare routes, prices, vehicles, pickup and safety before booking a Punta Cana or Bayahibe buggy.',
  alternates: { canonical, languages: { en: canonical, es: `${siteUrl}${guidesPath('es')}`, 'x-default': `${siteUrl}${guidesPath('es')}` } },
  openGraph: { title: 'Punta Cana and Bayahibe buggy guides', description: 'Everything needed to choose and book a buggy.', url: canonical, siteName: 'Caribbean Buggy', type: 'website', locale: 'en_US', images: ['/buggy/doble.jpeg'] },
};

export default function EnglishGuidesPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoGuidesDirectoryJsonLd('en')) }} /><SeoGuidesDirectoryPage locale="en" /></>;
}
