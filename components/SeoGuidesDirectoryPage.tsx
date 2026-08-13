import Image from 'next/image';
import { ArrowRight, BookOpenCheck, CheckCircle2, MapPin } from 'lucide-react';
import LanguageSwitch from './LanguageSwitch';
import { guideCategoryLabels, guidePath, guidesPath, seoGuides, type SeoGuideLocale } from '../lib/seoGuides';

export default function SeoGuidesDirectoryPage({ locale }: { locale: SeoGuideLocale }) {
  const isEn = locale === 'en';
  const home = isEn ? '/en' : '/';
  const grouped = Object.entries(guideCategoryLabels[locale]).map(([category, label]) => ({
    category,
    label,
    guides: seoGuides.filter((guide) => guide.category === category),
  })).filter((group) => group.guides.length);

  return (
    <main className="seo-guides-page">
      <header className="site-header">
        <a className="brand" href={home} aria-label="Caribbean Buggy"><span>Caribbean</span><b>Buggy</b></a>
        <nav aria-label={isEn ? 'Buggy guides' : 'Guías de buggy'}>
          <a href="#guides">{isEn ? 'All guides' : 'Todas las guías'}</a>
          <a href={isEn ? '/en/questions' : '/preguntas'}>{isEn ? '100 questions' : '100 preguntas'}</a>
          <a href={`${home}#${isEn ? 'prices' : 'precios'}`}>{isEn ? 'Prices' : 'Precios'}</a>
        </nav>
        <div className="header-actions"><LanguageSwitch current={locale} esHref={guidesPath('es')} enHref={guidesPath('en')} /><a className="header-cta" href={`${home}#${isEn ? 'prices' : 'precios'}`}>{isEn ? 'Book now' : 'Reservar'}</a></div>
      </header>

      <section className="seo-guides-hero">
        <div className="wrap seo-guides-hero-grid">
          <div>
            <span className="questions-kicker"><BookOpenCheck size={17} /> {seoGuides.length} {isEn ? 'expert booking guides' : 'guías para reservar mejor'}</span>
            <h1>{isEn ? 'The buggy knowledge center for Punta Cana and Bayahibe.' : 'El centro de guías de buggy para Punta Cana y Bayahibe.'}</h1>
            <p>{isEn ? 'Compare routes, prices, vehicles, pickup areas, safety and preparation before choosing your tour.' : 'Compara rutas, precios, vehículos, zonas de recogida, seguridad y preparación antes de elegir tu tour.'}</p>
          </div>
          <aside>
            <strong>{isEn ? 'One decision center' : 'Todo para decidir'}</strong>
            <span><CheckCircle2 size={17} /> {isEn ? 'Real published prices' : 'Precios publicados reales'}</span>
            <span><CheckCircle2 size={17} /> {isEn ? 'Punta Cana vs Bayahibe' : 'Punta Cana vs. Bayahibe'}</span>
            <span><CheckCircle2 size={17} /> {isEn ? 'Direct paths to booking' : 'Acceso directo a reserva'}</span>
          </aside>
        </div>
      </section>

      <section id="guides" className="section seo-guide-directory">
        {grouped.map((group) => (
          <div className="wrap seo-guide-group" key={group.category}>
            <div className="section-head"><span className="kicker">{group.label}</span><h2>{isEn ? `Guides for ${group.label.toLowerCase()}.` : `Guías de ${group.label.toLowerCase()}.`}</h2></div>
            <div className="seo-guide-card-grid">
              {group.guides.map((guide) => (
                <a href={guidePath(guide, locale)} className="seo-guide-card" key={guide.id}>
                  <Image src={guide.image} alt={guide[locale].title} width={700} height={464} sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" />
                  <div><span><MapPin size={14} /> {guide[locale].eyebrow}</span><h3>{guide[locale].title}</h3><p>{guide[locale].description}</p><b>{isEn ? 'Read guide' : 'Leer guía'} <ArrowRight size={16} /></b></div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="footer"><div className="wrap footer-grid"><div><a className="brand footer-brand" href={home}><span>Caribbean</span><b>Buggy</b></a><p>{isEn ? 'Useful guides for booking direct.' : 'Guías útiles para reservar directo.'}</p></div><div><h3>{isEn ? 'Learn' : 'Aprender'}</h3><a href={isEn ? '/en/questions' : '/preguntas'}>{isEn ? '100 questions' : '100 preguntas'}</a></div><div><h3>{isEn ? 'Book' : 'Reservar'}</h3><a href={`${home}#${isEn ? 'prices' : 'precios'}`}>{isEn ? 'Compare buggies' : 'Comparar buggies'}</a></div></div></footer>
    </main>
  );
}
