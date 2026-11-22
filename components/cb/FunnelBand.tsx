import { Check } from 'lucide-react';
import FunnelOffer, { type FunnelSource } from './FunnelOffer';
import { StickyBook } from './Chrome';

type Locale = 'es' | 'en';

/** Middle of every SEO page: answer read → price for your group → booking with the group and hotel already filled in. */
export default function FunnelBand({ locale, destination, defaultTravelers, source, context }: { locale: Locale; destination: 'punta-cana' | 'bayahibe'; defaultTravelers: number; source: FunnelSource; context?: string }) {
  const en = locale === 'en';
  const bayahibe = destination === 'bayahibe';
  const points = bayahibe
    ? (en
      ? ['Price per buggy: single US$75, double US$145, family US$290', 'Pickup or meeting point confirmed on WhatsApp', 'Card payment and e-ticket by email']
      : ['Precio por buggy: individual US$75, doble US$145, familiar US$290', 'Recogida o punto de encuentro confirmado por WhatsApp', 'Pago con tarjeta y e-ticket por correo'])
    : (en
      ? ['From US$30 per person sharing a buggy', 'Pickup included from Bávaro, Cabeza de Toro, Macao and Uvero Alto', 'Card payment and e-ticket by email']
      : ['Desde US$30 por persona compartiendo buggy', 'Recogida incluida desde Bávaro, Cabeza de Toro, Macao y Uvero Alto', 'Pago con tarjeta y e-ticket por correo']);
  const anchor = en ? 'price' : 'precio';
  return (
    <section className="cb cb-funnel" id={anchor}>
      <div className="cb-wrap cb-funnel-grid">
        <div>
          <span className="cb-kicker">{en ? 'Next step' : 'Siguiente paso'}</span>
          <h2>{en ? 'Now see what it costs for your group.' : 'Ahora mira cuánto te cuesta a ti.'}</h2>
          {context ? <p>{context}</p> : null}
          <ul>{points.map((p) => <li key={p}><Check size={18} /> {p}</li>)}</ul>
        </div>
        <FunnelOffer locale={locale} destination={destination} defaultTravelers={defaultTravelers} source={source} title={en ? 'Your price in 10 seconds' : 'Tu precio en 10 segundos'} showAsk />
      </div>
      <StickyBook locale={locale} href={`#${anchor}`} price={bayahibe ? (en ? 'US$72.50 / person' : 'US$72.50 / persona') : (en ? 'US$30 / person' : 'US$30 / persona')} />
    </section>
  );
}
