import { siteUrl } from './buggyProducts';

export type SearchLandingLocale = 'es' | 'en';
export type SearchLandingDestination = 'punta-cana' | 'bayahibe';
export type SearchLandingCategory = 'terminology' | 'audience' | 'timing' | 'route' | 'comparison' | 'planning' | 'booking' | 'pickup';

type Angle = { es: string; en: string };
type LocalizedCopy = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  answer: string;
  sections: Array<{ title: string; body: string }>;
  checklist: string[];
  faqs: Array<[string, string]>;
};

export type SearchLanding = {
  id: string;
  category: SearchLandingCategory;
  destination: SearchLandingDestination;
  productId: string;
  image: string;
  es: LocalizedCopy;
  en: LocalizedCopy;
};

const angles: Record<SearchLandingCategory, Angle[]> = {
  terminology: [
    ['tour en buggy', 'buggy tour'], ['excursión en buggy', 'buggy excursion'], ['ATV tour', 'ATV tour'],
    ['dune buggy', 'dune buggy'], ['buggy 4x4', '4x4 buggy'], ['buggy off-road', 'off-road buggy'],
    ['beach buggy', 'beach buggy'], ['buggy de aventura', 'adventure buggy'], ['boogie tour', 'boogie tour'],
    ['boggie tour', 'boggie tour'], ['paseo en buggy', 'buggy ride'], ['buggy safari', 'buggy safari'],
    ['mud buggy', 'mud buggy'], ['buggy familiar', 'family buggy'], ['buggy individual', 'single buggy'],
    ['buggy doble', 'double buggy'], ['buggy de cuatro plazas', 'four-seat buggy'], ['buggy con guía', 'guided buggy'],
    ['buggy dominicano', 'Dominican buggy tour'],
  ].map(([es, en]) => ({ es, en })),
  audience: [
    ['viajeros solos', 'solo travelers'], ['parejas', 'couples'], ['luna de miel', 'honeymoon couples'],
    ['familias con niños', 'families with children'], ['familias con adolescentes', 'families with teenagers'], ['grupos de adultos', 'adult groups'],
    ['conductores principiantes', 'first-time drivers'], ['amigos', 'groups of friends'], ['grupos de 6 personas', 'groups of 6'],
    ['grupos de 8 personas', 'groups of 8'], ['grupos de 10 personas', 'groups of 10'], ['grupos de 12 personas', 'groups of 12'],
    ['pasajeros de crucero', 'cruise passengers'], ['huéspedes de hotel', 'hotel guests'], ['huéspedes de Airbnb', 'Airbnb guests'],
    ['aficionados a la fotografía', 'photography lovers'], ['viajeros de aventura', 'adventure travelers'], ['personas que no saben nadar', 'non-swimmers'],
    ['grupos familiares grandes', 'large family groups'],
  ].map(([es, en]) => ({ es, en })),
  timing: [
    ['en enero', 'in January'], ['en febrero', 'in February'], ['en marzo', 'in March'], ['en abril', 'in April'],
    ['en mayo', 'in May'], ['en junio', 'in June'], ['en julio', 'in July'], ['en agosto', 'in August'],
    ['en septiembre', 'in September'], ['en octubre', 'in October'], ['en noviembre', 'in November'], ['en diciembre', 'in December'],
    ['para hoy', 'today'], ['para mañana', 'tomorrow'], ['este fin de semana', 'this weekend'],
    ['en horario de mañana', 'in the morning'], ['en horario de tarde', 'in the afternoon'], ['en temporada de lluvia', 'during rainy season'],
    ['en temporada seca', 'during dry season'],
  ].map(([es, en]) => ({ es, en })),
  route: [
    ['con caminos de lodo', 'with mud trails'], ['con parada para nadar', 'with a swimming stop'], ['con paisaje rural', 'through rural scenery'],
    ['con plantaciones locales', 'with local plantations'], ['con degustación dominicana', 'with Dominican tasting'], ['con playa', 'with a beach stop'],
    ['con río', 'with a river stop'], ['con cueva o cenote', 'with a cave or cenote'], ['por caminos de caña de azúcar', 'through sugar-cane roads'],
    ['con comunidades rurales', 'through rural communities'], ['con charcos y agua', 'with puddles and water'], ['con rancho dominicano', 'with a Dominican ranch'],
    ['con café y cacao', 'with coffee and cacao'], ['con mamajuana', 'with mamajuana tasting'], ['con tiempo para fotos', 'with photo stops'],
    ['con guía local', 'with a local guide'], ['con recogida y regreso', 'with pickup and return'], ['de medio día', 'half-day route'],
    ['con experiencia cultural', 'with a cultural experience'],
  ].map(([es, en]) => ({ es, en })),
  comparison: [
    ['buggy vs ATV', 'buggy vs ATV'], ['buggy vs quad', 'buggy vs quad'], ['buggy vs UTV', 'buggy vs UTV'],
    ['buggy vs Polaris', 'buggy vs Polaris'], ['buggy individual vs doble', 'single vs double buggy'], ['buggy doble vs familiar', 'double vs family buggy'],
    ['buggy vs jeep safari', 'buggy vs jeep safari'], ['tour de mañana vs tarde', 'morning vs afternoon tour'], ['tour compartido vs privado', 'shared vs private tour'],
    ['tour en buggy vs alquiler', 'buggy tour vs rental'], ['reservar online vs en el hotel', 'online booking vs hotel desk'], ['operador directo vs revendedor', 'direct operator vs reseller'],
    ['Punta Cana vs Bayahibe', 'Punta Cana vs Bayahibe'], ['ruta de playa vs ruta rural', 'beach route vs rural route'], ['cenote vs parada de río', 'cenote vs river stop'],
    ['buggy vs tirolina', 'buggy vs zipline'], ['buggy vs paseo a caballo', 'buggy vs horseback riding'], ['buggy vs catamarán', 'buggy vs catamaran'],
    ['buggy vs Monkeyland', 'buggy vs Monkeyland'],
  ].map(([es, en]) => ({ es, en })),
  planning: [
    ['qué ropa llevar', 'what to wear'], ['qué zapatos usar', 'which shoes to wear'], ['si llevar traje de baño', 'whether to bring a swimsuit'],
    ['si llevar toalla', 'whether to bring a towel'], ['cómo proteger el teléfono', 'how to protect your phone'], ['cómo llevar una cámara', 'how to bring a camera'],
    ['cuánto efectivo llevar', 'how much cash to bring'], ['qué protector solar usar', 'which sunscreen to use'], ['si usar gafas o goggles', 'whether to wear glasses or goggles'],
    ['cómo prepararse para el lodo', 'how to prepare for mud'], ['dónde cambiarse después', 'where to change afterward'], ['si hace falta licencia', 'whether a license is needed'],
    ['edad mínima para conducir', 'minimum driving age'], ['restricciones durante el embarazo', 'pregnancy restrictions'], ['problemas de espalda y seguridad', 'back conditions and safety'],
    ['idioma del guía', 'guide language'], ['duración total del tour', 'total tour duration'], ['hora exacta de recogida', 'exact pickup time'],
    ['cambios por clima', 'weather-related changes'],
  ].map(([es, en]) => ({ es, en })),
  booking: [
    ['precio del tour', 'tour price'], ['buggy económico', 'affordable buggy'], ['mejor tour en buggy', 'best buggy tour'],
    ['opiniones verificables', 'verifiable reviews'], ['reseñas de Tripadvisor', 'Tripadvisor reviews'], ['fotos reales', 'real photos'],
    ['video real', 'real video'], ['reserva online', 'online booking'], ['pago con PayPal', 'PayPal payment'],
    ['pago con tarjeta', 'card payment'], ['reserva por WhatsApp', 'WhatsApp booking'], ['pago de depósito', 'deposit payment'],
    ['precio sin cargos ocultos', 'price without hidden fees'], ['precio por vehículo', 'price per vehicle'], ['disponibilidad inmediata', 'immediate availability'],
    ['confirmación el mismo día', 'same-day confirmation'], ['reserva segura', 'secure booking'], ['reserva directa', 'direct booking'],
    ['reservar antes de llegar', 'booking before arrival'],
  ].map(([es, en]) => ({ es, en })),
  pickup: [
    ['desde un hotel', 'from a hotel'], ['desde un resort todo incluido', 'from an all-inclusive resort'], ['desde un Airbnb', 'from an Airbnb'],
    ['desde una villa', 'from a villa'], ['desde un apartamento', 'from an apartment'], ['desde el puerto de cruceros', 'from the cruise port'],
    ['cerca del aeropuerto', 'near the airport'], ['desde un hotel solo para adultos', 'from an adults-only hotel'], ['desde el centro turístico', 'from the tourist center'],
    ['desde un hotel de playa', 'from a beach hotel'], ['desde un complejo cerrado', 'from a gated resort'], ['desde un hostal', 'from a guesthouse'],
    ['desde una residencia privada', 'from a private residence'], ['para un grupo completo', 'for a complete group'], ['en el lobby', 'at the lobby'],
    ['en el mostrador de excursiones', 'at the tour desk'], ['en la entrada de seguridad', 'at the security gate'], ['en un punto cercano confirmado', 'at a confirmed nearby point'],
    ['con coordinación el mismo día', 'with same-day coordination'],
  ].map(([es, en]) => ({ es, en })),
};

