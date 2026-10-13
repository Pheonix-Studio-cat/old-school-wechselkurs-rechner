// Run: node --test tests/
// Expected values are written out from the source numbers by hand, not taken
// from data.js, so a changed rate in data.js makes these fail.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convert, papermarkPerUsd, unitsPerUsd, todayPerUsd } from '../calc.js';
import { PAPERMARK_PER_USD, CURRENCIES, YEARS, CPI } from '../data.js';

const close = (a, b, rel = 1e-9) => assert.ok(Math.abs(a - b) <= Math.abs(b) * rel, `${a} != ${b}`);

test('100 paper marks, January 1919, into Swiss francs today', () => {
  const r = convert({ amount: 100, currency: 'papiermark', year: 1919, month: 1, target: 'CHF' });
  close(r.usdThen, 100 / 8.9);
  close(r.factor, 334.980 / 17.3);
  close(r.result, (100 / 8.9) * (334.980 / 17.3) * (0.9313 / 1.1206));
  assert.equal(r.rate.kind, 'source');
});

test('one trillion paper marks in November 1923 equals one gold mark', () => {
  const pm = convert({ amount: 1e12, currency: 'papiermark', year: 1923, month: 11, target: 'EUR' });
  const gm = convert({ amount: 1, currency: 'goldmark', year: 1923, month: 11, target: 'EUR' });
  const rm = convert({ amount: 1, currency: 'rentenmark', year: 1923, month: 11, target: 'EUR' });
  close(pm.result, gm.result);
  close(rm.result, gm.result);
  close(gm.result, (1 / 4.2) * (334.980 / 17.1) * (1 / 1.1206));
});

test('the Rentenmark does not exist before November 1923', () => {
  assert.deepEqual(unitsPerUsd('rentenmark', 1923, 10), { error: 'not_yet', from: '1923-11' });
  assert.equal(convert({ amount: 1, currency: 'rentenmark', year: 1922, month: 6, target: 'EUR' }).error, 'not_yet');
});

test('a month between two quotations is interpolated on a log scale and says so', () => {
  const r = papermarkPerUsd(1923, 6); // between May 47,670 and July 353,412
  assert.equal(r.kind, 'interpolated');
  close(r.rate, Math.sqrt(47670 * 353412));
  assert.ok(r.rate > 47670 && r.rate < 353412);
});

test('every month 1919-1923 has a paper mark rate, and quoted months are exact', () => {
  for (const y of YEARS) for (let m = 1; m <= 12; m++) {
    const r = papermarkPerUsd(y, m);
    assert.ok(r.rate > 0 && Number.isFinite(r.rate), `${y}-${m}`);
  }
  for (const p of PAPERMARK_PER_USD.filter((p) => p.ym >= '1919')) {
    const [y, m] = p.ym.split('-').map(Number);
    assert.equal(papermarkPerUsd(y, m).rate, p.rate);
    assert.equal(papermarkPerUsd(y, m).kind, 'source');
  }
});

test('world currencies: pound 1920 and lira 1921', () => {
  close(convert({ amount: 1, currency: 'gbp', year: 1920, month: 1, target: 'USD' }).result, 3.66 * (334.980 / 20.0));
  close(convert({ amount: 100, currency: 'itl', year: 1921, month: 1, target: 'GBP' }).result,
    (100 / 23.29) * (334.980 / 17.9) * (0.84763 / 1.1206));
});

test('every currency gives a finite rate for every year it existed', () => {
  for (const c of CURRENCIES) for (const y of YEARS) {
    const r = unitsPerUsd(c.id, y, 12);
    if (r.error) { assert.equal(c.id, 'rentenmark'); continue; }
    assert.ok(Number.isFinite(r.rate) && r.rate > 0, `${c.id} ${y}`);
  }
  for (const y of YEARS) assert.ok(CPI.years[y] > 0);
});

test('today: USD to USD is 1, JPY uses the yen rate', () => {
  assert.equal(todayPerUsd('USD'), 1);
  close(todayPerUsd('JPY'), 177.34 / 1.1206);
});

test('bad amounts are refused, not converted', () => {
  for (const a of [NaN, -1, Infinity]) assert.equal(convert({ amount: a, currency: 'usd', year: 1920, month: 1, target: 'EUR' }).error, 'amount');
});
