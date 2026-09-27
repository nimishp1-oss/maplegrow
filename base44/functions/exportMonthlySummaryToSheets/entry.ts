import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const EXPENSE_CATEGORIES = ['Housing', 'Food & groceries', 'Transportation', 'Education', 'Entertainment', 'Others'];
const SHEET_NAME = 'Summaries';
const SPREADSHEET_TITLE = 'Maple Grow — Monthly Summaries';
const HEADER = ['Month', 'Income', 'Expenses', 'Net', 'Transactions', ...EXPENSE_CATEGORIES, 'Exported at'];

const round2 = (n) => Math.round(n * 100) / 100;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const month =
      typeof body?.month === 'string' && /^\d{4}-\d{2}$/.test(body.month)
        ? body.month
        : new Date().toISOString().slice(0, 7);

    const [y, m] = month.split('-').map(Number);
    const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
    const txs = await base44.entities.Transaction.filter(
      { created_by_id: user.id, date: { $gte: `${month}-01`, $lt: `${nextMonth}-01` } },
      '-date',
      500,
    );

    let income = 0;
    let expenses = 0;
    const byCategory = Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0]));
    for (const t of txs) {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income' || t.category === 'Income') {
        income += amount;
        continue;
      }
      expenses += amount;
      const cat = Object.hasOwn(byCategory, t.category) ? t.category : 'Others';
      byCategory[cat] += amount;
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

    const sheetsCall = async (url, init) => {
      const res = await fetch(url, init);
      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
      return { ok: res.ok, status: res.status, json, tail: text.slice(-600) };
    };
    const fail = (step, call) =>
      Response.json({ error: step, status: call.status, details: call.json?.error?.message || call.tail }, { status: 502 });

    let config = (await base44.entities.SheetsConfig.list())[0];
    let spreadsheetId = config?.spreadsheet_id;
    const spreadsheetUrl = config?.spreadsheet_url;

    if (!spreadsheetId) {
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: { title: SPREADSHEET_TITLE },
          sheets: [{ properties: { title: SHEET_NAME } }],
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok || !created.spreadsheetId) {
        return Response.json(
          { error: 'Could not create the summary spreadsheet in your Google account.', details: created.error?.message },
          { status: 502 },
        );
      }
      spreadsheetId = created.spreadsheetId;
      await base44.entities.SheetsConfig.create({
        spreadsheet_id: created.spreadsheetId,
        spreadsheet_url: created.spreadsheetUrl,
        last_exported_month: month,
      });
      config = null;
    }

    const base = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_NAME}`;

    // Ensure the header row exists and find an existing row for this month (update, don't duplicate).
    const readCall = await sheetsCall(`${base}!A1:A`, { headers });
    if (!readCall.ok) return fail('Sheet read failed', readCall);
    const rows = readCall.json?.values || [];
    let monthRow = 0; // 1-based sheet row of an existing month summary, 0 = append a new one
    if (rows.length === 0 || String(rows[0][0]) !== 'Month') {
      const headerCall = await sheetsCall(`${base}!A1:L1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ values: [HEADER] }),
      });
      if (!headerCall.ok) return fail('Header write failed', headerCall);
    } else {
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === month) {
          monthRow = i + 1;
          break;
        }
      }
    }

    const rowData = [
      month,
      round2(income),
      round2(expenses),
      round2(income - expenses),
      txs.length,
      ...EXPENSE_CATEGORIES.map((c) => round2(byCategory[c])),
      new Date().toISOString(),
    ];

    const writeCall =
      monthRow > 0
        ? await sheetsCall(`${base}!A${monthRow}:L${monthRow}?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ values: [rowData] }),
          })
        : await sheetsCall(`${base}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ values: [rowData] }),
          });
    if (!writeCall.ok) return fail('Sheet write failed', writeCall);

    if (config?.id) {
      await base44.entities.SheetsConfig.update(config.id, { last_exported_month: month });
    }

    return Response.json({
      month,
      income: round2(income),
      expenses: round2(expenses),
      net: round2(income - expenses),
      transactions: txs.length,
      spreadsheet_url: spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}