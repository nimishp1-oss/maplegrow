import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';

// ---------------------------------------------------------------------------
// Snowflake SQL API integration (server-side only).
// Credentials come from Base44 secrets and are never sent to the browser.
//
// TODO (after the Snowflake account + tables exist):
//   1. Fill in the secrets values in dashboard settings (account, user,
//      password, role, warehouse, database).
//   2. Edit DEFAULT_SQL below to match your real table/column names.
// ---------------------------------------------------------------------------

// EDIT THIS QUERY once your Snowflake tables exist. Keep it read-only,
// aggregate (no per-row personal data), and bounded with LIMIT.
const DEFAULT_SQL = `
  SELECT
    education_path AS path,
    avg_debt       AS avg_debt,
    avg_tuition    AS avg_tuition
  FROM STUDENT_DEBT_SUMMARIES
  LIMIT 25
`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const account = secrets.get('SNOWFLAKE_ACCOUNT');
    const sfUser = secrets.get('SNOWFLAKE_USER');
    const sfPassword = secrets.get('SNOWFLAKE_PASSWORD');
    const role = secrets.get('SNOWFLAKE_ROLE');
    const warehouse = secrets.get('SNOWFLAKE_WAREHOUSE');
    const database = secrets.get('SNOWFLAKE_DATABASE');

    const missing = [
      !account && 'SNOWFLAKE_ACCOUNT',
      !sfUser && 'SNOWFLAKE_USER',
      !sfPassword && 'SNOWFLAKE_PASSWORD',
      !role && 'SNOWFLAKE_ROLE',
      !warehouse && 'SNOWFLAKE_WAREHOUSE',
      !database && 'SNOWFLAKE_DATABASE',
    ].filter(Boolean);

    if (missing.length > 0) {
      return Response.json(
        {
          configured: false,
          error: `Snowflake is not configured yet. Missing secrets: ${missing.join(', ')}.`,
        },
        { status: 503 }
      );
    }

    const auth = btoa(`${sfUser}:${sfPassword}`);
    const res = await fetch(`https://${account}.snowflakecomputing.com/api/v2/statements`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'X-Snowflake-Authorization-Token-Type': 'BASIC',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        statement: DEFAULT_SQL,
        warehouse,
        role,
        database,
        timeout: 30,
      }),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 500);
      return Response.json(
        { configured: true, error: `Snowflake API returned ${res.status}`, detail },
        { status: 502 }
      );
    }

    const result = await res.json();
    // Snowflake SQL API response: { resultSetMetaData: { rowType: [...] }, data: [[...], ...] }
    const columns = (result?.resultSetMetaData?.rowType || []).map((c) => c.name);
    const rows = (result?.data || []).map((row) =>
      Object.fromEntries(columns.map((col, i) => [col.toLowerCase(), row[i]]))
    );

    return Response.json({
      configured: true,
      source: 'snowflake',
      rowCount: rows.length,
      rows,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}