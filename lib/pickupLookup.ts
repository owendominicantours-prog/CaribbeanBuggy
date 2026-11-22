import { hotelBuggyLandings, isBayahibeHotel, isMeetingPointHotel, type HotelBuggyLanding } from './hotelBuggyLandings';

// Owner policy 20 Nov 2026 (AGENTS.md): pickup included in Bávaro (incl. hotels marketed as Punta Cana), El Cortecito,
// Cabeza de Toro, Macao and Uvero Alto. Verón and the Punta Cana area next to PUJ airport meet at KFC Downtown.
// Cap Cana keeps its existing published condition (calculator zone fee). Calculator labels must match lib/buggyProducts pickupZones.
export type PickupStatus = 'included' | 'meeting' | 'capcana' | 'bayahibe';

export type PickupArea = {
  id: string;
  status: PickupStatus;
  calculatorZone: string;
  es: string;
  en: string;
};

export const pickupAreas: PickupArea[] = [
  { id: 'bavaro', status: 'included', calculatorZone: 'Bavaro / Punta Cana', es: 'Bávaro / Arena Gorda / El Cortecito', en: 'Bávaro / Arena Gorda / El Cortecito' },
  { id: 'cabeza-de-toro', status: 'included', calculatorZone: 'Cabeza de Toro', es: 'Cabeza de Toro', en: 'Cabeza de Toro' },
  { id: 'macao', status: 'included', calculatorZone: 'Macao', es: 'Macao', en: 'Macao' },
  { id: 'uvero-alto', status: 'included', calculatorZone: 'Uvero Alto', es: 'Uvero Alto', en: 'Uvero Alto' },
  { id: 'cap-cana', status: 'capcana', calculatorZone: 'Cap Cana', es: 'Cap Cana', en: 'Cap Cana' },
  { id: 'kfc', status: 'meeting', calculatorZone: 'Bavaro / Punta Cana', es: 'Verón o zona del aeropuerto PUJ', en: 'Verón or PUJ airport area' },
];

export const bayahibeArea: PickupArea = { id: 'bayahibe', status: 'bayahibe', calculatorZone: 'Bayahibe / La Romana', es: 'Bayahibe / La Romana', en: 'Bayahibe / La Romana' };

export function normalizeText(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function areaForHotel(hotel: HotelBuggyLanding): PickupArea {
  if (isBayahibeHotel(hotel)) return bayahibeArea;
  if (isMeetingPointHotel(hotel)) return pickupAreas.find((a) => a.id === 'kfc')!;
  if (hotel.zone.includes('Cap Cana')) return pickupAreas.find((a) => a.id === 'cap-cana')!;
  if (hotel.zone.includes('Uvero')) return pickupAreas.find((a) => a.id === 'uvero-alto')!;
  if (hotel.zone.includes('Cabeza')) return pickupAreas.find((a) => a.id === 'cabeza-de-toro')!;
  if (hotel.zone.includes('Macao') && !hotel.zone.includes('Arena')) return pickupAreas.find((a) => a.id === 'macao')!;
  return pickupAreas[0];
}

export function searchHotels(query: string, bayahibe: boolean, limit = 6) {
  const q = normalizeText(query);
  if (q.length < 2) return [];
  const words = q.split(' ');
  return hotelBuggyLandings
    .filter((hotel) => isBayahibeHotel(hotel) === bayahibe)
    .map((hotel) => {
      const name = normalizeText(hotel.name);
      const zone = normalizeText(hotel.zone);
      const hits = words.filter((w) => name.includes(w) || zone.includes(w)).length;
      return { hotel, score: hits + (name.startsWith(q) ? 2 : 0) + (name.includes(q) ? 1 : 0) };
    })
    .filter((row) => row.score >= words.length)
    .sort((a, b) => b.score - a.score || a.hotel.name.localeCompare(b.hotel.name))
    .slice(0, limit)
    .map((row) => row.hotel);
}

/** Free-text hints for places that are not in the hotel list. */
export function areaFromText(query: string): PickupArea | null {
  const q = normalizeText(query);
  if (!q) return null;
  if (/\bveron\b|aeropuerto|airport|\bpuj\b|westin|club med|puntacana resort/.test(q)) return pickupAreas.find((a) => a.id === 'kfc')!;
  if (/cap ?cana/.test(q)) return pickupAreas.find((a) => a.id === 'cap-cana')!;
  if (/uvero/.test(q)) return pickupAreas.find((a) => a.id === 'uvero-alto')!;
  if (/cabeza de toro/.test(q)) return pickupAreas.find((a) => a.id === 'cabeza-de-toro')!;
  if (/\bmacao\b/.test(q)) return pickupAreas.find((a) => a.id === 'macao')!;
  if (/bavaro|cortecito|arena gorda|los corales/.test(q)) return pickupAreas[0];
  return null;
}
