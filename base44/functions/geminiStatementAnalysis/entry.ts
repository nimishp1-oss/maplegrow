import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

// ---------------------------------------------------------------------------
// Credit-card / bank statement analysis (server-side only).
// The frontend uploads the statement to the app's private storage, creates a
// short-lived signed URL, and passes it here. Gemini (built-in platform
// access, model gemini_3_8_flash — non-default model, uses more integration
// credits) extracts each transaction and maps it to a spending category.
// Every value is validated before it is returned; nothing is written to the
// database by this function — the user confirms the rows in the app first.
// ---------------------------------------------------------------------------

const CATEGORIES = ['Housing', 'Food & groceries', 'Transportation', 'Education', 'Entertainment', 'Others', 'Income'];
const MAX_TX = 100;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json().catch(() => ({}));
    const fileUrl = typeof payload.fileUrl === 'string' ? payload.fileUrl : '';
    if (!fileUrl.startsWith('https://') || fileUrl.length > 600) {
      return Response.json({ error: 'A valid statement file URL is required.' }, { status: 400 });
    }

    const raw = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `This is a credit card or bank statement image or PDF.

Extract EVERY individual transaction into a list. For each transaction:
- name: a short merchant/description label
- amount: the posted amount as a positive number
- date: the transaction date in YYYY-MM-DD format (use the statement's year when the day/month are shown without a year)
- category: exactly one of: ${CATEGORIES.join(', ')}
  - Use "Income" only for deposits, payments received, or refunds to you.
  - Restaurant/grocery charges → "Food & groceries"; rent/utilities → "Housing"; gas/transit/parking → "Transportation"; tuition/books/fees → "Education"; movies/games/subscriptions → "Entertainment"; anything else → "Others".
- Ignore fees, balances, totals, and promotional text — transactions only.

Respond with ONLY a JSON object of the form {"transactions": [{"name": string, "amount": number, "date": "YYYY-MM-DD", "category": string}]} — no markdown, no commentary.`,
      file_urls: [fileUrl],
    });

    let parsed;
    try {
      const match = typeof raw === 'string' ? raw.match(/\{[\s\S]*\}/) : null;
      parsed = match ? JSON.parse(match[0]) : raw;
    } catch (e) {
      return Response.json({ error: 'The statement could not be read reliably. Try a clearer scan or PDF.' }, { status: 422 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const transactions = (parsed?.transactions || [])
      .slice(0, MAX_TX)
      .map((t) => {
        const category = CATEGORIES.includes(t.category) ? t.category : 'Others';
        const amount = Number(t.amount);
        const date = typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) ? t.date : today;
        return {
          name: String(t.name || 'Transaction').slice(0, 80),
          amount: Number.isFinite(amount) && amount > 0 && amount <= 100000 ? Math.round(amount * 100) / 100 : 0,
          category,
          date,
        };
      })
      .filter((t) => t.amount > 0);

    return Response.json({ transactions });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
