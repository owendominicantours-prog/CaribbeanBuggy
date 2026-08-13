export type BuggyProduct = {
  id: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  destination: string;
  routeLabel: string;
  durationLabel: string;
  subtitle: string;
  hook: string;
  description: string;
  longDescription: string;
  regular: number;
  promo: number;
  capacityLabel: string;
  capacityNumber: number;
  note: string;
  image: string;
  popular: boolean;
  included?: string[];
  requirements?: string[];
  bring?: string[];
  faqs?: Array<[string, string]>;
};

export const siteUrl = 'https://www.caribbeanboggie.com';
export const whatsappBase = 'https://wa.me/18294756298';
export const proactivitisPhone = '+1-829-475-6298';

export const pickupZones = [
  { label: 'Bavaro / Punta Cana', fee: 0 },
  { label: 'Cabeza de Toro', fee: 0 },
  { label: 'Cap Cana', fee: 10 },
  { label: 'Uvero Alto', fee: 15 },
  { label: 'Macao', fee: 0 },
  { label: 'Bayahibe / La Romana', fee: 0 },
  { label: 'Otra zona - confirmar por WhatsApp', fee: 0 },
];

export const products: BuggyProduct[] = [
  {
    id: 'buggy-individual',
    title: 'Buggy Individual',
    seoTitle: 'Tour en Buggy Individual Punta Cana | Mejor Precio',
    seoDescription:
      'Conduce tu propio buggy en Punta Cana. Tour individual off-road hacia Playa Macao y cenote desde 40 USD con recogida incluida.',
    destination: 'Punta Cana',
    routeLabel: 'Punta Cana, Macao y cenote',
    durationLabel: '4 horas con traslado',
    subtitle: '1 persona',
    hook: 'Para los amantes de la adrenalina pura.',
    description:
      'Toma el control absoluto del volante en un buggy todo terreno exclusivo para ti. Ideal para viajeros solos que quieren conducir durante toda la ruta, ensuciarse en el lodo y vivir Macao sin compartir el volante.',
    longDescription:
      'El Buggy Individual es la opcion para quien quiere manejar su propio vehiculo durante toda la ruta. Recorres caminos rurales de Macao, pasas por zonas de lodo, visitas un rancho dominicano, pruebas cafe, cacao y mamajuana, y disfrutas paradas en cenote y Playa Macao. Incluye recogida coordinada en hoteles principales de Bavaro, Punta Cana, Macao, Cabeza de Toro y zonas cercanas segun disponibilidad.',
    regular: 55,
    promo: 40,
    capacityLabel: '1 adulto',
    capacityNumber: 1,
    note: 'Precio por vehiculo',
    image: '/buggy/individual.jpeg',
    popular: false,
  },
  {
    id: 'buggy-doble',
    title: 'Buggy Doble',
    seoTitle: 'Excursion en Buggy Doble en Punta Cana | Oferta Especial',
    seoDescription:
      'Disfruta con tu pareja o amigo un tour en buggy doble en Punta Cana desde 75 USD por vehiculo, con recogida en el hotel incluida.',
    destination: 'Punta Cana',
    routeLabel: 'Punta Cana, Macao y cenote',
    durationLabel: '4 horas con traslado',
    subtitle: '2 personas',
    hook: 'Perfecto para parejas y amigos.',
    description:
      'La excursion mas popular de Punta Cana para parejas y amigos. Compartan la adrenalina, cambien de conductor si lo desean y exploren juntos caminos de lodo, rancho dominicano, cenote y Playa Macao.',
    longDescription:
      'El Buggy Doble combina precio, comodidad y diversion. Es ideal para parejas, amigos y viajeros que quieren vivir la ruta juntos sin pagar de mas por persona. Incluye transporte desde zonas principales, guia, parada cultural con cafe y cacao, cenote, Playa Macao y asistencia por WhatsApp antes de la recogida.',
    regular: 95,
    promo: 75,
    capacityLabel: 'Piloto + copiloto',
    capacityNumber: 2,
    note: 'Precio total por 2 pasajeros',
    image: '/buggy/doble.jpeg',
    popular: true,
  },
  {
    id: 'buggy-familiar',
    title: 'Buggy Familiar',
    seoTitle: 'Buggy Familiar en Punta Cana de 4 Plazas | Economico',
    seoDescription:
      'Reserva un buggy familiar de 4 plazas en Punta Cana desde 140 USD por vehiculo. Ruta por Macao, cenote, playa y recogida incluida.',
    destination: 'Punta Cana',
    routeLabel: 'Punta Cana, Macao y cenote',
    durationLabel: '4 horas con traslado',
    subtitle: 'hasta 4 personas',
    hook: 'Diversion para toda la familia.',
    description:
      'Nadie se queda atras. Viajen juntos en un buggy de 4 plazas para disfrutar lodo, cultura dominicana, cenote y Playa Macao en familia o grupo pequeno.',
    longDescription:
      'El Buggy Familiar permite que el grupo vaya en el mismo vehiculo. Es una opcion practica para familias, pequenos grupos y viajeros que quieren compartir la experiencia sin separarse. Incluye ruta guiada, casco, instrucciones de seguridad, recogida coordinada, rancho dominicano, cenote y parada en Playa Macao segun la operacion del dia.',
    regular: 180,
    promo: 140,
    capacityLabel: 'Hasta 4 personas',
    capacityNumber: 4,
    note: 'Precio total por las 4 plazas',
    image: '/buggy/familiar.jpeg',
    popular: false,
  },
  {
    id: 'bayahibe-buggy-individual',
    title: 'Bayahibe Buggy Individual',
    seoTitle: 'ATV/Buggy 4x4 en Bayahibe La Romana | 1 Persona',
    seoDescription:
      'Reserva ATV o buggy 4x4 en Bayahibe y La Romana para 1 persona desde 75 USD. Ruta off-road, entorno rural, asistencia local y pickup coordinado.',
    destination: 'Bayahibe / La Romana',
    routeLabel: 'Bayahibe, La Romana y Rio Chavon',
    durationLabel: '4 horas con traslado',
    subtitle: '1 persona',
    hook: 'Aventura privada para manejar tu propio buggy.',
    description:
      'Ideal para viajeros solos que quieren controlar el volante durante toda la ruta. Recorre caminos rurales de Bayahibe y La Romana, cruza tramos de lodo y disfruta una salida 4x4 con asistencia local.',
    longDescription:
      'El Bayahibe Buggy Individual esta pensado para una persona que desea manejar su propio vehiculo durante la experiencia. La ruta combina caminos rurales, zonas de vegetacion, ambiente local de La Romana y paradas operativas cerca del area de Bayahibe segun el dia. El equipo confirma por WhatsApp el punto de recogida o encuentro, el horario disponible y cualquier ajuste de operacion antes del tour.',
    regular: 85,
    promo: 75,
    capacityLabel: '1 adulto',
    capacityNumber: 1,
    note: 'Precio por vehiculo',
    image: '/buggy/bayahibe/buggy-canaveral-bayahibe.jpg',
    popular: false,
  },
  {
    id: 'bayahibe-buggy-doble',
    title: 'Bayahibe Buggy Doble',
    seoTitle: 'Buggy Doble en Bayahibe La Romana | 2 Personas',
    seoDescription:
      'Buggy doble en Bayahibe y La Romana para 2 personas desde 145 USD por vehiculo. Tour 4x4 con recogida coordinada y confirmacion por WhatsApp.',
    destination: 'Bayahibe / La Romana',
    routeLabel: 'Bayahibe, La Romana y Rio Chavon',
    durationLabel: '4 horas con traslado',
    subtitle: '2 personas',
    hook: 'La opcion mas comoda para parejas y amigos.',
    description:
      'Comparte la ruta con otra persona y cambia de conductor si lo desean. Una experiencia off-road en Bayahibe/La Romana con precio cerrado por vehiculo y coordinacion humana antes de salir.',
    longDescription:
      'El Bayahibe Buggy Doble es la opcion recomendada para parejas y amigos que quieren vivir la ruta juntos. Incluye coordinacion de recogida o punto de encuentro, instrucciones antes de manejar, ruta rural 4x4 y soporte por WhatsApp. El recorrido puede variar por clima, trafico local y condiciones del camino, siempre manteniendo una operacion segura y organizada.',
    regular: 160,
    promo: 145,
    capacityLabel: 'Piloto + copiloto',
    capacityNumber: 2,
    note: 'Precio total por 2 pasajeros',
    image: '/buggy/bayahibe/buggy-lodo-bayahibe.jpg',
    popular: true,
  },
  {
    id: 'bayahibe-buggy-familiar',
    title: 'Bayahibe Buggy Familiar',
    seoTitle: 'Buggy Familiar en Bayahibe La Romana | Hasta 4 Personas',
    seoDescription:
      'Reserva buggy familiar en Bayahibe y La Romana para hasta 4 personas desde 290 USD por vehiculo. Ruta off-road con pickup coordinado.',
    destination: 'Bayahibe / La Romana',
    routeLabel: 'Bayahibe, La Romana y Rio Chavon',
    durationLabel: '4 horas con traslado',
    subtitle: 'hasta 4 personas',
    hook: 'Una salida 4x4 para disfrutar juntos.',
    description:
      'Opcion practica para familias o grupos pequenos que quieren ir en el mismo buggy. Precio cerrado por las plazas, ruta rural, asistencia local y confirmacion antes de la recogida.',
    longDescription:
      'El Bayahibe Buggy Familiar permite que hasta cuatro personas compartan el mismo vehiculo durante la experiencia. Es una alternativa conveniente para familias, amigos y grupos pequenos que quieren vivir Bayahibe y La Romana sin separarse. Incluye asistencia del equipo, instrucciones de seguridad, coordinacion del pickup y seguimiento por WhatsApp antes y despues de la reserva.',
    regular: 320,
    promo: 290,
    capacityLabel: 'Hasta 4 personas',
    capacityNumber: 4,
    note: 'Precio total por las 4 plazas',
    image: '/buggy/bayahibe/grupo-buggies-bayahibe.jpg',
    popular: false,
  },
];