export const searchCategoryLabels: Record<SearchLandingLocale, Record<SearchLandingCategory, string>> = {
  es: { terminology: 'Tipos de buggy', audience: 'Para cada viajero', timing: 'Fechas y horarios', route: 'Rutas y paradas', comparison: 'Comparaciones', planning: 'Preparación', booking: 'Precios y reserva', pickup: 'Recogida' },
  en: { terminology: 'Buggy tour types', audience: 'Traveler profiles', timing: 'Dates and times', route: 'Routes and stops', comparison: 'Comparisons', planning: 'Preparation', booking: 'Prices and booking', pickup: 'Pickup' },
};

const destinationNames = {
  'punta-cana': { es: 'Punta Cana', en: 'Punta Cana' },
  bayahibe: { es: 'Bayahibe y La Romana', en: 'Bayahibe and La Romana' },
};

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function routeFacts(destination: SearchLandingDestination, locale: SearchLandingLocale) {
  if (destination === 'bayahibe') return locale === 'en'
    ? 'The real Bayahibe operation uses red buggies on sugar-cane roads, rural mud trails and a Chavón River stop when daily conditions allow it.'
    : 'La operación real de Bayahibe utiliza buggies rojos por cañaverales, caminos rurales de lodo y una parada en el río Chavón cuando las condiciones del día lo permiten.';
  return locale === 'en'
    ? 'The Punta Cana experience follows the Macao area with off-road trails, a Dominican ranch, cave or cenote and Macao Beach according to daily operations.'
    : 'La experiencia de Punta Cana recorre la zona de Macao con caminos off-road, rancho dominicano, cueva o cenote y Playa Macao según la operación del día.';
}

