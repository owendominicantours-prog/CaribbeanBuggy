import { ArrowLeft, BookOpenCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { CbFooter, CbHeader } from './cb/Chrome';
import QuestionsDirectory from './QuestionsDirectory';
import { buggyQuestions, questionsPath, type QuestionLocale } from '../lib/buggyQuestions';
import { whatsappHref } from '../lib/buggyProducts';
import { guidesPath } from '../lib/seoGuides';

export default function QuestionsPage({ locale }: { locale: QuestionLocale }) {
  const isEn = locale === 'en';
  const home = isEn ? '/en' : '/';
  const whatsappMessage = isEn
    ? 'Hello Caribbean Buggy, I have a question before booking a buggy tour.'
    : 'Hola Caribbean Buggy, tengo una pregunta antes de reservar un tour en buggy.';

  return (
    <main className="questions-page">
      <CbHeader locale={locale} esHref={questionsPath('es')} enHref={questionsPath('en')} bookingHref={`${home}#${isEn ? 'prices' : 'precios'}`} />

      <section className="questions-hero">
        <div className="wrap questions-hero-grid">
          <div>
            <a className="questions-back" href={home}><ArrowLeft size={17} /> {isEn ? 'Back to buggy tours' : 'Volver a los tours'}</a>
            <span className="questions-kicker"><BookOpenCheck size={17} /> {buggyQuestions.length} {isEn ? 'real booking questions' : 'preguntas reales para reservar'}</span>
            <h1>{isEn ? 'Every Punta Cana and Bayahibe buggy question, answered.' : 'Todas tus preguntas sobre buggy en Punta Cana y Bayahibe.'}</h1>
            <p>{isEn ? 'Clear answers about prices, pickup, children, safety, Macao, cenotes, Bayahibe and what to bring—before you pay.' : 'Respuestas claras sobre precios, recogida, niños, seguridad, Macao, cenote, Bayahibe y qué llevar, antes de pagar.'}</p>
          </div>
          <aside>
            <span>{isEn ? 'Before booking' : 'Antes de reservar'}</span>
            <strong>{isEn ? 'Find the exact answer in seconds.' : 'Encuentra la respuesta exacta en segundos.'}</strong>
            <ul>
              <li><CheckCircle2 size={17} /> {isEn ? 'Current web prices' : 'Precios actuales de la web'}</li>
              <li><CheckCircle2 size={17} /> {isEn ? 'Pickup by hotel and zone' : 'Recogida por hotel y zona'}</li>
              <li><CheckCircle2 size={17} /> {isEn ? 'No invented conditions' : 'Sin condiciones inventadas'}</li>
            </ul>
            <a href={whatsappHref(whatsappMessage)} data-track-location="questions_hero"><MessageCircle size={18} /> {isEn ? 'Ask on WhatsApp' : 'Preguntar por WhatsApp'}</a>
          </aside>
        </div>
      </section>

      <section className="section questions-directory-section">
        <div className="wrap">
          <QuestionsDirectory locale={locale} />
        </div>
      </section>

      <section className="question-final-cta">
        <div className="wrap">
          <span>{isEn ? 'Ready after reading?' : '¿Listo después de informarte?'}</span>
          <h2>{isEn ? 'Choose your buggy and reserve directly.' : 'Elige tu buggy y reserva directamente.'}</h2>
          <a href={`${home}#${isEn ? 'prices' : 'precios'}`}>{isEn ? 'Compare buggy options' : 'Comparar opciones de buggy'}</a>
        </div>
      </section>

      <CbFooter locale={locale} />
    </main>
  );
}
