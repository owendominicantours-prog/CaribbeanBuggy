import { siteUrl } from './buggyProducts';

export type HotelBuggyLanding = {
  slug: string;
  name: string;
  zone: string;
  driveTime: string;
  pickupNote: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const hotelNames: Array<Omit<HotelBuggyLanding, 'slug'>> = [
  { name: 'Hard Rock Hotel & Casino Punta Cana', zone: 'Macao / Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en lobby o punto de tours confirmado por el hotel.' },
  { name: 'Occidental Punta Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida coordinada en el área principal de tours.' },
  { name: 'Live Aqua Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Catalonia Royal Bavaro', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en acceso autorizado para excursiones.' },
  { name: 'Catalonia Bavaro Beach', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en lobby principal o punto externo indicado por seguridad.' },
  { name: 'Lopesan Costa Bavaro Resort Spa & Casino', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Salida desde lobby de excursiones con confirmación previa.' },
  { name: 'Majestic Elegance Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en lobby de tours del complejo Majestic.' },
  { name: 'Majestic Colonial Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Punto de recogida confirmado por WhatsApp antes del tour.' },
  { name: 'Majestic Mirage Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida coordinada con nombre de reserva y habitación si aplica.' },
  { name: 'Riu Republica', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en punto autorizado para excursiones del complejo Riu.' },
  { name: 'Riu Palace Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Pickup en el lobby o punto de transporte compartido del hotel.' },
  { name: 'Riu Palace Bavaro', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Confirmamos hora exacta según tanda y logística del día.' },
  { name: 'Riu Bambu', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida disponible con confirmación previa por WhatsApp.' },
  { name: 'Bahia Principe Grand Bavaro', zone: 'Bávaro', driveTime: '25-35 min', pickupNote: 'Puede indicarse punto de lobby según el hotel dentro del complejo.' },
  { name: 'Bahia Principe Luxury Ambar', zone: 'Bávaro', driveTime: '25-35 min', pickupNote: 'Recogida en área autorizada para tours dentro del complejo.' },
  { name: 'Grand Palladium Bavaro Suites Resort & Spa', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'El punto exacto se confirma al completar la reserva.' },
  { name: 'TRS Turquesa Hotel', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida coordinada dentro del complejo Palladium.' },
  { name: 'Barcelo Bavaro Palace', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby o punto externo indicado por el hotel.' },
  { name: 'Barcelo Bavaro Beach', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Confirmamos el punto exacto después del pago seguro.' },
  { name: 'Melia Caribe Beach Resort', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Salida desde lobby de excursiones o punto de seguridad.' },
  { name: 'Paradisus Palma Real Golf & Spa Resort', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida privada o compartida según opción elegida.' },
  { name: 'Paradisus Grand Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Coordinamos hora y punto antes de la salida.' },
  { name: 'Secrets Royal Beach Punta Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby principal con asistencia por WhatsApp.' },
  { name: 'Breathless Punta Cana Resort & Spa', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Dreams Onyx Resort & Spa', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida coordinada en lobby de tours de Uvero Alto.' },
  { name: 'Dreams Macao Beach Punta Cana', zone: 'Macao', driveTime: '15-25 min', pickupNote: 'Muy cerca de la ruta de buggy; confirmamos tanda disponible.' },
  { name: 'Dreams Royal Beach Punta Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida disponible en zona Bávaro sin suplemento.' },
  { name: 'Excellence Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida en Uvero Alto con confirmación de horario exacto.' },
  { name: 'Finest Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Confirmamos punto autorizado dentro del complejo.' },
  { name: 'Excellence El Carmen', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Hyatt Ziva Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana requiere coordinación de acceso y puede aplicar suplemento.' },
  { name: 'Hyatt Zilara Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Recogida con punto de seguridad confirmado por WhatsApp.' },
  { name: 'Sanctuary Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana se coordina con acceso autorizado.' },
  { name: 'Margaritaville Island Reserve Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Confirmamos punto de entrada y horario antes del tour.' },
  { name: 'Eden Roc Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Recogida premium disponible bajo confirmación.' },
  { name: 'Iberostar Selection Bavaro Suites', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby o punto del complejo Iberostar.' },
  { name: 'Iberostar Grand Bavaro', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Salida coordinada desde lobby principal.' },
  { name: 'Punta Cana Princess Adults Only', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby del hotel con confirmación por WhatsApp.' },
  { name: 'Caribe Deluxe Princess', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en área autorizada para excursiones.' },
  { name: 'Tropical Deluxe Princess', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Confirmamos hora exacta según tanda elegida.' },
  { name: 'whala!bavaro', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida disponible en Bávaro con instrucciones claras.' },
  { name: 'Vista Sol Punta Cana Beach Resort & Spa', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Punto de recogida confirmado después de reservar.' },
  { name: 'Impressive Punta Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby principal o punto autorizado.' },
  { name: 'Jewel Palm Beach', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en Cabeza de Toro con confirmación previa.' },
  { name: 'Serenade Punta Cana Beach & Spa Resort', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida coordinada desde acceso de tours.' },
  { name: 'Nickelodeon Hotels & Resorts Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Uvero Alto requiere confirmación de horario y zona.' },
  { name: 'Royalton Bavaro Resort & Spa', zone: 'Bávaro', driveTime: '25-35 min', pickupNote: 'Recogida en punto de excursiones del resort.' },
  { name: 'Royalton Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Confirmamos punto dentro del complejo Royalton.' },
  { name: 'Royalton Splash Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en lobby o punto compartido autorizado.' },
  { name: 'Ocean Blue & Sand', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en hotel con asistencia antes del tour.' },
  { name: 'Ocean El Faro', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'The Westin Puntacana Resort & Club', zone: 'Punta Cana', driveTime: '30-40 min', pickupNote: 'Sin recogida en este alojamiento: punto de encuentro en el KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.' },
  { name: 'Club Med Punta Cana', zone: 'Punta Cana', driveTime: '30-40 min', pickupNote: 'Sin recogida en este alojamiento: punto de encuentro en el KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.' },
  { name: 'Riu Palace Macao', zone: 'Macao / Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en el punto de excursiones del complejo Riu.' },
  { name: 'Riu Naiboa', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en el punto autorizado de tours del complejo Riu.' },
  { name: 'Bahia Principe Grand Punta Cana', zone: 'Bávaro', driveTime: '25-35 min', pickupNote: 'Recogida en el área de excursiones del complejo Bahía Príncipe.' },
  { name: 'Bahia Principe Grand Turquesa', zone: 'Bávaro', driveTime: '25-35 min', pickupNote: 'Recogida en el área de excursiones del complejo Bahía Príncipe.' },
  { name: 'Bahia Principe Luxury Esmeralda', zone: 'Bávaro', driveTime: '25-35 min', pickupNote: 'Recogida en el lobby o en el punto de tours indicado por el hotel.' },
  { name: 'Grand Palladium Punta Cana Resort & Spa', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida coordinada dentro del complejo Palladium.' },
  { name: 'Grand Palladium Palace Resort Spa & Casino', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida coordinada dentro del complejo Palladium.' },
  { name: 'Melia Punta Cana Beach Resort', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el lobby principal con confirmación por WhatsApp.' },
  { name: 'Occidental Caribe', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el área de excursiones del hotel.' },
  { name: 'Iberostar Waves Dominicana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el lobby o punto del complejo Iberostar.' },
  { name: 'Iberostar Waves Punta Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el lobby o punto del complejo Iberostar.' },
  { name: 'Be Live Collection Punta Cana', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el lobby principal; confirmamos la hora por WhatsApp.' },
  { name: 'Grand Bavaro Princess', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el punto de tours del complejo Princess.' },
  { name: 'Bavaro Princess All Suites Resort Spa & Casino', zone: 'Bávaro', driveTime: '20-30 min', pickupNote: 'Recogida en el punto de tours del complejo Princess.' },
  { name: 'Natura Park Beach Eco Resort & Spa', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en Cabeza de Toro con confirmación previa.' },
  { name: 'Grand Sirenis Punta Cana Resort', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Sirenis Cocotal Beach Resort', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Zoetry Agua Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida en Uvero Alto con confirmación del horario exacto.' },
  { name: 'Secrets Tides Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Dreams Flora Resort & Spa', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en Cabeza de Toro con confirmación previa.' },
  { name: 'Dreams Punta Cana Resort & Spa', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida y regreso incluidos desde Uvero Alto, sin suplemento de zona.' },
  { name: 'Sivory Punta Cana Boutique Hotel', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida en Uvero Alto con confirmación previa por WhatsApp.' },
  { name: 'TRS Cap Cana Waterfront & Marina Hotel', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana requiere coordinación de acceso y puede aplicar suplemento.' },
  { name: 'Secrets Cap Cana Resort & Spa', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana requiere coordinación de acceso y puede aplicar suplemento.' },
  { name: 'Dreams Cap Cana Resort & Spa', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana requiere coordinación de acceso y puede aplicar suplemento.' },
  { name: 'Tortuga Bay Puntacana Resort & Club', zone: 'Punta Cana', driveTime: '30-40 min', pickupNote: 'Sin recogida en este alojamiento: punto de encuentro en el KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.' },
  { name: 'Four Points by Sheraton Punta Cana Village', zone: 'Punta Cana', driveTime: '30-40 min', pickupNote: 'Sin recogida en este alojamiento: punto de encuentro en el KFC de Downtown, cerca de Coco Bongo. Confirmaremos la hora exacta de encuentro en el KFC para tu turno antes de la actividad.' },
  { name: 'Hilton La Romana All-Inclusive Resort', zone: 'Bayahibe / La Romana', driveTime: '20-30 min', pickupNote: 'Recogida coordinada en lobby o punto de excursiones del resort.' },
  { name: 'Dreams Dominicus La Romana', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Pickup rápido desde Dominicus con horario confirmado por WhatsApp.' },
  { name: 'Viva Dominicus Beach by Wyndham', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en el punto autorizado de tours del complejo Viva.' },
  { name: 'Viva Dominicus Palace by Wyndham', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Coordinamos lobby y hora exacta según la tanda disponible.' },
  { name: 'Catalonia Bayahibe', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en acceso principal o punto de excursiones confirmado.' },
  { name: 'Catalonia Royal La Romana', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Pickup para adultos con instrucciones claras antes de salir.' },
  { name: 'Iberostar Selection Hacienda Dominicus', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en lobby de tours con asistencia por WhatsApp.' },
  { name: 'Tracadero Beach Club & Holidays Rentals', zone: 'Bayahibe', driveTime: '8-15 min', pickupNote: 'Recogida cercana en Bayahibe con punto exacto confirmado.' },
  { name: 'Cadaques Caribe Resort & Villas', zone: 'Dominicus / Bayahibe', driveTime: '12-20 min', pickupNote: 'Coordinamos acceso del complejo y hora de salida.' },
  { name: 'HM Alma de Bayahibe', zone: 'Bayahibe', driveTime: '8-15 min', pickupNote: 'Pickup en recepción o punto cercano autorizado.' },
  { name: 'whala!bayahibe', zone: 'Bayahibe', driveTime: '8-15 min', pickupNote: 'Recogida sencilla desde Bayahibe con confirmación previa.' },
  { name: 'Hotel Bayahibe', zone: 'Bayahibe town', driveTime: '8-15 min', pickupNote: 'Punto de encuentro fácil en el centro de Bayahibe.' },
  { name: 'Villa Iguana Bayahibe', zone: 'Bayahibe town', driveTime: '8-15 min', pickupNote: 'Coordinamos recogida cercana para evitar esperas.' },
  { name: 'Alkquimia Hotel Lounge and Bar', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en recepción o punto de tours indicado.' },
  { name: 'Los Flamencos Aparthotel', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Pickup en Dominicus con soporte antes de la actividad.' },
  { name: 'Hotel El Eden Bayahibe', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida coordinada con nombre de reserva y horario.' },
  { name: 'Sunscape Dominicus La Romana', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en lobby o punto autorizado del resort.' },
  { name: 'Hilton Garden Inn La Romana', zone: 'La Romana', driveTime: '25-35 min', pickupNote: 'Salida desde La Romana con confirmación de ruta y horario.' },
  { name: 'Casa de Campo Resort & Villas', zone: 'La Romana', driveTime: '30-40 min', pickupNote: 'Coordinamos acceso de Casa de Campo y punto autorizado.' },
  { name: 'Bahia Principe Luxury Bouganville', zone: 'La Romana', driveTime: '35-45 min', pickupNote: 'Recogida en lobby de excursiones con asistencia previa.' },
  { name: 'Bahia Principe Grand La Romana', zone: 'La Romana', driveTime: '35-45 min', pickupNote: 'Confirmamos punto de salida según acceso del complejo.' },
];

export const hotelBuggyLandings: HotelBuggyLanding[] = hotelNames.map((hotel) => ({
  ...hotel,
  slug: slugify(hotel.name),
}));

// Owner policy 20 Nov 2026: no accommodation pickup in Verón or the Punta Cana area next to PUJ airport.
// These stays meet at KFC Downtown (near Coco Bongo). Titles, H1 and URLs stay unchanged.
export function isMeetingPointHotel(hotel: HotelBuggyLanding) {
  return hotel.zone === 'Punta Cana';
}

export function isBayahibeHotel(hotel: HotelBuggyLanding) {
  return /bayahibe|dominicus|la romana/i.test(`${hotel.name} ${hotel.zone}`);
}

export function getFeaturedHotelBuggyLandings() {
  const puntaCana = hotelBuggyLandings.filter((hotel) => !isBayahibeHotel(hotel)).slice(0, 18);
  const bayahibe = hotelBuggyLandings.filter(isBayahibeHotel).slice(0, 6);
  return [...puntaCana, ...bayahibe];
}

export function getRelatedHotelBuggyLandings(current: HotelBuggyLanding, limit = 10) {
  const sameDestination = hotelBuggyLandings.filter(
    (hotel) => hotel.slug !== current.slug && isBayahibeHotel(hotel) === isBayahibeHotel(current),
  );
  const destinationWithCurrent = hotelBuggyLandings.filter(
    (hotel) => isBayahibeHotel(hotel) === isBayahibeHotel(current),
  );
  const currentIndex = destinationWithCurrent.findIndex((hotel) => hotel.slug === current.slug);
  const ordered: HotelBuggyLanding[] = [];
  const add = (hotel: HotelBuggyLanding | undefined) => {
    if (hotel && hotel.slug !== current.slug && !ordered.some((item) => item.slug === hotel.slug)) ordered.push(hotel);
  };

  // Keep every landing connected to its neighbors, then prioritize hotels in the same pickup zone.
  for (let distance = 1; distance <= 3; distance += 1) {
    add(destinationWithCurrent[(currentIndex + distance) % destinationWithCurrent.length]);
    add(destinationWithCurrent[(currentIndex - distance + destinationWithCurrent.length) % destinationWithCurrent.length]);
  }
  sameDestination.filter((hotel) => hotel.zone === current.zone).forEach(add);
  sameDestination.forEach(add);

  return ordered.slice(0, limit);
}

export function getHotelBuggyLanding(slug: string) {
  return hotelBuggyLandings.find((hotel) => hotel.slug === slug);
}

export function hotelBuggyPath(slug: string, locale: 'es' | 'en' = 'es') {
  return `/${locale}/buggy-tour/${slug}`;
}

export function hotelBuggyUrl(slug: string, locale: 'es' | 'en' = 'es') {
  return `${siteUrl}${hotelBuggyPath(slug, locale)}`;
}