function priceFacts(destination: SearchLandingDestination, locale: SearchLandingLocale) {
  if (destination === 'bayahibe') return locale === 'en'
    ? 'Published Bayahibe prices start at US$75 for a single buggy, US$145 for a double and US$290 for a family vehicle.'
    : 'Los precios publicados de Bayahibe comienzan en US$75 para buggy individual, US$145 para doble y US$290 para familiar.';
  return locale === 'en'
    ? 'Published Punta Cana prices start at US$40 for a single buggy, US$75 for a double and US$140 for a family vehicle.'
    : 'Los precios publicados de Punta Cana comienzan en US$40 para buggy individual, US$75 para doble y US$140 para familiar.';
}

function categoryGuidance(category: SearchLandingCategory, focus: string, destination: string, locale: SearchLandingLocale) {
  const en = locale === 'en';
  const guidance: Record<SearchLandingCategory, string> = en ? {
    terminology: `Travelers use “${focus}” to describe an off-road vehicle experience. The useful distinction is not the spelling but vehicle capacity, route, included transport and the operating conditions shown before payment.`,
    audience: `For ${focus}, the correct choice depends on passenger ages, how many people want to share each vehicle and who will drive. Capacity must be checked before calculating the total.`,
    timing: `A ${focus} request depends on vehicle availability, departure capacity, weather and the pickup route. A selectable date is a request until the team confirms the operating details.`,
    route: `A search for ${focus} should be answered with the actual route, not a generic Caribbean promise. Stops can change because of weather, access and daily operations.`,
    comparison: `${focus} is best decided by comparing driving time, passenger capacity, exposure to mud, route stops, transport and total price—not by choosing the most dramatic name.`,
    planning: `For ${focus}, prepare for an authentic off-road activity: uneven roads, dust or mud, water and changing tropical weather. Clear preparation avoids most preventable problems.`,
    booking: `${focus} should be evaluated with the final vehicle total, pickup zone, capacity and confirmation process visible. A low headline price is not enough if those conditions are unclear.`,
    pickup: `${focus} requires the exact accommodation name, zone, date and traveler count. The authorized point may be a lobby, tour area, security gate or nearby meeting point.`,
  } : {
    terminology: `Los viajeros usan “${focus}” para describir una experiencia en vehículo off-road. La diferencia útil no es la escritura, sino la capacidad, la ruta, el transporte incluido y las condiciones mostradas antes de pagar.`,
    audience: `Para ${focus}, la opción correcta depende de las edades, cuántas personas compartirán cada vehículo y quién conducirá. La capacidad debe comprobarse antes de calcular el total.`,
    timing: `Una solicitud ${focus} depende de vehículos, cupo de la tanda, clima y ruta de recogida. Poder seleccionar la fecha constituye una solicitud hasta recibir confirmación operativa.`,
    route: `Una búsqueda de ${focus} debe responderse con la ruta real, no con una promesa caribeña genérica. Las paradas pueden cambiar por clima, acceso y operación diaria.`,
    comparison: `${focus} se decide comparando tiempo de conducción, capacidad, exposición al lodo, paradas, transporte y precio total; no solamente el nombre más llamativo.`,
    planning: `Para ${focus}, prepárate para una actividad off-road auténtica: terreno irregular, polvo o lodo, agua y clima tropical variable. Una preparación clara evita la mayoría de inconvenientes.`,
    booking: `${focus} debe evaluarse viendo total por vehículo, zona de recogida, capacidad y proceso de confirmación. Un precio inicial bajo no basta si esas condiciones no están claras.`,
    pickup: `${focus} exige nombre exacto del alojamiento, zona, fecha y cantidad de viajeros. El punto autorizado puede ser lobby, área de tours, entrada de seguridad o encuentro cercano.`,
  };
  return `${guidance[category]} ${en ? `This page applies that decision specifically to ${destination}.` : `Esta página aplica esa decisión específicamente a ${destination}.`}`;
}

