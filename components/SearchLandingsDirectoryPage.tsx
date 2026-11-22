import { ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react';
import { CbFooter, CbHeader } from './cb/Chrome';
import { searchCategoryLabels, searchLandingPath, searchLandings, type SearchLandingLocale } from '../lib/searchLandings';

export default function SearchLandingsDirectoryPage({ locale }: { locale: SearchLandingLocale }) {
  const isEn = locale === 'en';
  const home = isEn ? '/en' : '/';
  const categories = Object.keys(searchCategoryLabels[locale]) as Array<keyof typeof searchCategoryLabels.es>;
  return (
    <main className="search-directory-page">
      <CbHeader locale={locale} esHref={"/excursiones"} enHref={"/en/excursions"} bookingHref={`${home}#${isEn ? 'prices' : 'precios'}`} />
      <section className="questions-hero search-directory-hero"><div className="wrap questions-hero-grid"><div><a className="questions-back" href={home}><ArrowLeft size={17} /> {isEn ? 'Back home' : 'Volver al inicio'}</a><span className="questions-kicker"><Search size={17} /> {isEn ? 'Find your next adventure' : 'Encuentra tu próxima aventura'}</span><h1>{isEn ? 'Choose your buggy tour in Punta Cana or Bayahibe.' : 'Elige tu tour de buggy en Punta Cana o Bayahibe.'}</h1><p>{isEn ? 'Compare vehicles, routes and pickup options. Find practical answers about prices, preparation and booking before choosing the excursion for your group.' : 'Compara vehículos, rutas y recogida. Encuentra respuestas sobre precios, preparación y reserva antes de elegir la excursión para tu grupo.'}</p></div><aside><span>{isEn ? 'PLAN YOUR RIDE' : 'PREPARA TU AVENTURA'}</span><strong>{isEn ? "2 destinations" : "2 destinos"}</strong><ul><li><Sparkles size={17} /> {isEn ? 'Single, double and family buggies' : 'Individuales, dobles y familiares'}</li><li><Sparkles size={17} /> {isEn ? 'Punta Cana and Bayahibe' : 'Punta Cana y Bayahibe'}</li><li><Sparkles size={17} /> {isEn ? 'Clear prices and direct booking' : 'Precios claros y reserva directa'}</li></ul></aside></div></section>
      <section id="searches" className="section search-directory-content"><div className="wrap">{categories.map((category) => { const items = searchLandings.filter((landing) => landing.category === category && searchLandingPath(landing, locale) === (isEn ? `/en/excursions/${landing.en.slug}` : `/excursiones/${landing.es.slug}`)); return <section className="search-directory-cluster" id={category} key={category}><div><span>{String(items.length).padStart(2, '0')}</span><h2>{searchCategoryLabels[locale][category]}</h2></div><div className="search-directory-grid">{items.map((landing) => <a href={searchLandingPath(landing, locale)} key={landing.id}><small>{landing.destination === 'bayahibe' ? 'BAYAHIBE / LA ROMANA' : 'PUNTA CANA'}</small><b>{landing[locale].title}</b><ArrowRight size={17} /></a>)}</div></section>; })}</div></section>
      <CbFooter locale={locale} />
    </main>
  );
}

