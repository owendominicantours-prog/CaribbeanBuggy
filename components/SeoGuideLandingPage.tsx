import Image from 'next/image';
import { CbFooter, CbHeader } from './cb/Chrome';
import FunnelBand from './cb/FunnelBand';
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { getProduct, whatsappHref } from '../lib/buggyProducts';
import { buggyQuestions, questionPath, type QuestionCategory as BuggyQuestionCategory } from '../lib/buggyQuestions';
import { getRelatedSeoGuides, guideCategoryLabels, guidePath, guidesPath, type SeoGuide, type SeoGuideLocale } from '../lib/seoGuides';
import { TripAdvisorReviewLink } from './TripAdvisorReviews';
import BayahibeRealMedia from './BayahibeRealMedia';

export default function SeoGuideLandingPage({ guide, locale }: { guide: SeoGuide; locale: SeoGuideLocale }) {
  const isEn = locale === 'en';
  const copy = guide[locale];
  const home = isEn ? '/en' : '/';
  const product = getProduct(guide.productId)!;
  const bookingHref = `${isEn ? '/en' : ''}/buggy/${product.id}`;
  const relatedGuides = getRelatedSeoGuides(guide);
  const questionCategories: Record<SeoGuide['category'], BuggyQuestionCategory[]> = {
    destination: ['route'], price: ['prices'], audience: ['safety', 'planning'], pickup: ['pickup'], planning: ['preparation', 'planning'], safety: ['safety'],
  };
  const relatedQuestions = buggyQuestions
    .filter((question) => guide.destination === 'general' || question.destination === guide.destination || question.destination === 'general')
    .sort((a, b) => Number(questionCategories[guide.category].includes(b.category)) - Number(questionCategories[guide.category].includes(a.category)))
    .slice(0, 6);
  const whatsappMessage = isEn ? `Hello Caribbean Buggy, I read your guide: ${copy.title}. I want to book.` : `Hola Caribbean Buggy, leí la guía: ${copy.title}. Quiero reservar.`;

  return (
    <main className="seo-guide-landing">
      <CbHeader locale={locale} esHref={guidePath(guide, 'es')} enHref={guidePath(guide, 'en')} bookingHref={bookingHref} />

      <section className="seo-guide-hero">
        <div className="wrap">
          <a className="questions-back" href={guidesPath(locale)}><ArrowLeft size={17} /> {isEn ? 'All buggy guides' : 'Todas las guías'}</a>
          <div className="question-breadcrumb">Caribbean Buggy / {guideCategoryLabels[locale][guide.category]} / {copy.eyebrow}</div>
          <span className="questions-kicker"><BookOpenCheck size={17} /> {copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <div className="seo-guide-trust"><span><ShieldCheck size={17} /> {isEn ? 'Clear operating conditions' : 'Condiciones operativas claras'}</span><span><CheckCircle2 size={17} /> {isEn ? 'Direct published prices' : 'Precios directos publicados'}</span></div>
          <p className="seo-guide-byline">{isEn ? 'Published by Caribbean Buggy · Booking guidance based on the options and operating conditions shown on this website.' : 'Publicado por Caribbean Buggy · Orientación basada en las opciones y condiciones operativas mostradas en esta web.'}</p>
          {guide.destination !== 'general' ? <TripAdvisorReviewLink locale={locale} destination={guide.destination} location={`guide_${guide.id}`} /> : null}
        </div>
      </section>

      <section id="guide" className="section seo-guide-content-section">
        <div className="wrap seo-guide-content-grid">
          <article className="seo-guide-article">
            {copy.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}
            <div className="seo-guide-checklist"><h2>{isEn ? 'Booking checklist' : 'Lista antes de reservar'}</h2>{copy.checklist.map((item) => <span key={item}><CheckCircle2 size={18} /> {item}</span>)}</div>
            <section id="faq" className="seo-guide-faq"><span>FAQ</span><div><h2>{isEn ? 'Direct answers for this guide' : 'Respuestas directas de esta guía'}</h2>{copy.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
          </article>

          <aside className="seo-guide-offer">
            <Image src={product.image} alt={product.title} width={700} height={464} sizes="(max-width: 980px) 100vw, 360px" />
            <div><span>{isEn ? 'Recommended option' : 'Opción recomendada'}</span><h2>{product.title}</h2><strong>US${product.promo}</strong><p>{product.capacityLabel} · {product.durationLabel}</p><a href={bookingHref}>{isEn ? 'See tour and reserve' : 'Ver tour y reservar'} <ArrowRight size={17} /></a><a className="question-whatsapp" href={whatsappHref(whatsappMessage)}><MessageCircle size={17} /> WhatsApp</a></div>
          </aside>
        </div>
      </section>

      {guide.destination === 'bayahibe' ? <BayahibeRealMedia locale={locale} /> : null}

      <FunnelBand locale={locale} destination={guide.destination === 'bayahibe' ? 'bayahibe' : 'punta-cana'} defaultTravelers={product.capacityNumber} source={{ pageType: 'guide', slug: copy.slug }} />

      <section id="related" className="section related-question-section">
        <div className="wrap section-head"><span className="kicker">{isEn ? 'Topic cluster' : 'Clúster relacionado'}</span><h2>{isEn ? 'Continue with related guides.' : 'Continúa con guías relacionadas.'}</h2></div>
        <div className="wrap seo-guide-related-grid">{relatedGuides.map((item) => <a href={guidePath(item, locale)} key={item.id}><span>{item[locale].eyebrow}</span><b>{item[locale].title}</b><ArrowRight size={17} /></a>)}</div>
        <div className="wrap section-head seo-question-links-head"><span className="kicker">{isEn ? 'Specific doubts' : 'Dudas específicas'}</span><h2>{isEn ? 'Answers connected to this guide.' : 'Respuestas conectadas con esta guía.'}</h2></div>
        <div className="wrap related-question-grid">{relatedQuestions.map((question) => <a href={questionPath(question, locale)} key={question.id}><span>FAQ</span><b>{question[locale].question}</b><ArrowRight size={17} /></a>)}</div>
      </section>

      <CbFooter locale={locale} />
    </main>
  );
}
