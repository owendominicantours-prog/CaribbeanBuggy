import { ArrowLeft, BookOpenCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';
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
      <header className="site-header">
        <a className="brand" href={home} aria-label="Caribbean Buggy"><span>Caribbean</span><b>Buggy</b></a>
        <nav aria-label={isEn ? 'Questions navigation' : 'Navegación de preguntas'}>
          <a href="#prices">{isEn ? 'Prices' : 'Precios'}</a>
          <a href="#pickup">{isEn ? 'Pickup' : 'Recogida'}</a>
          <a href="#safety">{isEn ? 'Safety' : 'Seguridad'}</a>
          <a href="#route">{isEn ? 'Route' : 'Ruta'}</a>
          <a href={guidesPath(locale)}>{isEn ? 'Guides' : 'Guías'}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch current={locale} esHref={questionsPath('es')} enHref={questionsPath('en')} />
          <a className="header-cta" href={`${home}#${isEn ? 'prices' : 'precios'}`}>{isEn ? 'Book now' : 'Reservar'}</a>
        </div>
      </header>

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

      <footer className="footer">
        <div className="wrap footer-grid">
          <div><a className="brand footer-brand" href={home}><span>Caribbean</span><b>Buggy</b></a><p>{isEn ? 'Direct booking answers for Punta Cana and Bayahibe buggy tours.' : 'Respuestas para reservar buggy directamente en Punta Cana y Bayahibe.'}</p></div>
          <div><h3>{isEn ? 'Questions' : 'Preguntas'}</h3><a href="#prices">{isEn ? 'Prices' : 'Precios'}</a><a href="#pickup">{isEn ? 'Pickup' : 'Recogida'}</a><a href="#safety">{isEn ? 'Safety' : 'Seguridad'}</a><a href={guidesPath(locale)}>{isEn ? 'Complete guides' : 'Guías completas'}</a></div>
          <div><h3>{isEn ? 'Booking' : 'Reserva'}</h3><a href={whatsappHref(whatsappMessage)}>{isEn ? 'WhatsApp support' : 'Ayuda por WhatsApp'}</a><a href={`${home}#${isEn ? 'prices' : 'precios'}`}>{isEn ? 'See buggy options' : 'Ver opciones'}</a></div>
        </div>
      </footer>
    </main>
  );
}
