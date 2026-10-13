// All numbers the calculator uses, with their sources.
// Rule: nothing in here is estimated. A value either comes from a cited source
// or is marked as derived (fixed by law, or interpolated by calc.js).

export const YEARS = [1919, 1920, 1921, 1922, 1923];

// US consumer price index, CPI-U, all items, U.S. city average, not seasonally
// adjusted, 1982-84 = 100. Source: U.S. Bureau of Labor Statistics.
export const CPI = {
  source: 'U.S. Bureau of Labor Statistics, CPI-U (1982-84 = 100), annual averages',
  years: { 1919: 17.3, 1920: 20.0, 1921: 17.9, 1922: 16.8, 1923: 17.1 },
  today: { value: 334.980, label: 'August 2026', source: 'BLS CPI news release, 11 September 2026' },
};

// Paper marks per US dollar, Berlin quotations. Months without a value here are
// interpolated on a log scale by calc.js and shown as such.
// Sources: the table "paper marks per U.S. dollar" in the English Wikipedia
// article "Hyperinflation in the Weimar Republic" (after Statistisches
// Reichsamt, Zahlen zur Geldentwertung in Deutschland 1914 bis 1923, 1925);
// May 1923 monthly average from the Historisches Lexikon Bayerns
// (after Statistisches Jahrbuch für das Deutsche Reich).
export const PAPERMARK_PER_USD = [
  { ym: '1914-07', rate: 4.2, note: 'pre-war gold parity, for reference' },
  { ym: '1919-01', rate: 8.9 },
  { ym: '1919-07', rate: 14.0 },
  { ym: '1920-01', rate: 64.8 },
  { ym: '1920-07', rate: 39.5 },
  { ym: '1921-01', rate: 64.9 },
  { ym: '1921-07', rate: 76.7 },
  { ym: '1922-01', rate: 191.8 },
  { ym: '1922-07', rate: 493.2 },
  { ym: '1923-01', rate: 17972 },
  { ym: '1923-05', rate: 47670, note: 'monthly average' },
  { ym: '1923-07', rate: 353412 },
  { ym: '1923-08', rate: 4620455 },
  { ym: '1923-09', rate: 98860000 },
  { ym: '1923-10', rate: 25260000000, note: 'about 25.26 billion' },
  { ym: '1923-11', rate: 4.2e12, note: 'fixed on 15 November 1923' },
  { ym: '1923-12', rate: 4.2e12, note: 'held at the November rate' },
];

export const PAPERMARK_SOURCE =
  'Statistisches Reichsamt (1925) via Wikipedia, "Hyperinflation in the Weimar Republic"; May 1923: Historisches Lexikon Bayerns';

// Annual averages of daily New York market rates, units of the currency per
// US dollar. Source: Lawrence H. Officer, "Exchange Rates Between the United
// States Dollar and Forty-one Currencies", MeasuringWorth. Sterling comes from
// Officer's "Dollar-Pound Exchange Rate From 1791" (dollars per pound there,
// inverted here).
const MW = 'L. H. Officer, MeasuringWorth (annual averages, New York market)';

