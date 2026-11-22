import Script from 'next/script';
import { ArrowUpRight, CheckCircle2, MessageSquareText } from 'lucide-react';
import { tripadvisorProfiles, type TripAdvisorDestination, type TripAdvisorLocale } from '../lib/tripadvisor';

export function TripAdvisorReviewLink({ locale, destination, location = 'product_card' }: { locale: TripAdvisorLocale; destination: TripAdvisorDestination; location?: string }) {
  const isEn = locale === 'en';
  const profile = tripadvisorProfiles[destination];
  return (
    <a className="tripadvisor-review-link" href={profile.urls[locale]} target="_blank" rel="noopener noreferrer" data-track-location={location} aria-label={isEn ? `Read ${destination === 'bayahibe' ? 'Bayahibe' : 'Punta Cana'} buggy reviews on Tripadvisor` : `Leer opiniones del buggy de ${destination === 'bayahibe' ? 'Bayahibe' : 'Punta Cana'} en Tripadvisor`}>
      <span className="tripadvisor-mark" aria-hidden="true">●●</span>
      <span><small>Tripadvisor</small><b>{isEn ? 'Read traveler reviews' : 'Opiniones de viajeros'}</b></span>
      <ArrowUpRight size={16} />
    </a>
  );
}

export default function TripAdvisorReviews({ locale, destination, location = 'landing' }: { locale: TripAdvisorLocale; destination: TripAdvisorDestination; location?: string }) {
  const isEn = locale === 'en';
  const profile = tripadvisorProfiles[destination];
  const config = profile.widget[locale];
  const destinationName = destination === 'bayahibe' ? 'Bayahibe' : 'Punta Cana';
  const scriptUrl = `https://www.jscache.com/wejs?wtype=cdswritereviewlgvi&uniq=${config.uniq}&locationId=${profile.locationId}&lang=${config.lang}&display_version=2`;

  return (
    <section className="tripadvisor-reviews" aria-label={isEn ? `${destinationName} buggy reviews on Tripadvisor` : `Opiniones del buggy de ${destinationName} en Tripadvisor`}>
      <div className="tripadvisor-reviews-copy">
        <span><MessageSquareText size={17} /> {isEn ? 'What travelers mention' : 'Lo que mencionan los viajeros'}</span>
        <h2>{isEn ? `What ${destinationName} buggy travelers talk about.` : `Lo que cuentan los viajeros del buggy en ${destinationName}.`}</h2>
        <p>{isEn ? 'Editorial summary of themes that come up in Tripadvisor reviews. Read every rating, good or bad, on the official listing.' : 'Resumen editorial de temas que aparecen en las opiniones de Tripadvisor. Consulta todas las valoraciones, buenas y malas, en la ficha oficial.'}</p>
        <div className="tripadvisor-highlight-list">
          {profile.excellentHighlights[locale].map((highlight) => <span key={highlight}><CheckCircle2 size={17} /> {highlight}</span>)}
        </div>
        <a href={profile.urls[locale]} target="_blank" rel="noopener noreferrer" data-track-location={location}>{isEn ? 'Read all reviews on Tripadvisor' : 'Leer todas las opiniones en Tripadvisor'} <ArrowUpRight size={17} /></a>
      </div>
      <div className="tripadvisor-official-widget">
        <span>{isEn ? 'Already toured with us?' : '¿Ya hiciste el tour?'}</span>
        <b>{isEn ? 'Share your experience' : 'Comparte tu experiencia'}</b>
        <div id={config.widgetId} className="TA_cdswritereviewlgvi">
          <ul id={config.listId} className={config.listClass}>
            <li id={config.itemId} className={config.itemClass}>
              <a target="_blank" rel="noopener noreferrer" href={config.domain}>
                <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="Tripadvisor" loading="lazy" />
              </a>
            </li>
          </ul>
        </div>
        <Script id={`tripadvisor-${destination}-${locale}`} src={scriptUrl} strategy="lazyOnload" />
      </div>
    </section>
  );
}
