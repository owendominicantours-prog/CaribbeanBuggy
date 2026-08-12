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
  { name: 'Occidental Punta Cana', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida coordinada en el area principal de tours.' },
  { name: 'Live Aqua Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Uvero Alto puede requerir suplemento de zona.' },
  { name: 'Catalonia Royal Bavaro', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en acceso autorizado para excursiones.' },
  { name: 'Catalonia Bavaro Beach', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en lobby principal o punto externo indicado por seguridad.' },
  { name: 'Lopesan Costa Bavaro Resort Spa & Casino', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Salida desde lobby de excursiones con confirmacion previa.' },
  { name: 'Majestic Elegance Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en lobby de tours del complejo Majestic.' },
  { name: 'Majestic Colonial Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Punto de recogida confirmado por WhatsApp antes del tour.' },
  { name: 'Majestic Mirage Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida coordinada con nombre de reserva y habitacion si aplica.' },
  { name: 'Riu Republica', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en punto autorizado para excursiones del complejo Riu.' },
  { name: 'Riu Palace Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Pickup en el lobby o punto de transporte compartido del hotel.' },
  { name: 'Riu Palace Bavaro', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Confirmamos hora exacta segun tanda y logistica del dia.' },
  { name: 'Riu Bambu', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida disponible con confirmacion previa por WhatsApp.' },
  { name: 'Bahia Principe Grand Bavaro', zone: 'Bavaro', driveTime: '25-35 min', pickupNote: 'Puede indicarse punto de lobby segun el hotel dentro del complejo.' },
  { name: 'Bahia Principe Luxury Ambar', zone: 'Bavaro', driveTime: '25-35 min', pickupNote: 'Recogida en area autorizada para tours dentro del complejo.' },
  { name: 'Grand Palladium Bavaro Suites Resort & Spa', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'El punto exacto se confirma al completar la reserva.' },
  { name: 'TRS Turquesa Hotel', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida coordinada dentro del complejo Palladium.' },
  { name: 'Barcelo Bavaro Palace', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby o punto externo indicado por el hotel.' },
  { name: 'Barcelo Bavaro Beach', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Confirmamos el punto exacto despues del pago seguro.' },
  { name: 'Melia Caribe Beach Resort', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Salida desde lobby de excursiones o punto de seguridad.' },
  { name: 'Paradisus Palma Real Golf & Spa Resort', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida privada o compartida segun opcion elegida.' },
  { name: 'Paradisus Grand Cana', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Coordinamos hora y punto antes de la salida.' },
  { name: 'Secrets Royal Beach Punta Cana', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby principal con asistencia por WhatsApp.' },
  { name: 'Breathless Punta Cana Resort & Spa', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Uvero Alto puede aplicar suplemento de recogida.' },
  { name: 'Dreams Onyx Resort & Spa', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida coordinada en lobby de tours de Uvero Alto.' },
  { name: 'Dreams Macao Beach Punta Cana', zone: 'Macao', driveTime: '15-25 min', pickupNote: 'Muy cerca de la ruta de buggy; confirmamos tanda disponible.' },
  { name: 'Dreams Royal Beach Punta Cana', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida disponible en zona Bavaro sin suplemento.' },
  { name: 'Excellence Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Recogida en Uvero Alto con confirmacion de horario exacto.' },
  { name: 'Finest Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Confirmamos punto autorizado dentro del complejo.' },
  { name: 'Excellence El Carmen', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Uvero Alto puede aplicar suplemento de zona.' },
  { name: 'Hyatt Ziva Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana requiere coordinacion de acceso y puede aplicar suplemento.' },
  { name: 'Hyatt Zilara Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Recogida con punto de seguridad confirmado por WhatsApp.' },
  { name: 'Sanctuary Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Cap Cana se coordina con acceso autorizado.' },
  { name: 'Margaritaville Island Reserve Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Confirmamos punto de entrada y horario antes del tour.' },
  { name: 'Eden Roc Cap Cana', zone: 'Cap Cana', driveTime: '35-45 min', pickupNote: 'Recogida premium disponible bajo confirmacion.' },
  { name: 'Iberostar Selection Bavaro Suites', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby o punto del complejo Iberostar.' },
  { name: 'Iberostar Grand Bavaro', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Salida coordinada desde lobby principal.' },
  { name: 'Punta Cana Princess Adults Only', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby del hotel con confirmacion por WhatsApp.' },
  { name: 'Caribe Deluxe Princess', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en area autorizada para excursiones.' },
  { name: 'Tropical Deluxe Princess', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Confirmamos hora exacta segun tanda elegida.' },
  { name: 'whala!bavaro', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida disponible en Bavaro con instrucciones claras.' },
  { name: 'Vista Sol Punta Cana Beach Resort & Spa', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Punto de recogida confirmado despues de reservar.' },
  { name: 'Impressive Punta Cana', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en lobby principal o punto autorizado.' },
  { name: 'Jewel Palm Beach', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida en Cabeza de Toro con confirmacion previa.' },
  { name: 'Serenade Punta Cana Beach & Spa Resort', zone: 'Cabeza de Toro', driveTime: '25-35 min', pickupNote: 'Recogida coordinada desde acceso de tours.' },
  { name: 'Nickelodeon Hotels & Resorts Punta Cana', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Uvero Alto requiere confirmacion de horario y zona.' },
  { name: 'Royalton Bavaro Resort & Spa', zone: 'Bavaro', driveTime: '25-35 min', pickupNote: 'Recogida en punto de excursiones del resort.' },
  { name: 'Royalton Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Confirmamos punto dentro del complejo Royalton.' },
  { name: 'Royalton Splash Punta Cana', zone: 'Arena Gorda', driveTime: '25-35 min', pickupNote: 'Recogida en lobby o punto compartido autorizado.' },
  { name: 'Ocean Blue & Sand', zone: 'Bavaro', driveTime: '20-30 min', pickupNote: 'Recogida en hotel con asistencia antes del tour.' },
  { name: 'Ocean El Faro', zone: 'Uvero Alto', driveTime: '35-45 min', pickupNote: 'Uvero Alto puede requerir suplemento de zona.' },
  { name: 'The Westin Puntacana Resort & Club', zone: 'Punta Cana', driveTime: '30-40 min', pickupNote: 'Recogida en zona Puntacana con confirmacion previa.' },
  { name: 'Club Med Punta Cana', zone: 'Punta Cana', driveTime: '30-40 min', pickupNote: 'Confirmamos acceso y punto de tours antes de salir.' },
  { name: 'Hilton La Romana All-Inclusive Resort', zone: 'Bayahibe / La Romana', driveTime: '20-30 min', pickupNote: 'Recogida coordinada en lobby o punto de excursiones del resort.' },
  { name: 'Dreams Dominicus La Romana', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Pickup rapido desde Dominicus con horario confirmado por WhatsApp.' },
  { name: 'Viva Dominicus Beach by Wyndham', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en el punto autorizado de tours del complejo Viva.' },
  { name: 'Viva Dominicus Palace by Wyndham', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Coordinamos lobby y hora exacta segun la tanda disponible.' },
  { name: 'Catalonia Bayahibe', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en acceso principal o punto de excursiones confirmado.' },
  { name: 'Catalonia Royal La Romana', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Pickup para adultos con instrucciones claras antes de salir.' },
  { name: 'Iberostar Selection Hacienda Dominicus', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en lobby de tours con asistencia por WhatsApp.' },
  { name: 'Tracadero Beach Club & Holidays Rentals', zone: 'Bayahibe', driveTime: '8-15 min', pickupNote: 'Recogida cercana en Bayahibe con punto exacto confirmado.' },
  { name: 'Cadaques Caribe Resort & Villas', zone: 'Dominicus / Bayahibe', driveTime: '12-20 min', pickupNote: 'Coordinamos acceso del complejo y hora de salida.' },
  { name: 'HM Alma de Bayahibe', zone: 'Bayahibe', driveTime: '8-15 min', pickupNote: 'Pickup en recepcion o punto cercano autorizado.' },
  { name: 'whala!bayahibe', zone: 'Bayahibe', driveTime: '8-15 min', pickupNote: 'Recogida sencilla desde Bayahibe con confirmacion previa.' },
  { name: 'Hotel Bayahibe', zone: 'Bayahibe town', driveTime: '8-15 min', pickupNote: 'Punto de encuentro facil en el centro de Bayahibe.' },
  { name: 'Villa Iguana Bayahibe', zone: 'Bayahibe town', driveTime: '8-15 min', pickupNote: 'Coordinamos recogida cercana para evitar esperas.' },
  { name: 'Alkquimia Hotel Lounge and Bar', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en recepcion o punto de tours indicado.' },
  { name: 'Los Flamencos Aparthotel', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Pickup en Dominicus con soporte antes de la actividad.' },
  { name: 'Hotel El Eden Bayahibe', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida coordinada con nombre de reserva y horario.' },
  { name: 'Sunscape Dominicus La Romana', zone: 'Dominicus / Bayahibe', driveTime: '10-18 min', pickupNote: 'Recogida en lobby o punto autorizado del resort.' },
  { name: 'Hilton Garden Inn La Romana', zone: 'La Romana', driveTime: '25-35 min', pickupNote: 'Salida desde La Romana con confirmacion de ruta y horario.' },
  { name: 'Casa de Campo Resort & Villas', zone: 'La Romana', driveTime: '30-40 min', pickupNote: 'Coordinamos acceso de Casa de Campo y punto autorizado.' },
  { name: 'Bahia Principe Luxury Bouganville', zone: 'La Romana', driveTime: '35-45 min', pickupNote: 'Recogida en lobby de excursiones con asistencia previa.' },
  { name: 'Bahia Principe Grand La Romana', zone: 'La Romana', driveTime: '35-45 min', pickupNote: 'Confirmamos punto de salida segun acceso del complejo.' },
];

export const hotelBuggyLandings: HotelBuggyLanding[] = hotelNames.map((hotel) => ({
  ...hotel,
  slug: slugify(hotel.name),
}));

export function getHotelBuggyLanding(slug: string) {
  return hotelBuggyLandings.find((hotel) => hotel.slug === slug);
}

export function hotelBuggyPath(slug: string, locale: 'es' | 'en' = 'es') {
  return `/${locale}/buggy-tour/${slug}`;
}

export function hotelBuggyUrl(slug: string, locale: 'es' | 'en' = 'es') {
  return `${siteUrl}${hotelBuggyPath(slug, locale)}`;
}
