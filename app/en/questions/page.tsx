import type { Metadata } from 'next';
import QuestionsPage from '../../../components/QuestionsPage';
import { buildQuestionsJsonLd, questionsCanonical } from '../../../lib/questionSeo';

const canonical = questionsCanonical('en');

export const metadata: Metadata = {
  title: '100 Punta Cana and Bayahibe Buggy Questions Answered',
  description: 'Answers about buggy prices, hotel pickup, children, safety, Macao Beach, cenotes, Bayahibe, clothing and booking.',
  alternates: {
    canonical,
    languages: { en: canonical, es: questionsCanonical('es'), 'x-default': questionsCanonical('es') },
  },
  openGraph: {
    title: '100 Punta Cana and Bayahibe Buggy Questions Answered',
    description: 'Everything to know before booking a Punta Cana or Bayahibe buggy tour.',
    url: canonical,
    siteName: 'Caribbean Buggy',
    images: ['/buggy/doble.jpeg'],
    locale: 'en_US',
    type: 'website',
  },
};

export default function EnglishQuestionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildQuestionsJsonLd('en')) }} />
      <QuestionsPage locale="en" />
    </>
  );
}
