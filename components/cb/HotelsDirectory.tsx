import { hotelBuggyLandings, isBayahibeHotel } from '../../lib/hotelBuggyLandings';
import { areaForHotel } from '../../lib/pickupLookup';
import { siteUrl } from '../../lib/buggyProducts';
import { CbFooter, CbHeader } from './Chrome';
import { HotelLinks, PickupPanel, SectionHead } from './Sections';
import FunnelBand from './FunnelBand';

type Locale = 'es' | 'en';

const ZONE_ORDER = ['Bávaro', 'Arena Gorda', 'Macao / Arena Gorda', 'Macao', 'Cabeza de Toro', 'Uvero Alto', 'Cap Cana', 'Punta Cana'];

export function hotelsDirectoryPath(locale: Locale) {
  return locale === 'en' ? '/en/buggy-tour' : '/es/buggy-tour';
}

export function hotelsDirectoryMeta(locale: Locale) {
  const en = locale === 'en';
  const count = hotelBuggyLandings.filter((h) => !isBayahibeHotel(h)).length;
  return {
    title: en ? `Buggy tour pickup from ${count} Punta Cana hotels | Caribbean Buggy` : `Buggy con recogida en ${count} hoteles de Punta Cana | Caribbean Buggy`,
    description: en
      ? 'Find your hotel and see if buggy pickup is included: Bávaro, Arena Gorda, Cabeza de Toro, Macao, Uvero Alto, Cap Cana and the PUJ area. Book with your hotel already filled in.'
      : 'Busca tu hotel y mira si la recogida del buggy está incluida: Bávaro, Arena Gorda, Cabeza de Toro, Macao, Uvero Alto, Cap Cana y la zona del aeropuerto. Reserva con tu hotel ya puesto.',
    canonical: `${siteUrl}${hotelsDirectoryPath(locale)}`,
    languages: { es: `${siteUrl}${hotelsDirectoryPath('es')}`, en: `${siteUrl}${hotelsDirectoryPath('en')}`, 'x-default': `${siteUrl}${hotelsDirectoryPath('es')}` },
  };
}

export default function HotelsDirectory({ locale }: { locale: Locale }) {
  const en = locale === 'en';
  const puntaCana = hotelBuggyLandings.filter((h) => !isBayahibeHotel(h));
  const bayahibe = hotelBuggyLandings.filter(isBayahibeHotel);
  const zones = [...new Set(puntaCana.map((h) => h.zone))].sort((a, b) => (ZONE_ORDER.indexOf(a) + 99) % 99 - (ZONE_ORDER.indexOf(b) + 99) % 99);
  const included = puntaCana.filter((h) => areaForHotel(h).status === 'included').length;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hotelsDirectoryMeta(locale).title,
    url: hotelsDirectoryMeta(locale).canonical,
    inLanguage: en ? 'en' : 'es',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: hotelBuggyLandings.length,
      itemListElement: hotelBuggyLandings.map((h, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl}/${en ? 'en' : 'es'}/buggy-tour/${h.slug}`, name: en ? `Buggy tour from ${h.name}` : `Buggy tour desde ${h.name}` })),
    },
  };
  return (
    <main className="cb cb-hotels-dir">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CbHeader locale={locale} esHref={hotelsDirectoryPath('es')} enHref={hotelsDirectoryPath('en')} />
      <section className="cb-section">
        <div className="cb-wrap">
          <SectionHead
            kicker={en ? 'Hotel pickup' : 'Recogida en hotel'}
            title={en ? `Buggy tour from your Punta Cana hotel: ${puntaCana.length} hotels` : `Buggy desde tu hotel de Punta Cana: ${puntaCana.length} hoteles`}
            body={en
              ? `Pickup and return are included for ${included} of these hotels. Open your hotel's page to see its area, the estimated drive to the ranch and the booking with your hotel already filled in.`
              : `La recogida y el regreso están incluidos en ${included} de estos hoteles. Abre la página de tu hotel para ver su zona, el tiempo estimado al rancho y la reserva con tu hotel ya puesto.`}
          />
          <PickupPanel locale={locale} compact />
          {zones.map((zone) => (
            <div key={zone} className="cb-zone-block">
              <h2 className="cb-subtitle">{zone}</h2>
              <HotelLinks hotels={puntaCana.filter((h) => h.zone === zone)} locale={locale} timeLabel={en ? 'to the ranch' : 'aprox. al rancho'} />
            </div>
          ))}
          <div className="cb-zone-block">
            <h2 className="cb-subtitle">{en ? 'Bayahibe and La Romana (separate route)' : 'Bayahibe y La Romana (otra ruta)'}</h2>
            <HotelLinks hotels={bayahibe} locale={locale} timeLabel={en ? 'to the base' : 'aprox. a la base'} />
          </div>
        </div>
      </section>
      <FunnelBand locale={locale} destination="punta-cana" defaultTravelers={2} source={{ pageType: 'search', slug: 'hotel-directory' }} />
      <CbFooter locale={locale} />
    </main>
  );
}