export const CURRENCIES = [
  // German currencies
  {
    id: 'papiermark', group: 'german', symbol: 'ℳ',
    name: { en: 'Paper mark (Papiermark)', de: 'Papiermark' },
    hint: {
      en: 'Also covers Notgeld and Darlehenskassenscheine issued in marks; they circulated at par.',
      de: 'Gilt auch für Notgeld und Darlehenskassenscheine in Mark; sie liefen zum Nennwert um.',
    },
    monthly: true,
  },
  {
    id: 'goldmark', group: 'german', symbol: 'GM',
    name: { en: 'Gold mark (unit of account)', de: 'Goldmark (Rechnungseinheit)' },
    hint: {
      en: 'The pre-war mark: 4.20 marks to the dollar, fixed by its gold content. Used for taxes, reparations and prices in 1923.',
      de: 'Die Vorkriegsmark: 4,20 Mark je Dollar, festgelegt durch den Goldgehalt. 1923 Rechengrösse für Steuern, Reparationen und Preise.',
    },
    fixedPerUsd: 4.2,
  },
  {
    id: 'rentenmark', group: 'german', symbol: 'RM',
    name: { en: 'Rentenmark', de: 'Rentenmark' },
    hint: {
      en: 'Issued from 15 November 1923. 1 Rentenmark = 1,000,000,000,000 paper marks = 1 gold mark.',
      de: 'Ausgegeben ab 15. November 1923. 1 Rentenmark = 1 000 000 000 000 Papiermark = 1 Goldmark.',
    },
    fixedPerUsd: 4.2,
    from: '1923-11',
  },
  // World currencies
  {
    id: 'usd', group: 'world', symbol: '$',
    name: { en: 'US dollar', de: 'US-Dollar' }, perUsd: { 1919: 1, 1920: 1, 1921: 1, 1922: 1, 1923: 1 },
  },
  {
    id: 'gbp', group: 'world', symbol: '£',
    name: { en: 'Pound sterling', de: 'Pfund Sterling' },
    usdPerUnit: { 1919: 4.426, 1920: 3.66, 1921: 3.85, 1922: 4.43, 1923: 4.575 },
    source: 'L. H. Officer, "Dollar-Pound Exchange Rate From 1791", MeasuringWorth',
  },
  {
    id: 'frf', group: 'world', symbol: 'F',
    name: { en: 'French franc', de: 'Französischer Franc' },
    perUsd: { 1919: 7.309, 1920: 14.205, 1921: 13.413, 1922: 12.193, 1923: 16.444 }, source: MW,
  },
  {
    id: 'chf', group: 'world', symbol: 'Fr.',
    name: { en: 'Swiss franc', de: 'Schweizer Franken' },
    perUsd: { 1919: 5.2679, 1920: 5.9161, 1921: 5.7624, 1922: 5.2452, 1923: 5.5371 }, source: MW,
  },
  {
    id: 'itl', group: 'world', symbol: 'L.',
    name: { en: 'Italian lira', de: 'Italienische Lira' },
    perUsd: { 1919: 8.796, 1920: 20.121, 1921: 23.29, 1922: 21.027, 1923: 21.732 }, source: MW,
  },
  {
    id: 'sek', group: 'world', symbol: 'kr',
    name: { en: 'Swedish krona', de: 'Schwedische Krone' },
    perUsd: { 1919: 3.9151, 1920: 4.8795, 1921: 4.3609, 1922: 3.8217, 1923: 3.7658 }, source: MW,
  },
  {
    id: 'jpy', group: 'world', symbol: '¥',
    name: { en: 'Japanese yen', de: 'Japanischer Yen' },
    perUsd: { 1919: 1.95, 1920: 1.99, 1921: 2.07, 1922: 2.09, 1923: 2.06 }, source: MW,
  },
];

// Today's rates: ECB euro reference rates, units per euro.
// The page tries to fetch fresher ECB rates (via frankfurter) and falls back to these.
export const TODAY_FX = {
  date: '2026-10-09',
  source: 'European Central Bank, euro foreign exchange reference rates',
  perEur: { EUR: 1, USD: 1.1206, CHF: 0.9313, GBP: 0.84763, JPY: 177.34 },
};

export const TARGETS = [
  { code: 'EUR', name: { en: 'Euro', de: 'Euro' }, digits: 2 },
  { code: 'CHF', name: { en: 'Swiss franc', de: 'Schweizer Franken' }, digits: 2 },
  { code: 'USD', name: { en: 'US dollar', de: 'US-Dollar' }, digits: 2 },
  { code: 'GBP', name: { en: 'Pound sterling', de: 'Pfund Sterling' }, digits: 2 },
  { code: 'JPY', name: { en: 'Japanese yen', de: 'Japanischer Yen' }, digits: 0 },
];
