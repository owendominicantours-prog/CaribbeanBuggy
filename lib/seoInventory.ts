import { products, siteUrl } from './buggyProducts';
import { buggyQuestions, questionPath, questionsPath } from './buggyQuestions';
import { hotelBuggyLandings, hotelBuggyPath, isBayahibeHotel } from './hotelBuggyLandings';
import { guidePath, guidesPath, seoGuides } from './seoGuides';
import { searchLandingPath, searchLandings, searchLandingsPath } from './searchLandings';

export type SeoInventoryType = 'principal' | 'producto' | 'pregunta' | 'guia' | 'hotel' | 'busqueda';
export type SeoInventoryItem = {
  path: string;
  url: string;
  title: string;
  locale: 'es' | 'en';
  type: SeoInventoryType;
  destination: 'general' | 'punta-cana' | 'bayahibe';
  schema: string[];
};

const roots: SeoInventoryItem[] = [
  { path: '/', url: siteUrl, title: 'Caribbean Buggy', locale: 'es', type: 'principal', destination: 'general', schema: ['WebSite', 'LocalBusiness', 'FAQPage'] },
  { path: '/en', url: `${siteUrl}/en`, title: 'Caribbean Buggy', locale: 'en', type: 'principal', destination: 'general', schema: ['WebSite', 'LocalBusiness', 'FAQPage'] },
  { path: questionsPath('es'), url: `${siteUrl}${questionsPath('es')}`, title: '100 preguntas sobre buggy', locale: 'es', type: 'principal', destination: 'general', schema: ['CollectionPage', 'ItemList'] },
  { path: questionsPath('en'), url: `${siteUrl}${questionsPath('en')}`, title: '100 buggy tour questions', locale: 'en', type: 'principal', destination: 'general', schema: ['CollectionPage', 'ItemList'] },
  { path: guidesPath('es'), url: `${siteUrl}${guidesPath('es')}`, title: 'Guías de buggy', locale: 'es', type: 'principal', destination: 'general', schema: ['CollectionPage', 'ItemList'] },
  { path: guidesPath('en'), url: `${siteUrl}${guidesPath('en')}`, title: 'Buggy guides', locale: 'en', type: 'principal', destination: 'general', schema: ['CollectionPage', 'ItemList'] },
  { path: searchLandingsPath('es'), url: `${siteUrl}${searchLandingsPath('es')}`, title: '304 búsquedas de excursiones', locale: 'es', type: 'principal', destination: 'general', schema: ['CollectionPage', 'ItemList'] },
  { path: searchLandingsPath('en'), url: `${siteUrl}${searchLandingsPath('en')}`, title: '304 excursion searches', locale: 'en', type: 'principal', destination: 'general', schema: ['CollectionPage', 'ItemList'] },
];

export const seoInventory: SeoInventoryItem[] = [
  ...roots,
  ...products.flatMap((product): SeoInventoryItem[] => {
    const destination = product.id.startsWith('bayahibe-') ? 'bayahibe' : 'punta-cana';
    return [
      { path: `/buggy/${product.id}`, url: `${siteUrl}/buggy/${product.id}`, title: product.title, locale: 'es', type: 'producto', destination, schema: ['Product', 'BreadcrumbList', 'FAQPage', ...(destination === 'bayahibe' ? ['VideoObject'] : [])] },
      { path: `/en/buggy/${product.id}`, url: `${siteUrl}/en/buggy/${product.id}`, title: product.title, locale: 'en', type: 'producto', destination, schema: ['Product', 'BreadcrumbList', 'FAQPage', ...(destination === 'bayahibe' ? ['VideoObject'] : [])] },
    ];
  }),
  ...buggyQuestions.flatMap((question): SeoInventoryItem[] => [
    { path: questionPath(question, 'es'), url: `${siteUrl}${questionPath(question, 'es')}`, title: question.es.question, locale: 'es', type: 'pregunta', destination: question.destination, schema: ['WebPage', 'FAQPage', 'BreadcrumbList'] },
    { path: questionPath(question, 'en'), url: `${siteUrl}${questionPath(question, 'en')}`, title: question.en.question, locale: 'en', type: 'pregunta', destination: question.destination, schema: ['WebPage', 'FAQPage', 'BreadcrumbList'] },
  ]),
  ...seoGuides.flatMap((guide): SeoInventoryItem[] => [
    { path: guidePath(guide, 'es'), url: `${siteUrl}${guidePath(guide, 'es')}`, title: guide.es.title, locale: 'es', type: 'guia', destination: guide.destination, schema: ['Article', 'Service', 'FAQPage', 'BreadcrumbList', ...(guide.destination === 'bayahibe' ? ['VideoObject'] : [])] },
    { path: guidePath(guide, 'en'), url: `${siteUrl}${guidePath(guide, 'en')}`, title: guide.en.title, locale: 'en', type: 'guia', destination: guide.destination, schema: ['Article', 'Service', 'FAQPage', 'BreadcrumbList', ...(guide.destination === 'bayahibe' ? ['VideoObject'] : [])] },
  ]),
  ...hotelBuggyLandings.flatMap((hotel): SeoInventoryItem[] => {
    const destination = isBayahibeHotel(hotel) ? 'bayahibe' : 'punta-cana';
    return [
      { path: hotelBuggyPath(hotel.slug, 'es'), url: `${siteUrl}${hotelBuggyPath(hotel.slug, 'es')}`, title: `Buggy tour desde ${hotel.name}`, locale: 'es', type: 'hotel', destination, schema: ['Service', 'ItemList', 'FAQPage', 'BreadcrumbList', ...(destination === 'bayahibe' ? ['VideoObject'] : [])] },
      { path: hotelBuggyPath(hotel.slug, 'en'), url: `${siteUrl}${hotelBuggyPath(hotel.slug, 'en')}`, title: `Buggy tour from ${hotel.name}`, locale: 'en', type: 'hotel', destination, schema: ['Service', 'ItemList', 'FAQPage', 'BreadcrumbList', ...(destination === 'bayahibe' ? ['VideoObject'] : [])] },
    ];
  }),
  ...searchLandings.flatMap((landing): SeoInventoryItem[] => [
    { path: searchLandingPath(landing, 'es'), url: `${siteUrl}${searchLandingPath(landing, 'es')}`, title: landing.es.title, locale: 'es', type: 'busqueda', destination: landing.destination, schema: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList', ...(landing.destination === 'bayahibe' ? ['VideoObject'] : [])] },
    { path: searchLandingPath(landing, 'en'), url: `${siteUrl}${searchLandingPath(landing, 'en')}`, title: landing.en.title, locale: 'en', type: 'busqueda', destination: landing.destination, schema: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList', ...(landing.destination === 'bayahibe' ? ['VideoObject'] : [])] },
  ]),
];

const seoPathSet = new Set(seoInventory.map((item) => item.path));
export function isTrackedSeoPath(pathname: string) { return seoPathSet.has(pathname); }

