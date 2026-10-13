# Wechselstube 1919–1923

An old-school exchange office in the browser. Enter an amount of money from
1919 to 1923, especially one of the German currencies of the inflation years,
and see what it is worth today in euros, Swiss francs, dollars, pounds or yen.

## Currencies

| Group | Currency | Rate used |
| --- | --- | --- |
| German | Paper mark (Papiermark), including Notgeld and Darlehenskassenscheine in marks | Berlin quotations for particular months; months in between are interpolated on a log scale and marked as such |
| German | Gold mark (unit of account) | fixed, 4.20 marks per dollar |
| German | Rentenmark (from 15 November 1923) | fixed, 1 Rentenmark = 10¹² paper marks = 1 gold mark |
| Other | US dollar, pound sterling, French franc, Swiss franc, Italian lira, Swedish krona, Japanese yen | annual averages |

## How it calculates

1. The old amount is changed into US dollars at the rate of its time.
2. Those dollars are brought forward to today with the US consumer price index
   (CPI-U).
3. Today's dollars are changed into the chosen currency at the ECB reference
   rate.

The result is purchasing power measured in American prices. Every step is
shown on the slip, with a label for each rate: *source*, *interpolated*,
*yearly average* or *fixed*.

## Sources

| What | Source |
| --- | --- |
| Paper marks per dollar | Statistisches Reichsamt, *Zahlen zur Geldentwertung in Deutschland 1914 bis 1923* (1925), as tabulated in Wikipedia, "Hyperinflation in the Weimar Republic"; May 1923 from the Historisches Lexikon Bayerns |
| Other currencies | Lawrence H. Officer, MeasuringWorth: "Exchange Rates Between the United States Dollar and Forty-one Currencies" and "Dollar-Pound Exchange Rate From 1791" |
| US prices | U.S. Bureau of Labor Statistics, CPI-U, annual averages 1919–1923 and August 2026 |
| Today's rates | European Central Bank reference rates, 9 October 2026. The page asks [Frankfurter](https://frankfurter.dev) for newer ECB rates and keeps the stored ones if that fails |

All figures are in [`data.js`](data.js), each with its source.

## Run it

No build step. Any static web server works, for example GitHub Pages:
*Settings → Pages → Deploy from a branch → `main` / `(root)`*.

Opening `index.html` straight from disk does not work, because browsers do
not load ES modules from `file://`.

## Tests

```sh
npm install
npm test                                   # the arithmetic, in Node
npx http-server -p 8765 -s . &
node tests/ui.test.mjs                     # the page, in Chromium
```

## Licence

MIT
