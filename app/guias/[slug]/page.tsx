import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SeoGuideLandingPage from '../../../components/SeoGuideLandingPage';
import { buildSeoGuideJsonLd } from '../../../lib/seoGuideSchema';
import { getSeoGuideBySlug, guideCanonical, seoGuides } from '../../../lib/seoGuides';

type PageProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return seoGuides.map((guide) => ({ slug: guide.es.slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getSeoGuideBySlug((await params).slug, 'es');
  if (!guide) return {};
  const copy = guide.es;
  const canonical = guideCanonical(guide, 'es');
  return { title: copy.metaTitle, description: copy.description, alternates: { canonical, languages: { es: canonical, en: guideCanonical(guide, 'en'), 'x-default': canonical } }, openGraph: { title: copy.title, description: copy.description, url: canonical, siteName: 'Caribbean Buggy', type: 'article', locale: 'es_DO', images: [guide.image] }, twitter: { card: 'summary_large_image', title: copy.title, description: copy.description, images: [guide.image] } };
}

export default async function SpanishGuideLanding({ params }: PageProps) {
  const guide = getSeoGuideBySlug((await params).slug, 'es');
  if (!guide) notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSeoGuideJsonLd(guide, 'es')) }} /><SeoGuideLandingPage guide={guide} locale="es" /></>;
}
