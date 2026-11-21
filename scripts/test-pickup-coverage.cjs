const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const m = { exports: {} }; cache.set(file, m);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, { exports: m.exports, require: id => id.startsWith('.') ? load(path.resolve(path.dirname(file), id + '.ts')) : require(id) });
  return m.exports;
}
const { products, calculateBookingTotal } = load('lib/buggyProducts.ts');
const { pickupPolicy } = load('lib/pickupPolicy.ts');
for (const id of ['buggy-individual', 'buggy-doble', 'buggy-familiar']) {
  const product = products.find(p => p.id === id);
  for (const passengers of [1, product.capacityNumber, product.capacityNumber + 1]) {
    const input = { product, passengers, photos: false, privatePickup: false };
    const bavaro = calculateBookingTotal({ ...input, pickupZone: 'Bavaro / Punta Cana' });
    const uvero = calculateBookingTotal({ ...input, pickupZone: 'Uvero Alto' });
    const cap = calculateBookingTotal({ ...input, pickupZone: 'Cap Cana' });
    assert.equal(uvero.zoneFee, 0);
    assert.equal(uvero.total, bavaro.total, id + ': Uvero Alto must use the same base tour price');
    assert.equal(cap.total, bavaro.total + 10, 'Unchanged Cap Cana condition');
  }
}
for (const locale of ['es', 'en']) {
  assert(pickupPolicy[locale].coverage.includes('Uvero Alto'));
  assert(pickupPolicy[locale].meeting.includes('KFC'));
  assert(pickupPolicy[locale].meeting.includes('Verón'));
  assert(pickupPolicy[locale].clarify.includes('Bávaro'));
}
const bayahibe = products.find(p => p.id === 'bayahibe-buggy-doble');
assert.throws(() => calculateBookingTotal({ product: bayahibe, passengers: 2, pickupZone: 'Uvero Alto', photos: false, privatePickup: false }));
console.log('PASS: Uvero Alto totals match included zones for every Punta Cana buggy and group size; Cap Cana and Bayahibe boundaries preserved.');
