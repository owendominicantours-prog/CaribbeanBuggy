import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SearchLandingPage from '../../../components/SearchLandingPage';
import { buildSearchLandingJsonLd } from '../../../lib/searchLandingSchema';
import { getSearchLandingBySlug, searchLandingCanonical, searchLandings } from '../../../lib/searchLandings';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return searchLandings.map((landing) => ({ slug: landing.es.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const landing = getSearchLandingBySlug((await params).slug, 'es');
  if (!landing) return {};
  const copy = landing.es;
  const canonical = searchLandingCanonical(landing, 'es');
  return { title: copy.metaTitle, description: copy.description, alternates: { canonical, languages: { es: canonical, en: searchLandingCanonical(landing, 'en'), 'x-default': canonical } }, openGraph: { title: copy.title, description: copy.description, url: canonical, siteName: 'Caribbean Buggy', type: 'article', locale: 'es_DO', images: [landing.image] }, twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: [landing.image] } };
}

export default async function SpanishSearchLanding({ params }: PageProps) {
  const landing = getSearchLandingBySlug((await params).slug, 'es');
  if (!landing) notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSearchLandingJsonLd(landing, 'es')) }} /><SearchLandingPage landing={landing} locale="es" /></>;
}

