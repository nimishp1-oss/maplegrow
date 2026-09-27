export const money = (n) =>
  (n < 0 ? '−$' : '$') + Math.abs(Math.round(Number(n) || 0)).toLocaleString('en-US');

export const EXPENSES = [
  { key: 'expense_housing', label: 'Housing', short: 'Housing', color: '#1d1d1f' },
  { key: 'expense_food', label: 'Food & groceries', short: 'Food', color: '#0071e3' },
  { key: 'expense_transport', label: 'Transportation', short: 'Transport', color: '#34c759' },
  { key: 'expense_education', label: 'Education', short: 'Education', color: '#ff9f0a' },
  { key: 'expense_entertainment', label: 'Entertainment', short: 'Entertainment', color: '#af52de' },
  { key: 'expense_others', label: 'Others', short: 'Other', color: '#86868b' },
];

export const CATEGORIES = [...EXPENSES.map((e) => e.label), 'Income'];

export const SCHOOL_YEARS = [
  'High school junior', 'High school senior', 'College freshman', 'College sophomore',
  'College junior', 'College senior', 'Graduate student', 'J.D. student', 'Medical student',
];

export const DEBT_PATHS = [
  { name: 'Public university · undergrad', value: 31960, color: '#0071e3' },
  { name: 'Private nonprofit · undergrad', value: 41780, color: '#5856d6' },
  { name: 'Private for-profit · undergrad', value: 35250, color: '#34c759' },
  { name: 'Graduate / J.D.', value: 72640, color: '#ff9f0a' },
  { name: 'Medical school', value: 202450, color: '#af52de' },
];

export const ALLOCATION = [
  { key: 'allocation_etf', label: 'Broad-market ETF', color: '#0071e3' },
  { key: 'allocation_bond', label: 'Bond fund', color: '#34c759' },
  { key: 'allocation_cash', label: 'Cash reserve', color: '#ff9f0a' },
  { key: 'allocation_other', label: 'Other', color: '#86868b' },
];

export function budget(profile) {
  const income = Number(profile?.monthly_income) || 0;
  const items = EXPENSES.map((e) => ({ ...e, value: Number(profile?.[e.key]) || 0 }));
  const spent = items.reduce((s, i) => s + i.value, 0);
  const available = income - spent;
  return {
    income, items, spent, available,
    rate: income ? (available / income) * 100 : 0,
    debt: Number(profile?.education_debt) || 0,
  };
}

export function projection({ monthly_contribution = 0, annual_return = 0, years_to_graduation = 1 }) {
  const m = Number(monthly_contribution), n = years_to_graduation * 12, i = annual_return / 100 / 12;
  const fv = i === 0 ? m * n : m * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const contributed = m * n;
  const gain = Math.max(0, fv - contributed);
  const tax = gain * 0.15;
  return { fv, contributed, gain, tax, afterTax: fv - tax };
}

export function debtSchedule(debt = 0, payment = 0, graduationDate = null) {
  const start = Math.max(0, Number(debt) || 0);
  const pay = Math.max(0, Number(payment) || 0);
  const now = new Date();
  let gradIndex = null;
  if (graduationDate) {
    const g = new Date(graduationDate);
    if (!Number.isNaN(g.getTime())) {
      gradIndex = (g.getFullYear() - now.getFullYear()) * 12 + g.getMonth() - now.getMonth();
    }
  }
  const payoffMonths = start > 0 && pay > 0 ? Math.ceil(start / pay) : null;
  const horizon = Math.min(
    Math.max(payoffMonths != null ? payoffMonths + 1 : 2, gradIndex != null && gradIndex >= 0 ? gradIndex + 1 : 2, 2),
    121
  );
  const points = [];
  let balance = start;
  let cursor = new Date(now.getFullYear(), now.getMonth(), 1);
  points.push({ label: 'Now', balance });
  for (let i = 1; i < horizon; i++) {
    balance = Math.max(0, balance - pay);
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    points.push({ label: cursor.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), balance });
  }
  return { points, payoffMonths, gradIndex };
}