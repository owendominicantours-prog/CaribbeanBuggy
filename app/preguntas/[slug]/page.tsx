import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QuestionLandingPage from '../../../components/QuestionLandingPage';
import { buggyQuestions, getQuestionBySlug } from '../../../lib/buggyQuestions';
import { buildQuestionJsonLd, questionCanonical } from '../../../lib/questionSeo';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return buggyQuestions.map((question) => ({ slug: question.es.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug, 'es');
  if (!question) return {};
  const canonical = questionCanonical(question, 'es');

  return {
    title: `${question.es.question} | Caribbean Buggy`,
    description: question.es.answer,
    alternates: {
      canonical,
      languages: {
        es: canonical,
        en: questionCanonical(question, 'en'),
        'x-default': canonical,
      },
    },
    openGraph: {
      title: question.es.question,
      description: question.es.answer,
      url: canonical,
      siteName: 'Caribbean Buggy',
      images: ['/buggy/doble.jpeg'],
      locale: 'es_DO',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: question.es.question,
      description: question.es.answer,
      images: ['/buggy/doble.jpeg'],
    },
  };
}

export default async function SpanishQuestionLanding({ params }: PageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug, 'es');
  if (!question) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildQuestionJsonLd(question, 'es')) }} />
      <QuestionLandingPage question={question} locale="es" />
    </>
  );
}