export const included = [
  'Transporte ida y vuelta al hotel',
  'Buggy segun modalidad elegida',
  'Casco y equipo de seguridad',
  'Guia oficial multilingue',
  'Degustacion de cafe, cacao y mamajuana',
  'Parada en cenote privado',
  'Visita a Playa Macao',
  'Asistencia durante la ruta',
];

export const requirements = [
  'El conductor debe ser mayor de 18 anos y saber conducir.',
  'Edad minima para ninos acompanantes: 3 anos.',
  'No apto para mujeres embarazadas o personas con problemas severos de espalda.',
];

export const bring = [
  'Ropa vieja que se pueda manchar.',
  'Traje de bano y toalla.',
  'Protector solar biodegradable y gafas de sol.',
  'Efectivo opcional para fotos, bebidas o souvenirs.',
];

export const faqs = [
  ['El precio es por persona o por vehiculo?', 'El precio publicado es por vehiculo segun la modalidad: individual, doble o familiar.'],
  ['Incluye recogida en hotel?', 'Si, incluye recogida y regreso en hoteles de zonas principales de Bavaro y Punta Cana.'],
  ['Visitamos Playa Macao?', 'Si, la ruta incluye tiempo en Playa Macao y parada para cenote, sujeto a condiciones operativas del dia.'],
  ['Me voy a ensuciar?', 'Si. Es una aventura off-road con lodo, caminos rurales y agua. Recomendamos ropa vieja.'],
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function whatsappHref(message: string) {
  return `${whatsappBase}?text=${encodeURIComponent(message)}`;
}

export function calculateBookingTotal({
  product,
  passengers,
  pickupZone,
  photos,
  privatePickup,
}: {
  product: BuggyProduct;
  passengers: number;
  pickupZone: string;
  photos: boolean;
  privatePickup: boolean;
}) {
  const selectedZone = pickupZones.find((zone) => zone.label === pickupZone) ?? pickupZones[0];
  const safePassengers = Math.max(1, Math.min(20, Math.floor(passengers || product.capacityNumber)));
  const vehicles = Math.max(1, Math.ceil(safePassengers / product.capacityNumber));
  const baseTotal = vehicles * product.promo;
  const zoneFee = selectedZone.fee;
  const photosFee = photos ? 25 : 0;
  const privatePickupFee = privatePickup ? 30 : 0;

  return {
    passengers: safePassengers,
    vehicles,
    baseTotal,
    zoneFee,
    photosFee,
    privatePickupFee,
    total: baseTotal + zoneFee + photosFee + privatePickupFee,
  };
}

export function createBookingReference() {
  return `CB-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}
