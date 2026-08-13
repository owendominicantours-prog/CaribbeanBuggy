import Image from 'next/image';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';
import BayahibeRealMedia from './BayahibeRealMedia';
import { TripAdvisorReviewLink } from './TripAdvisorReviews';
import { getProduct, whatsappHref } from '../lib/buggyProducts';
import { getRelatedSearchLandings, searchCategoryLabels, searchLandingPath, searchLandingsPath, type SearchLanding, type SearchLandingLocale } from '../lib/searchLandings';

function productTitle(title: string, locale: SearchLandingLocale) {
  return locale === 'en' ? title.replace('Individual', 'Single').replace('Doble', 'Double').replace('Familiar', 'Family') : title;
}

export default function SearchLandingPage({ landing, locale }: { landing: SearchLanding; locale: SearchLandingLocale }) {
  const isEn = locale === 'en';
  const copy = landing[locale];
  const home = isEn ? '/en' : '/';
  const product = getProduct(landing.productId)!;
  const bookingHref = `${isEn ? '/en' : ''}/buggy/${product.id}`;
  const related = getRelatedSearchLandings(landing);
  const destination = landing.destination === 'bayahibe' ? 'Bayahibe / La Romana' : 'Punta Cana';
  const message = isEn ? `Hello Caribbean Buggy, I found this page: ${copy.title}. I want to check availability.` : `Hola Caribbean Buggy, encontré esta página: ${copy.title}. Quiero confirmar disponibilidad.`;

  return (
    <main className="search-landing-page">
      <header className="site-header">
        <a className="brand" href={home} aria-label="Caribbean Buggy"><span>Caribbean</span><b>Buggy</b></a>
        <nav aria-label={isEn ? 'Excursion guide' : 'Guía de excursión'}><a href="#answer">{isEn ? 'Answer' : 'Respuesta'}</a><a href="#details">{isEn ? 'Details' : 'Detalles'}</a><a href="#faq">FAQ</a></nav>
        <div className="header-actions"><LanguageSwitch current={locale} esHref={searchLandingPath(landing, 'es')} enHref={searchLandingPath(landing, 'en')} /><a className="header-cta" href={bookingHref}>{isEn ? 'Book now' : 'Reservar'}</a></div>
      </header>

      <section className="search-intent-hero">
        <div className="wrap search-intent-hero-grid">
          <div>
            <a className="questions-back" href={searchLandingsPath(locale)}><ArrowLeft size={17} /> {isEn ? 'All excursion searches' : 'Todas las búsquedas'}</a>
            <div className="question-breadcrumb">Caribbean Buggy / {searchCategoryLabels[locale][landing.category]} / {destination}</div>
            <span className="questions-kicker"><Search size={17} /> {copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
            <div className="seo-guide-trust"><span><ShieldCheck size={17} /> {isEn ? 'Direct published prices' : 'Precios directos publicados'}</span><span><CheckCircle2 size={17} /> {isEn ? 'Route-specific answer' : 'Respuesta específica de ruta'}</span></div>
            <TripAdvisorReviewLink locale={locale} destination={landing.destination} location={`search_${landing.id}`} />
          </div>
          <aside className="search-intent-visual">
            <Image src={landing.image} alt={copy.title} width={900} height={600} priority sizes="(max-width: 980px) 100vw, 42vw" />
            <div><span>{destination}</span><b>{isEn ? 'Actual tour option' : 'Opción real del tour'}</b><strong>US${product.promo}</strong></div>
          </aside>
        </div>
      </section>

      <section id="answer" className="section search-answer-section">
        <div className="wrap search-direct-answer"><span><Compass size={20} /></span><div><small>{isEn ? 'DIRECT ANSWER' : 'RESPUESTA DIRECTA'}</small><h2>{copy.answer}</h2></div></div>
      </section>

      <section id="details" className="section search-detail-section">
        <div className="wrap search-detail-grid">
          <article className="seo-guide-article">
            {copy.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}
            <div className="seo-guide-checklist"><h2>{isEn ? 'Check before booking' : 'Comprobar antes de reservar'}</h2>{copy.checklist.map((item) => <span key={item}><CheckCircle2 size={18} /> {item}</span>)}</div>
            <section id="faq" className="seo-guide-faq"><span>FAQ</span><div><h2>{isEn ? 'Answers for this exact search' : 'Respuestas para esta búsqueda exacta'}</h2>{copy.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
          </article>
          <aside className="seo-guide-offer">
            <Image src={product.image} alt={productTitle(product.title, locale)} width={700} height={464} sizes="(max-width: 980px) 100vw, 360px" />
            <div><span>{isEn ? 'Recommended vehicle' : 'Vehículo recomendado'}</span><h2>{productTitle(product.title, locale)}</h2><strong>US${product.promo}</strong><p>{product.capacityLabel} · {product.durationLabel}</p><a href={bookingHref}>{isEn ? 'See availability' : 'Ver disponibilidad'} <ArrowRight size={17} /></a><a className="question-whatsapp" href={whatsappHref(message)}><MessageCircle size={17} /> WhatsApp</a></div>
          </aside>
        </div>
      </section>

      {landing.destination === 'bayahibe' ? <BayahibeRealMedia locale={locale} /> : null}

      <section className="section related-question-section">
        <div className="wrap section-head"><span className="kicker">{isEn ? 'Related searches' : 'Búsquedas relacionadas'}</span><h2>{isEn ? 'Continue comparing before booking.' : 'Sigue comparando antes de reservar.'}</h2></div>
        <div className="wrap related-question-grid">{related.map((item) => <a href={searchLandingPath(item, locale)} key={item.id}><span>{searchCategoryLabels[locale][item.category]}</span><b>{item[locale].title}</b><ArrowRight size={17} /></a>)}</div>
      </section>

      <footer className="footer"><div className="wrap footer-grid"><div><a className="brand footer-brand" href={home}><span>Caribbean</span><b>Buggy</b></a><p>{isEn ? 'Direct buggy booking in Punta Cana and Bayahibe.' : 'Reserva directa de buggy en Punta Cana y Bayahibe.'}</p></div><div><h3>{isEn ? 'Explore' : 'Explorar'}</h3><a href={searchLandingsPath(locale)}>{isEn ? 'All excursion searches' : 'Todas las búsquedas'}</a><a href={isEn ? '/en/questions' : '/preguntas'}>{isEn ? '100 questions' : '100 preguntas'}</a></div><div><h3>{isEn ? 'Book' : 'Reservar'}</h3><a href={bookingHref}>{isEn ? 'Tour and price' : 'Tour y precio'}</a><a href={whatsappHref(message)}>WhatsApp</a></div></div></footer>
    </main>
  );
}