function makeCopy(category: SearchLandingCategory, destination: SearchLandingDestination, angle: Angle, locale: SearchLandingLocale, index: number): LocalizedCopy {
  const en = locale === 'en';
  const focus = angle[locale];
  const destinationName = destinationNames[destination][locale];
  const categoryLabel = searchCategoryLabels[locale][category];
  const titlePatterns: Record<SearchLandingCategory, string> = en ? {
    terminology: `${focus} in ${destinationName}: route, price and booking`, audience: `${destinationName} buggy tour for ${focus}`,
    timing: `${destinationName} buggy tour ${focus}: availability guide`, route: `${focus} on a ${destinationName} buggy route`,
    comparison: `${focus} in ${destinationName}: which option fits`, planning: `${focus} for a ${destinationName} buggy tour`,
    booking: `${focus} in ${destinationName}: clear booking guide`, pickup: `${destinationName} buggy tour with pickup ${focus}`,
  } : {
    terminology: `${focus} en ${destinationName}: ruta, precio y reserva`, audience: `Tour en buggy en ${destinationName} para ${focus}`,
    timing: `Buggy en ${destinationName} ${focus}: disponibilidad`, route: `${focus} en la ruta de buggy de ${destinationName}`,
    comparison: `${focus} en ${destinationName}: cuál elegir`, planning: `${focus} para un buggy en ${destinationName}`,
    booking: `${focus} en ${destinationName}: guía de reserva`, pickup: `Buggy en ${destinationName} con recogida ${focus}`,
  };
  const title = titlePatterns[category];
  const answer = categoryGuidance(category, focus, destinationName, locale);
  const route = routeFacts(destination, locale);
  const prices = priceFacts(destination, locale);
  const variant = index % 3;
  const sections = en ? [
    { title: `What “${focus}” means for this booking`, body: `${answer} ${variant === 0 ? 'Confirm the exact service rather than relying on a search label.' : variant === 1 ? 'Use the published vehicle details as the basis for the decision.' : 'The team can resolve any remaining operating question before payment.'}` },
    { title: `The actual ${destinationName} experience`, body: `${route} The order and availability of stops remain subject to safe access and the confirmed departure.` },
    { title: 'Vehicle and total-price decision', body: `${prices} Prices are per vehicle under the published capacity. The booking calculator checks how many vehicles the group needs and shows applicable zone charges before payment.` },
    { title: 'How to turn this search into a confirmed tour', body: `Select the correct destination and vehicle, enter the date, traveler count, hotel or meeting point and contact details. Caribbean Buggy then confirms availability and exact pickup instructions by WhatsApp or email.` },
  ] : [
    { title: `Qué significa “${focus}” para esta reserva`, body: `${answer} ${variant === 0 ? 'Confirma el servicio exacto en lugar de depender solamente del término buscado.' : variant === 1 ? 'Utiliza los datos publicados del vehículo como base de la decisión.' : 'El equipo puede resolver cualquier duda operativa restante antes del pago.'}` },
    { title: `La experiencia real de ${destinationName}`, body: `${route} El orden y disponibilidad de las paradas permanecen sujetos al acceso seguro y a la tanda confirmada.` },
    { title: 'Decisión de vehículo y precio total', body: `${prices} Los precios son por vehículo bajo la capacidad publicada. El calculador comprueba cuántos vehículos necesita el grupo y muestra suplementos de zona antes de pagar.` },
    { title: 'Cómo convertir esta búsqueda en un tour confirmado', body: `Selecciona destino y vehículo correctos, añade fecha, viajeros, hotel o punto de encuentro y datos de contacto. Caribbean Buggy confirma disponibilidad e instrucciones exactas por WhatsApp o correo.` },
  ];
  const checklist = en
    ? [`Confirm that ${focus} matches the service you expect`, `Choose Punta Cana or Bayahibe correctly`, 'Check seats and total vehicles', 'Wait for pickup and departure confirmation']
    : [`Confirmar que ${focus} corresponde al servicio esperado`, 'Elegir correctamente Punta Cana o Bayahibe', 'Comprobar plazas y vehículos totales', 'Esperar confirmación de recogida y tanda'];
  const faqs: Array<[string, string]> = en ? [
    [`Can I book ${focus} directly in ${destinationName}?`, 'Yes. Choose the matching buggy option, complete the booking details and wait for operating confirmation.'],
    [`Is the listed ${focus} price per person?`, 'No. Published prices are per vehicle according to its stated capacity.'],
    [`Is pickup included for this ${destinationName} option?`, 'Pickup or a confirmed meeting point is coordinated for the published operating zones. Enter the exact accommodation.'],
  ] : [
    [`¿Puedo reservar ${focus} directamente en ${destinationName}?`, 'Sí. Elige la modalidad correspondiente, completa los datos y espera la confirmación operativa.'],
    [`¿El precio publicado de ${focus} es por persona?`, 'No. Los precios publicados son por vehículo según su capacidad indicada.'],
    [`¿Incluye recogida esta opción de ${destinationName}?`, 'Se coordina recogida o punto de encuentro para las zonas operativas publicadas. Escribe el alojamiento exacto.'],
  ];
  const description = en
    ? `Clear ${focus} guide for ${destinationName}: actual route, vehicle price, capacity, pickup and secure direct booking.`
    : `Guía clara de ${focus} en ${destinationName}: ruta real, precio por vehículo, capacidad, recogida y reserva directa segura.`;
  return { slug: slugify(title), title, metaTitle: title.length > 62 ? `${focus} ${en ? 'in' : 'en'} ${destinationName} | Caribbean Buggy` : title, description, eyebrow: categoryLabel, answer, sections, checklist, faqs };
}

