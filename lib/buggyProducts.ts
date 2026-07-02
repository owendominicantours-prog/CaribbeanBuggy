export type BuggyProduct = {
  id: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
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
};

export const siteUrl = 'https://caribbeanbuggy.com';
export const whatsappBase = 'https://wa.me/18294756298';
export const proactivitisPhone = '+1-829-475-6298';

export const products: BuggyProduct[] = [
  {
    id: 'buggy-individual',
    title: 'Buggy Individual',
    seoTitle: 'Tour en Buggy Individual Punta Cana | Mejor Precio',
    seoDescription:
      'Conduce tu propio buggy en Punta Cana. Tour individual off-road hacia Playa Macao y cenote desde 35 USD con recogida incluida.',
    subtitle: '1 persona',
    hook: 'Para los amantes de la adrenalina pura.',
    description:
      'Toma el control absoluto del volante en un buggy todo terreno exclusivo para ti.',
    longDescription:
      'El Buggy Individual es la opcion para quien quiere manejar su propio vehiculo durante toda la ruta. Recorres caminos rurales de Macao, pasas por zonas de lodo, visitas un rancho dominicano, pruebas cafe y cacao, y disfrutas paradas en cenote y Playa Macao.',
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
      'Disfruta con tu pareja o amigo del mejor tour en buggy doble en Punta Cana por 49 USD por vehiculo, con hotel pickup incluido.',
    subtitle: '2 personas',
    hook: 'Perfecto para parejas y amigos.',
    description:
      'La excursion mas popular de Punta Cana para compartir adrenalina y cambiar de conductor si lo desean.',
    longDescription:
      'El Buggy Doble combina precio, comodidad y diversion. Es ideal para parejas, amigos y viajeros que quieren vivir la ruta juntos. Incluye transporte desde zonas principales, guia, parada cultural, cenote y Playa Macao.',
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
      'Reserva buggy familiar de 4 plazas en Punta Cana por 79 USD. Ruta por Macao, cenote, playa y recogida incluida.',
    subtitle: 'hasta 4 personas',
    hook: 'Diversion para toda la familia.',
    description:
      'Viajen juntos en un buggy de 4 plazas para disfrutar lodo, cultura dominicana, cenote y Playa Macao.',
    longDescription:
      'El Buggy Familiar permite que el grupo vaya en el mismo vehiculo. Es una opcion practica para familias, pequenos grupos y viajeros que quieren compartir la experiencia sin separarse. Incluye ruta guiada, seguridad, recogida y paradas principales.',
    regular: 180,
    promo: 140,
    capacityLabel: 'Hasta 4 personas',
    capacityNumber: 4,
    note: 'Precio total por las 4 plazas',
    image: '/buggy/familiar.jpeg',
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
