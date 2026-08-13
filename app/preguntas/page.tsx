import type { Metadata } from 'next';
import QuestionsPage from '../../components/QuestionsPage';
import { buildQuestionsJsonLd, questionsCanonical } from '../../lib/questionSeo';

const canonical = questionsCanonical('es');

export const metadata: Metadata = {
  title: '100 Preguntas sobre Buggy en Punta Cana y Bayahibe',
  description: 'Respuestas sobre precios, recogida, niños, seguridad, Playa Macao, cenote, Bayahibe, ropa y reserva de tours en buggy.',
  alternates: {
    canonical,
    languages: { es: canonical, en: questionsCanonical('en'), 'x-default': canonical },
  },
  openGraph: {
    title: '100 Preguntas sobre Buggy en Punta Cana y Bayahibe',
    description: 'Todo lo que necesitas saber antes de reservar un buggy en Punta Cana o Bayahibe.',
    url: canonical,
    siteName: 'Caribbean Buggy',
    images: ['/buggy/doble.jpeg'],
    locale: 'es_DO',
    type: 'website',
  },
};

export default function SpanishQuestionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildQuestionsJsonLd('es')) }} />
      <QuestionsPage locale="es" />
    </>
  );
}
