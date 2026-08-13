export type TripAdvisorLocale = 'es' | 'en';
export type TripAdvisorDestination = 'punta-cana' | 'bayahibe';

type TripAdvisorWidgetConfig = {
  uniq: string;
  widgetId: string;
  listId: string;
  itemId: string;
  listClass: string;
  itemClass: string;
  lang: string;
  domain: string;
};

type TripAdvisorProfile = {
  locationId: string;
  urls: Record<TripAdvisorLocale, string>;
  widget: Record<TripAdvisorLocale, TripAdvisorWidgetConfig>;
  excellentHighlights: Record<TripAdvisorLocale, string[]>;
};

export const tripadvisorProfiles: Record<TripAdvisorDestination, TripAdvisorProfile> = {
  'punta-cana': {
    locationId: '27261885',
    urls: {
      es: 'https://www.tripadvisor.es/AttractionProductReview-g147293-d27261885-Tour_In_buggy_from_Punta_Cana_with_Cenote-Punta_Cana_La_Altagracia_Province_Domini.html',
      en: 'https://www.tripadvisor.com/AttractionProductReview-g147293-d27261885-Tour_In_buggy_from_Punta_Cana_with_Cenote-Punta_Cana_La_Altagracia_Province_Domini.html',
    },
    widget: {
      es: { uniq: '180', widgetId: 'TA_cdswritereviewlgvi180', listId: 'hxEXlu', itemId: 'sThC5j6uN', listClass: 'TA_links mS7p6XSnheHm', itemClass: 'c2h6DDiNkd', lang: 'es', domain: 'https://www.tripadvisor.es/' },
      en: { uniq: '670', widgetId: 'TA_cdswritereviewlgvi670', listId: 'kwplqn', itemId: '7k5479M2G', listClass: 'TA_links R18vNAAYFX7H', itemClass: 't8RrkzDE', lang: 'en_US', domain: 'https://www.tripadvisor.com/' },
    },
    excellentHighlights: {
      es: ['La aventura de lodo y la adrenalina al conducir.', 'El baño en el cenote y la parada en Playa Macao.', 'La atención del equipo durante la ruta.'],
      en: ['The muddy driving adventure and off-road excitement.', 'Swimming at the cenote and stopping at Macao Beach.', 'Helpful route support from the local team.'],
    },
  },
  bayahibe: {
    locationId: '26868992',
    urls: {
      es: 'https://www.tripadvisor.es/AttractionProductReview-g663484-d26868992-Half_Day_ATV_or_Buggy_4X4_from_Bayahibe_La_Romana-Bayahibe_La_Altagracia_Province_.html',
      en: 'https://www.tripadvisor.com/AttractionProductReview-g663484-d26868992-Half_Day_ATV_or_Buggy_4X4_from_Bayahibe_La_Romana-Bayahibe_La_Altagracia_Province_.html',
    },
    widget: {
      es: { uniq: '448', widgetId: 'TA_cdswritereviewlgvi448', listId: 'fAdBBL8ALEE6', itemId: 'cFGfNY486qAU', listClass: 'TA_links dq6IKmgcQU63', itemClass: 'EdNFNOf', lang: 'es', domain: 'https://www.tripadvisor.es/' },
      en: { uniq: '342', widgetId: 'TA_cdswritereviewlgvi342', listId: 'jfzuahB', itemId: 'Vu1zcblL9l2w', listClass: 'TA_links 13sNIXTuI', itemClass: '4jVBxj1', lang: 'en_US', domain: 'https://www.tripadvisor.com/' },
    },
    excellentHighlights: {
      es: ['Diversión en familia por caminos rurales y charcos.', 'Caña de azúcar, ambiente local y baño en el río Chavón.', 'Guías amables y una experiencia auténtica en Bayahibe.'],
      en: ['Family fun across rural roads and muddy puddles.', 'Sugar cane, local culture and a swim in the Chavón River.', 'Friendly guides and an authentic Bayahibe experience.'],
    },
  },
};

export function tripadvisorSchemaReference(destination: TripAdvisorDestination, locale: TripAdvisorLocale) {
  const profile = tripadvisorProfiles[destination];
  const url = profile.urls[locale];
  return {
    sameAs: url,
    subjectOf: {
      '@type': 'WebPage',
      name: locale === 'en' ? 'Traveler reviews on Tripadvisor' : 'Opiniones de viajeros en Tripadvisor',
      url,
      isPartOf: { '@type': 'WebSite', name: 'Tripadvisor', url: locale === 'en' ? 'https://www.tripadvisor.com/' : 'https://www.tripadvisor.es/' },
    },
    potentialAction: {
      '@type': 'ReviewAction',
      name: locale === 'en' ? 'Write a Tripadvisor review' : 'Escribir una opinión en Tripadvisor',
      target: url,
    },
  };
}