const categoryOrder = Object.keys(angles) as SearchLandingCategory[];

export const searchLandings: SearchLanding[] = categoryOrder.flatMap((category) =>
  angles[category].flatMap((angle, index) => (['punta-cana', 'bayahibe'] as SearchLandingDestination[]).map((destination) => ({
    id: `${category}-${destination}-${index + 1}`,
    category,
    destination,
    productId: destination === 'bayahibe' ? 'bayahibe-buggy-doble' : 'buggy-doble',
    image: destination === 'bayahibe' ? '/buggy/bayahibe/buggy-lodo-bayahibe.jpg' : '/buggy/doble.jpeg',
    es: makeCopy(category, destination, angle, 'es', index),
    en: makeCopy(category, destination, angle, 'en', index),
  }))),
);

export function searchLandingPath(landing: SearchLanding, locale: SearchLandingLocale) {
  return locale === 'en' ? `/en/excursions/${landing.en.slug}` : `/excursiones/${landing.es.slug}`;
}

export function searchLandingCanonical(landing: SearchLanding, locale: SearchLandingLocale) {
  return `${siteUrl}${searchLandingPath(landing, locale)}`;
}

export function searchLandingsPath(locale: SearchLandingLocale) {
  return locale === 'en' ? '/en/excursions' : '/excursiones';
}

export function getSearchLandingBySlug(slug: string, locale: SearchLandingLocale) {
  return searchLandings.find((landing) => landing[locale].slug === slug);
}

export function getRelatedSearchLandings(current: SearchLanding, limit = 8) {
  return searchLandings
    .filter((landing) => landing.id !== current.id)
    .sort((a, b) => {
      const score = (landing: SearchLanding) => Number(landing.destination === current.destination) * 2 + Number(landing.category === current.category) * 3;
      return score(b) - score(a);
    })
    .slice(0, limit);
}
