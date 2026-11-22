import { ArrowRight, MessageCircle } from 'lucide-react';
import { products, whatsappHref } from '../../lib/buggyProducts';
import { guidesPath } from '../../lib/seoGuides';
import { questionsPath } from '../../lib/buggyQuestions';
import { searchLandingsPath } from '../../lib/searchLandings';

type Locale = 'es' | 'en';

export function homeAnchors(locale: Locale) {
  const en = locale === 'en';
  return {
    prices: en ? 'prices' : 'precios',
    route: en ? 'route' : 'ruta',
    pickup: en ? 'pickup' : 'recogida',
    included: en ? 'included' : 'incluye',
    faq: 'faq',
    book: en ? 'book' : 'reservar',
  };
}

export function Logo({ href }: { href: string }) {
  return (
    <a className="cb-logo" href={href} aria-label="Caribbean Buggy">
      <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#ff6b1a" /><path d="M9 25h22l-3-8h-6l-2-4h-5l2 4h-3z" fill="#13231b" /><circle cx="13" cy="27" r="4" fill="#13231b" stroke="#ff6b1a" strokeWidth="2" /><circle cx="28" cy="27" r="4" fill="#13231b" stroke="#ff6b1a" strokeWidth="2" /></svg>
      <span><small>Caribbean</small>Buggy</span>
    </a>
  );
}

export function CbHeader({ locale, esHref, enHref, bookingHref }: { locale: Locale; esHref: string; enHref: string; bookingHref?: string }) {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const a = homeAnchors(locale);
  return (
    <header className="cb cb-header">
      <div className="cb-wrap cb-header-row">
        <Logo href={base || '/'} />
        <nav aria-label={en ? 'Main navigation' : 'Navegación principal'}>
          <a href={`${base}/#${a.prices}`}>{en ? 'Prices' : 'Precios'}</a>
          <a href={`${base}/#${a.route}`}>{en ? 'The day' : 'Cómo es el día'}</a>
          <a href={`${base}/#${a.pickup}`}>{en ? 'Pickup' : 'Recogida'}</a>
          <a href={guidesPath(locale)}>{en ? 'Guides' : 'Guías'}</a>
          <a href={questionsPath(locale)}>{en ? 'Questions' : 'Preguntas'}</a>
        </nav>
        <div className="cb-header-actions">
          <span className="cb-lang" aria-label={en ? 'Language' : 'Idioma'}>
            <a href={esHref} className={!en ? 'is-on' : ''} hrefLang="es">ES</a>
            <a href={enHref} className={en ? 'is-on' : ''} hrefLang="en">EN</a>
          </span>
          <a className="cb-header-cta" href={bookingHref || `${base}/#${a.prices}`} data-track-event="booking_cta_click" data-track-location="header">{en ? 'Book' : 'Reservar'}</a>
        </div>
      </div>
    </header>
  );
}

export function CbFooter({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const base = en ? '/en' : '';
  const a = homeAnchors(locale);
  const wa = whatsappHref(en ? 'Hello, I have a question before booking on Caribbean Buggy.' : 'Hola, tengo una duda antes de reservar en Caribbean Buggy.');
  return (
    <footer className="cb cb-footer">
      <div className="cb-wrap cb-footer-grid">
        <div>
          <Logo href={base || '/'} />
          <p>{en ? 'Buggy tours in Punta Cana (Macao) and Bayahibe with pickup in covered areas, local guides and secure card payment.' : 'Tours en buggy por Punta Cana (Macao) y Bayahibe, con recogida en zonas cubiertas, guías locales y pago seguro con tarjeta.'}</p>
          <a className="cb-footer-wa" href={wa}><MessageCircle size={16} /> WhatsApp +1 829 553 9900</a>
        </div>
        <div>
          <h3>{en ? 'Buggies' : 'Buggies'}</h3>
          {products.map((p) => <a key={p.id} href={`${base}/buggy/${p.id}`}>{en ? p.title.replace('Individual', 'Single').replace('Doble', 'Double').replace('Familiar', 'Family') : p.title}</a>)}
        </div>
        <div>
          <h3>{en ? 'Plan' : 'Planifica'}</h3>
          <a href={`${base}/#${a.prices}`}>{en ? 'Prices' : 'Precios'}</a>
          <a href={`${base}/#${a.route}`}>Playa Macao · cenote · rancho</a>
          <a href={`${base}/#${a.pickup}`}>{en ? 'Pickup areas' : 'Zonas de recogida'}</a>
          <a href={en ? '/en/buggy-tour' : '/es/buggy-tour'}>{en ? 'Buggy from your hotel' : 'Buggy desde tu hotel'}</a>
          <a href={guidesPath(locale)}>{en ? 'Buggy guides' : 'Guías de buggy'}</a>
          <a href={questionsPath(locale)}>{en ? 'All questions' : 'Todas las preguntas'}</a>
          <a href={searchLandingsPath(locale)}>{en ? '304 excursion searches' : '304 búsquedas de excursiones'}</a>
        </div>
      </div>
      <div className="cb-wrap cb-footer-legal">
        <a href="https://proactivitis.com" target="_blank" rel="noreferrer">{en ? 'Operated by Proactivitis' : 'Operada por Proactivitis'}</a>
        <a href="https://proactivitis.com/arrival-excursions">{en ? 'Booked your arrival? Explore your 10% excursion benefit' : '¿Reservaste tu llegada? Consulta tu 10 % en excursiones elegibles'}</a>
      </div>
    </footer>
  );
}

export function StickyBook({ locale, href, price }: { locale: Locale; href: string; price: string }) {
  const en = locale === 'en';
  return (
    <div className="cb cb-sticky">
      <span><small>{en ? 'From' : 'Desde'}</small><b>{price}</b></span>
      <a href={href} data-track-event="booking_cta_click" data-track-location="sticky_bar">{en ? 'Book now' : 'Reservar'} <ArrowRight size={17} /></a>
    </div>
  );
}
