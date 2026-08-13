import Image from 'next/image';
import { ArrowLeft, ArrowRight, CalendarCheck2, CheckCircle2, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';
import {
  categoryLabel,
  getRelatedQuestions,
  questionPath,
  questionsPath,
  type BuggyQuestion,
  type QuestionLocale,
} from '../lib/buggyQuestions';
import { getProduct, whatsappHref } from '../lib/buggyProducts';
import { getGuideForContext, guidePath, guidesPath, type SeoGuideCategory } from '../lib/seoGuides';
import { TripAdvisorReviewLink } from './TripAdvisorReviews';

function guidance(question: BuggyQuestion, locale: QuestionLocale) {
  const isEn = locale === 'en';
  const destination = question.destination === 'bayahibe'
    ? 'Bayahibe / La Romana'
    : question.destination === 'punta-cana'
      ? 'Punta Cana / Macao'
      : isEn ? 'Punta Cana or Bayahibe' : 'Punta Cana o Bayahibe';

  const categoryGuidance = {
    prices: isEn
      ? ['Check the complete total', 'Select the vehicle, travelers and pickup zone. The calculator displays the vehicle count and any published zone surcharge before payment.']
      : ['Revisa el total completo', 'Selecciona vehículo, pasajeros y zona. El calculador muestra cuántos vehículos necesitas y cualquier suplemento publicado antes del pago.'],
    pickup: isEn
      ? ['Enter the exact accommodation', 'Hotel names and zones matter because pickup routes use authorized lobbies, tour areas or nearby meeting points. Final timing arrives by message.']
      : ['Escribe el alojamiento exacto', 'El hotel y la zona importan porque las rutas usan lobby, área de tours o un punto cercano autorizado. La hora final llega por mensaje.'],
    safety: isEn
      ? ['Safety decides the right option', 'Share driver ages, child ages and any physical limitation before paying. The guide’s instructions and daily operating decision always take priority.']
      : ['La seguridad define la opción correcta', 'Indica edades de conductores y niños, además de cualquier limitación física. Las instrucciones del guía y la decisión operativa siempre tienen prioridad.'],
    route: isEn
      ? ['Choose the route by destination', 'Punta Cana focuses on Macao, cenote, ranch and beach. Bayahibe uses a separate rural 4x4 operation whose exact stops must be confirmed.']
      : ['Elige la ruta según el destino', 'Punta Cana se enfoca en Macao, cenote, rancho y playa. Bayahibe usa una operación rural 4x4 separada cuyas paradas deben confirmarse.'],
    preparation: isEn
      ? ['Prepare for water, dust and mud', 'Bring only essentials, protect electronics and wear clothes that can get dirty. Conditions change with weather and the trail.']
      : ['Prepárate para agua, polvo y lodo', 'Lleva solo lo esencial, protege los dispositivos y usa ropa que pueda ensuciarse. Las condiciones cambian con el clima y el camino.'],
    planning: isEn
      ? ['Confirm before reorganizing your day', 'Approximate duration helps planning, but pickup, traffic and operations can change. Use the confirmed time rather than an estimate.']
      : ['Confirma antes de organizar todo el día', 'La duración aproximada ayuda, pero recogida, tráfico y operación pueden cambiar. Usa la hora confirmada y no solo una estimación.'],
  }[question.category];

  return { destination, title: categoryGuidance[0], body: categoryGuidance[1] };
}

export default function QuestionLandingPage({ question, locale }: { question: BuggyQuestion; locale: QuestionLocale }) {
  const isEn = locale === 'en';
  const content = question[locale];
  const home = isEn ? '/en' : '/';
  const related = getRelatedQuestions(question);
  const guide = guidance(question, locale);
  const guideCategory: Record<BuggyQuestion['category'], SeoGuideCategory> = {
    prices: 'price', pickup: 'pickup', safety: 'safety', route: 'destination', preparation: 'planning', planning: 'planning',
  };
  const completeGuide = getGuideForContext(guideCategory[question.category], question.destination);
  const productId = question.destination === 'bayahibe' ? 'bayahibe-buggy-doble' : 'buggy-doble';
  const product = getProduct(productId)!;
  const bookingHref = `${isEn ? '/en' : ''}/buggy/${product.id}`;
  const whatsappMessage = isEn
    ? `Hello Caribbean Buggy, I read: "${content.question}". I want to confirm details before booking.`
    : `Hola Caribbean Buggy, leí: "${content.question}". Quiero confirmar los detalles antes de reservar.`;

  return (
    <main className="question-landing-page">
      <header className="site-header">
        <a className="brand" href={home} aria-label="Caribbean Buggy"><span>Caribbean</span><b>Buggy</b></a>
        <nav aria-label={isEn ? 'Question guide' : 'Guía de pregunta'}>
          <a href={questionsPath(locale)}>{isEn ? '100 questions' : '100 preguntas'}</a>
          <a href="#answer">{isEn ? 'Answer' : 'Respuesta'}</a>
          <a href="#related">{isEn ? 'Related' : 'Relacionadas'}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch current={locale} esHref={questionPath(question, 'es')} enHref={questionPath(question, 'en')} />
          <a className="header-cta" href={bookingHref}>{isEn ? 'Book now' : 'Reservar'}</a>
        </div>
      </header>

      <section className="question-landing-hero">
        <div className="wrap">
          <a className="questions-back" href={questionsPath(locale)}><ArrowLeft size={17} /> {isEn ? 'All buggy questions' : 'Todas las preguntas de buggy'}</a>
          <div className="question-breadcrumb">Caribbean Buggy / {categoryLabel(question.category, locale)} / {guide.destination}</div>
          <span className="questions-kicker"><MapPin size={16} /> {guide.destination}</span>
          <h1>{content.question}</h1>
          <div id="answer" className="direct-answer">
            <span>{isEn ? 'Direct answer' : 'Respuesta directa'}</span>
            <p>{content.answer}</p>
          </div>
        </div>
      </section>

      <section className="section question-guide-section">
        <div className="wrap question-guide-grid">
          <article className="question-guide-main">
            <span className="kicker">{isEn ? 'What this means for your booking' : 'Qué significa para tu reserva'}</span>
            <h2>{guide.title}</h2>
            <p>{guide.body}</p>
            <div className="question-action-list">
              <span><CheckCircle2 size={18} /><b>{isEn ? 'Choose the correct destination' : 'Elige el destino correcto'}</b><small>{guide.destination}</small></span>
              <span><CalendarCheck2 size={18} /><b>{isEn ? 'Add date and accommodation' : 'Agrega fecha y alojamiento'}</b><small>{isEn ? 'The team validates availability and routing.' : 'El equipo valida disponibilidad y ruta.'}</small></span>
              <span><ShieldCheck size={18} /><b>{isEn ? 'Confirm operational details' : 'Confirma los detalles operativos'}</b><small>{isEn ? 'Pickup time arrives by WhatsApp or email.' : 'La hora de recogida llega por WhatsApp o correo.'}</small></span>
            </div>
            <a className="question-guide-bridge" href={guidePath(completeGuide, locale)}><span>{isEn ? 'Complete guide' : 'Guía completa'}</span><b>{completeGuide[locale].title}</b><ArrowRight size={19} /></a>
            {question.destination !== 'general' ? <TripAdvisorReviewLink locale={locale} destination={question.destination} location={`question_${question.id}`} /> : null}
          </article>

          <aside className="question-booking-card">
            <Image src={product.image} alt={isEn ? 'Double buggy ready to book' : 'Buggy doble disponible para reservar'} width={700} height={464} sizes="(max-width: 980px) 100vw, 360px" />
            <div>
              <span>{isEn ? 'Recommended starting point' : 'Opción recomendada para comenzar'}</span>
              <h2>{question.destination === 'bayahibe' ? (isEn ? 'Bayahibe Double Buggy' : 'Buggy Doble Bayahibe') : (isEn ? 'Punta Cana Double Buggy' : 'Buggy Doble Punta Cana')}</h2>
              <strong>US${product.promo}</strong>
              <p>{isEn ? 'Price per vehicle for two travelers.' : 'Precio por vehículo para dos personas.'}</p>
              <a href={bookingHref} data-product-id={product.id}>{isEn ? 'See details and reserve' : 'Ver detalles y reservar'} <ArrowRight size={17} /></a>
              <a className="question-whatsapp" href={whatsappHref(whatsappMessage)} data-track-location="question_landing"><MessageCircle size={17} /> {isEn ? 'Confirm on WhatsApp' : 'Confirmar por WhatsApp'}</a>
            </div>
          </aside>
        </div>
      </section>

      <section id="related" className="section related-question-section">
        <div className="wrap section-head"><span className="kicker">{isEn ? 'Keep planning' : 'Sigue planificando'}</span><h2>{isEn ? 'Related buggy questions.' : 'Preguntas relacionadas de buggy.'}</h2></div>
        <div className="wrap related-question-grid">
          {related.map((item) => <a href={questionPath(item, locale)} key={item.id}><span>{categoryLabel(item.category, locale)}</span><b>{item[locale].question}</b><ArrowRight size={18} /></a>)}
        </div>
        <div className="wrap all-question-link"><a href={questionsPath(locale)}>{isEn ? 'Browse all 100 questions' : 'Ver las 100 preguntas'} <ArrowRight size={18} /></a></div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div><a className="brand footer-brand" href={home}><span>Caribbean</span><b>Buggy</b></a><p>{isEn ? 'Clear answers before booking your buggy.' : 'Respuestas claras antes de reservar tu buggy.'}</p></div>
          <div><h3>{isEn ? 'Learn' : 'Información'}</h3><a href={questionsPath(locale)}>{isEn ? '100 questions' : '100 preguntas'}</a><a href={guidesPath(locale)}>{isEn ? 'Buggy guides' : 'Guías de buggy'}</a><a href={`${home}#${isEn ? 'route' : 'ruta'}`}>{isEn ? 'Tour route' : 'Ruta del tour'}</a></div>
          <div><h3>{isEn ? 'Book' : 'Reservar'}</h3><a href={bookingHref}>{isEn ? 'Buggy options' : 'Opciones de buggy'}</a><a href={whatsappHref(whatsappMessage)}>WhatsApp</a></div>
        </div>
      </footer>
    </main>
  );
}
