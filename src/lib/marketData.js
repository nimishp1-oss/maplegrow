// Illustrative market data for the Maple Grow landing page.
// Values show the approximate growth of $100 over five years (2019–2024)
// and are rounded examples for education — not live quotes.

export const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024'];

export const TOP_STOCKS = [
  { key: 'aapl', ticker: 'AAPL', name: 'Apple', color: '#1d1d1f', series: [100, 131, 154, 146, 195, 236] },
  { key: 'msft', ticker: 'MSFT', name: 'Microsoft', color: '#0071e3', series: [100, 153, 221, 231, 275, 316] },
  { key: 'nvda', ticker: 'NVDA', name: 'NVIDIA', color: '#34c759', series: [100, 200, 385, 165, 470, 855] },
  { key: 'amzn', ticker: 'AMZN', name: 'Amazon', color: '#af52de', series: [100, 137, 176, 120, 170, 216] },
  { key: 'googl', ticker: 'GOOGL', name: 'Alphabet', color: '#ff9f0a', series: [100, 158, 195, 137, 175, 253] },
];

export const TOP_ETFS = [
  { key: 'voo', ticker: 'VOO', name: 'Vanguard S&P 500', color: '#0071e3', series: [100, 119, 153, 132, 173, 214] },
  { key: 'qqq', ticker: 'QQQ', name: 'Invesco QQQ', color: '#af52de', series: [100, 141, 187, 152, 202, 269] },
  { key: 'vti', ticker: 'VTI', name: 'Vanguard Total Market', color: '#1d1d1f', series: [100, 117, 150, 129, 168, 205] },
  { key: 'schd', ticker: 'SCHD', name: 'Schwab US Dividend', color: '#34c759', series: [100, 106, 134, 125, 149, 181] },
  { key: 'arkk', ticker: 'ARKK', name: 'ARK Innovation', color: '#ff9f0a', series: [100, 143, 82, 74, 143, 128] },
];

export const growthPct = (series) => Math.round(((series[series.length - 1] / series[0]) - 1) * 100);