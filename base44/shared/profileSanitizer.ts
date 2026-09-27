// Shared input sanitizer for Gemini-backed backend functions.
// Whitelists the profile fields we ever send to the model and bounds their values.

export const NUMERIC_FIELDS = [
  'monthly_income',
  'education_debt',
  'monthly_debt_payment',
  'expense_housing',
  'expense_food',
  'expense_transport',
  'expense_education',
  'expense_entertainment',
  'expense_others',
  'monthly_contribution',
  'annual_return',
  'years_to_graduation',
];

export const TEXT_FIELDS = ['full_name', 'school_year', 'graduation_date'];

export function sanitizeProfile(raw) {
  const profile = {};
  for (const key of TEXT_FIELDS) {
    if (typeof raw?.[key] === 'string' && raw[key].trim()) profile[key] = raw[key].slice(0, 80);
  }
  for (const key of NUMERIC_FIELDS) {
    const n = Number(raw?.[key]);
    if (Number.isFinite(n) && n >= 0 && n <= 100000000) profile[key] = n;
  }
  return profile;
}