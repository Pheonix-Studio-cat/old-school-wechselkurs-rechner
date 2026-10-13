// Browser check of the page itself. Needs Playwright and a local server:
//   npx http-server -p 8765 -s .   then   node tests/ui.test.mjs
// Expected numbers are written out from the source figures, not read from data.js.
import { chromium } from 'playwright';

const URL = process.env.PAGE_URL || 'http://127.0.0.1:8765/index.html';
let failed = 0;
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) failed++; };
const num = (s) => Number(s.replace(/[^\d.]/g, ''));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ locale: 'en-US', viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/frankfurter|Failed to load resource|fonts\.g/.test(m.text())) errors.push(m.text()); });
await page.goto(URL);
await page.waitForSelector('#steps li');

// 1. Default slip: 100 paper marks, January 1919, in euros
const eur = (100 / 8.9) * (334.980 / 17.3) / 1.1206;
let total = await page.textContent('#total-value');
check(total.includes('EUR') && Math.abs(num(total) - eur) < 0.01, `100 marks Jan 1919 = ${eur.toFixed(2)} EUR (page: ${total})`);
check((await page.locator('#steps li').count()) === 5, 'receipt shows five steps');
check((await page.textContent('#steps')).includes('source'), 'January 1919 is marked as a quoted rate');

// 2. Example: 1 trillion marks in November 1923 = 1 gold mark
await page.click('#ex-1');
const gm = (1 / 4.2) * (334.980 / 17.1) / 1.1206;
total = await page.textContent('#total-value');
check(Math.abs(num(total) - gm) < 0.01, `1 trillion marks Nov 1923 = ${gm.toFixed(2)} EUR (page: ${total})`);
check((await page.textContent('#total-words')).trim() === '= 1 trillion', 'large amount is spelled out');
check((await page.locator('.ledger tr.sel').count()) === 1, 'ledger highlights the quoted month');

// 3. Interpolated month is labelled
await page.selectOption('#month', '6');
check((await page.textContent('#steps')).includes('interpolated'), 'June 1923 is marked interpolated');
check((await page.locator('.ledger tr.sel').count()) === 0, 'no ledger row highlighted for an interpolated month');

// 4. Rentenmark before it existed
await page.selectOption('#currency', 'rentenmark');
await page.selectOption('#year', '1922');
check(await page.isVisible('#error'), 'Rentenmark in 1922 shows an error');
check((await page.textContent('#total-value')).trim() === '—', 'and no amount');

// 5. Annual currency disables the month
await page.selectOption('#currency', 'gbp');
check(await page.isDisabled('#month'), 'month is disabled for a yearly-average currency');
check(await page.isHidden('#error'), 'error disappears again');
check((await page.textContent('#steps')).includes('1 Pound sterling = 4.43 US dollars'), 'strong currency shows dollars per unit (1 £ = 4.43 $ in 1922)');

// 6. German
await page.click('#lang-de');
check((await page.textContent('.slip h2')) === 'Wechselzettel', 'German labels after DE');
check((await page.textContent('#steps')).includes('Jahresmittel'), 'German chip text');
await page.click('#ex-1');
check((await page.textContent('#total-words')).trim() === '= 1 Billion', 'German: 1 Billion, singular');

// 7. Layout at phone width
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check(overflow <= 0, `no horizontal scroll at 390 px (overflow ${overflow})`);
await page.screenshot({ path: process.env.SHOT || 'tests/phone.png', fullPage: true });

check(errors.length === 0, `no page errors ${errors.join(' | ')}`);
await browser.close();
console.log(failed ? `${failed} failed` : 'all passed');
process.exit(failed ? 1 : 0);
