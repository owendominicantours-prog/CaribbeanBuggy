import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SearchLandingPage from '../../../../components/SearchLandingPage';
import { buildSearchLandingJsonLd } from '../../../../lib/searchLandingSchema';
import { getSearchLandingBySlug, searchLandingCanonical, searchLandings } from '../../../../lib/searchLandings';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return searchLandings.map((landing) => ({ slug: landing.en.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const landing = getSearchLandingBySlug((await params).slug, 'en');
  if (!landing) return {};
  const copy = landing.en;
  const canonical = searchLandingCanonical(landing, 'en');
  return { title: copy.metaTitle, description: copy.description, alternates: { canonical, languages: { en: canonical, es: searchLandingCanonical(landing, 'es'), 'x-default': searchLandingCanonical(landing, 'es') } }, openGraph: { title: copy.title, description: copy.description, url: canonical, siteName: 'Caribbean Buggy', type: 'article', locale: 'en_US', images: [landing.image] }, twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: [landing.image] } };
}

export default async function EnglishSearchLanding({ params }: PageProps) {
  const landing = getSearchLandingBySlug((await params).slug, 'en');
  if (!landing) notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSearchLandingJsonLd(landing, 'en')) }} /><SearchLandingPage landing={landing} locale="en" /></>;
}

