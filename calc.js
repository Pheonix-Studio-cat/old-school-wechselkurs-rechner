// The conversion itself. Pure functions, no DOM, so the tests can run them in Node.
import { CPI, CURRENCIES, PAPERMARK_PER_USD, TODAY_FX } from './data.js';

const ym = (year, month) => `${year}-${String(month).padStart(2, '0')}`;
const monthIndex = (s) => { const [y, m] = s.split('-').map(Number); return y * 12 + (m - 1); };

export function currencyById(id) {
  const c = CURRENCIES.find((x) => x.id === id);
  if (!c) throw new Error(`unknown currency: ${id}`);
  return c;
}

// Paper marks per dollar for a month. A month with its own quotation is
// 'source'; a month between two quotations is interpolated geometrically
// (straight line on a log scale), which suits a currency that loses value at
// a roughly steady rate between the two points.
export function papermarkPerUsd(year, month) {
  const key = ym(year, month);
  const exact = PAPERMARK_PER_USD.find((p) => p.ym === key);
  if (exact) return { rate: exact.rate, kind: 'source', note: exact.note || null };
  const t = monthIndex(key);
  let before = null; let after = null;
  for (const p of PAPERMARK_PER_USD) {
    const i = monthIndex(p.ym);
    if (i < t) before = p;
    if (i > t && !after) after = p;
  }
  if (!before || !after) throw new Error(`no paper mark rate around ${key}`);
  const i0 = monthIndex(before.ym); const i1 = monthIndex(after.ym);
  const f = (t - i0) / (i1 - i0);
  const rate = Math.exp(Math.log(before.rate) + f * (Math.log(after.rate) - Math.log(before.rate)));
  return { rate, kind: 'interpolated', between: [before.ym, after.ym] };
}

// Units of a historical currency per US dollar at the chosen time.
export function unitsPerUsd(id, year, month) {
  const c = currencyById(id);
  if (c.from && monthIndex(ym(year, month)) < monthIndex(c.from)) {
    return { error: 'not_yet', from: c.from };
  }
  if (c.monthly) return { ...papermarkPerUsd(year, month), basis: 'month' };
  if (c.fixedPerUsd) return { rate: c.fixedPerUsd, kind: 'fixed', basis: 'fixed' };
  if (c.perUsd) return { rate: c.perUsd[year], kind: 'source', basis: 'year' };
  if (c.usdPerUnit) return { rate: 1 / c.usdPerUnit[year], kind: 'source', basis: 'year' };
  throw new Error(`no rate for ${id}`);
}

// Today's units of the target currency per US dollar, from rates quoted per euro.
export function todayPerUsd(code, fx = TODAY_FX) {
  const t = fx.perEur[code]; const usd = fx.perEur.USD;
  if (!(t > 0) || !(usd > 0)) throw new Error(`no current rate for ${code}`);
  return t / usd;
}

// amount (historical currency) -> dollars then -> dollars today (US CPI) -> target today.
export function convert({ amount, currency, year, month, target, fx = TODAY_FX }) {
  if (!(Number.isFinite(amount) && amount >= 0)) return { error: 'amount' };
  const r = unitsPerUsd(currency, year, month);
  if (r.error) return r;
  const usdThen = amount / r.rate;
  const cpiThen = CPI.years[year];
  const factor = CPI.today.value / cpiThen;
  const usdToday = usdThen * factor;
  const targetPerUsd = todayPerUsd(target, fx);
  const result = usdToday * targetPerUsd;
  return { amount, currency, year, month, target, rate: r, usdThen, cpiThen, factor, usdToday, targetPerUsd, result, fx };
}
