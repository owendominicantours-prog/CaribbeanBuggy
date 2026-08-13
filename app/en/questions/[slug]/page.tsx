import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QuestionLandingPage from '../../../../components/QuestionLandingPage';
import { buggyQuestions, getQuestionBySlug } from '../../../../lib/buggyQuestions';
import { buildQuestionJsonLd, questionCanonical } from '../../../../lib/questionSeo';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return buggyQuestions.map((question) => ({ slug: question.en.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug, 'en');
  if (!question) return {};
  const canonical = questionCanonical(question, 'en');

  return {
    title: `${question.en.question} | Caribbean Buggy`,
    description: question.en.answer,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        es: questionCanonical(question, 'es'),
        'x-default': questionCanonical(question, 'es'),
      },
    },
    openGraph: {
      title: question.en.question,
      description: question.en.answer,
      url: canonical,
      siteName: 'Caribbean Buggy',
      images: ['/buggy/doble.jpeg'],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: question.en.question,
      description: question.en.answer,
      images: ['/buggy/doble.jpeg'],
    },
  };
}

export default async function EnglishQuestionLanding({ params }: PageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug, 'en');
  if (!question) notFound();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildQuestionJsonLd(question, 'en')) }} />
      <QuestionLandingPage question={question} locale="en" />
    </>
  );
}
