import type { BuggyProduct } from './buggyProducts';

export type FleetOption = {
  fleet: Record<string, number>;
  total: number;
  vehicles: number;
  seats: number;
  emptySeats: number;
};

/**
 * Every valid vehicle mix for a group, cheapest first.
 * Same rules as calculateBookingTotal: every traveler needs a seat and every buggy needs a driver (vehicles <= travelers).
 * Prices come only from the product catalogue; nothing is discounted or rounded here.
 */
export function fleetOptions(choices: BuggyProduct[], travelers: number, limit = 3): FleetOption[] {
  const sorted = [...choices].sort((a, b) => a.capacityNumber - b.capacityNumber);
  const results: FleetOption[] = [];
  const counts = new Array(sorted.length).fill(0);
  const maxEach = sorted.map((p) => Math.ceil(travelers / p.capacityNumber));

  const walk = (index: number) => {
    if (index === sorted.length) {
      const vehicles = counts.reduce((n, c) => n + c, 0);
      const seats = counts.reduce((n, c, i) => n + c * sorted[i].capacityNumber, 0);
      if (vehicles < 1 || vehicles > travelers || seats < travelers) return;
      // Skip mixes that carry a whole extra empty buggy.
      if (counts.some((c, i) => c > 0 && seats - sorted[i].capacityNumber >= travelers)) return;
      const fleet: Record<string, number> = {};
      counts.forEach((c, i) => { if (c) fleet[sorted[i].id] = c; });
      const total = counts.reduce((n, c, i) => n + c * sorted[i].promo, 0);
      results.push({ fleet, total, vehicles, seats, emptySeats: seats - travelers });
      return;
    }
    for (let c = 0; c <= maxEach[index]; c += 1) {
      counts[index] = c;
      walk(index + 1);
    }
    counts[index] = 0;
  };
  walk(0);

  results.sort((a, b) => a.total - b.total || a.emptySeats - b.emptySeats || a.vehicles - b.vehicles);
  return results.slice(0, limit);
}

export function fleetSummary(choices: BuggyProduct[], fleet: Record<string, number>, label: (p: BuggyProduct) => string) {
  return choices.filter((p) => fleet[p.id]).map((p) => `${fleet[p.id]} × ${label(p)}`).join(' + ');
}

export function fleetTotals(choices: BuggyProduct[], fleet: Record<string, number>, travelers: number) {
  const vehicles = choices.reduce((n, p) => n + (fleet[p.id] || 0), 0);
  const seats = choices.reduce((n, p) => n + (fleet[p.id] || 0) * p.capacityNumber, 0);
  const total = choices.reduce((n, p) => n + (fleet[p.id] || 0) * p.promo, 0);
  return { vehicles, seats, total, valid: vehicles > 0 && vehicles <= travelers && seats >= travelers };
}

/** US$ amounts: whole numbers stay whole, cents shown with two decimals (72.5 → 72.50). */
export function money(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}
