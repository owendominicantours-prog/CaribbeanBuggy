// Real photos of the Punta Cana / Macao buggy operation (owner folder FOTOS EXCURSIONES/buggy, 22 Nov 2026).
// Excluded on purpose: ATVs, Polaris RZR, other operators' photos and montages. Not the same set as Buggy & Cenote (web07).
export type SitePhoto = { src: string; es: string; en: string; width: number; height: number };

export const puntaCanaPhotos: SitePhoto[] = [
  { src: '/buggy/galeria/buggy-azul-charco-punta-cana.webp', es: 'Buggy azul atravesando un charco de lodo en Punta Cana', en: 'Blue buggy splashing through a mud puddle in Punta Cana', width: 1290, height: 788 },
  { src: '/buggy/galeria/cenote-tour-buggy-punta-cana.webp', es: 'Viajeras bañándose en el cenote durante el tour en buggy', en: 'Travelers swimming in the cenote during the buggy tour', width: 1600, height: 1059 },
  { src: '/buggy/galeria/playa-macao-caribbean-buggy.webp', es: 'Viajero saltando en la orilla de Playa Macao', en: 'Traveler jumping on the shore of Macao Beach', width: 1060, height: 1600 },
  { src: '/buggy/galeria/buggy-doble-verde-pareja-punta-cana.webp', es: 'Pareja en un buggy doble verde lista para salir', en: 'Couple in a green double buggy ready to ride', width: 1600, height: 1059 },
  { src: '/buggy/galeria/buggy-familiar-ninos-lodo-macao.webp', es: 'Buggy cubierto de lodo con un niño como acompañante en Macao', en: 'Mud-covered buggy with a child riding along in Macao', width: 1600, height: 1060 },
  { src: '/buggy/galeria/buggy-verde-camino-macao.webp', es: 'Buggy verde en un camino rural de Macao', en: 'Green buggy on a rural road in Macao', width: 1232, height: 816 },
  { src: '/buggy/galeria/buggy-verde-grupo-punta-cana.webp', es: 'Viajeros saludando desde un buggy verde', en: 'Travelers waving from a green buggy', width: 1600, height: 1059 },
  { src: '/buggy/galeria/buggy-arena-lodo-rancho-macao.webp', es: 'Buggy lleno de barro en los caminos de tierra de Macao', en: 'Buggy covered in mud on the dirt trails of Macao', width: 1279, height: 847 },
  { src: '/buggy/galeria/buggy-naranja-carretera-macao.webp', es: 'Buggy naranja en la carretera hacia Macao', en: 'Orange buggy on the road to Macao', width: 1279, height: 847 },
  { src: '/buggy/galeria/buggy-naranja-convoy-punta-cana.webp', es: 'Buggy naranja al frente del convoy en Punta Cana', en: 'Orange buggy leading the convoy in Punta Cana', width: 1279, height: 847 },
  { src: '/buggy/doble.jpeg', es: 'Buggy doble verde en el lodo de Macao', en: 'Green double buggy in the Macao mud', width: 1600, height: 1059 },
  { src: '/buggy/individual.jpeg', es: 'Buggy azul salpicando lodo en la ruta de Punta Cana', en: 'Blue buggy splashing mud on the Punta Cana route', width: 1600, height: 1059 },
  { src: '/buggy/familiar.jpeg', es: 'Buggy familiar naranja de cuatro plazas', en: 'Orange four-seat family buggy', width: 1600, height: 1059 },
  { src: '/buggy/ruta-1.jpeg', es: 'Buggy amarillo en un camino de tierra de Macao', en: 'Yellow buggy on a Macao dirt road', width: 1232, height: 816 },
  { src: '/buggy/ruta-2.jpeg', es: 'Familia en un buggy naranja por el campo', en: 'Family in an orange buggy through the countryside', width: 1600, height: 1060 },
  { src: '/buggy/ruta-3.jpeg', es: 'Buggy rosado en la ruta rural', en: 'Pink buggy on the rural route', width: 1600, height: 1060 },
];

export function photo(src: string) {
  return puntaCanaPhotos.find((p) => p.src === src);
}

/** A different, stable set of photos per page so hotel pages do not all show the same pictures. */
export function photosFor(seed: string, count = 4) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const start = h % puntaCanaPhotos.length;
  return Array.from({ length: count }, (_, i) => puntaCanaPhotos[(start + i * 3) % puntaCanaPhotos.length]);
}
