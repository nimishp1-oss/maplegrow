import { createClientFromRequest } from 'npm@base44sdk@0.8.49';
import { sanitizeProfile } from '....sharedprofileSanitizer.ts';

 ---------------------------------------------------------------------------
 AI financial analysis for Maple Grow (server-side only).

 Uses the platform's built-in Gemini access (Core.InvokeLLM, model
 gemini_3_8_flash) — no API key exists in the frontend, and none is stored
 in app code. Non-default models consume more integration credits.

 Flow Frontend - this function - Snowflake (education stats, via the
 snowflakeEducationData backend function) + Gemini. Gemini is instructed
 to use ONLY the numbers it is given, so it never invents statistics.
 ---------------------------------------------------------------------------

const ANALYSIS_SCHEMA = {
  type 'object',
  properties {
    headline { type 'string' },
    summary { type 'string' },
    strengths { type 'array', items { type 'string' }, maxItems 3 },
    watchOuts { type 'array', items { type 'string' }, maxItems 3 },
    suggestions { type 'array', items { type 'string' }, maxItems 3 },
  },
  required ['headline', 'summary', 'strengths', 'watchOuts', 'suggestions'],
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error 'Unauthorized' }, { status 401 });

    const payload = await req.json().catch(() = ({}));
    const profile = sanitizeProfile(payload.profile);
    if (Object.keys(profile).length === 0) {
      return Response.json({ error 'A financial profile is required.' }, { status 400 });
    }

     Ground the analysis in real Snowflake data when it is available.
    let educationStats = null;
    let statsSource = 'unavailable';
    try {
      const sfRes = await base44.functions.invoke('snowflakeEducationData', {});
      const sfData = sfRes.data  sfRes;
      if (sfData.configured && Array.isArray(sfData.rows) && sfData.rows.length  0) {
        educationStats = sfData.rows;
        statsSource = 'snowflake';
      }
    } catch (e) {
       Snowflake not configuredreachable yet — analysis proceeds without it.
    }

    const prompt = `You are a financial-education assistant for Maple Grow, a student financial planning app.

A student's financial profile (all figures monthly unless noted)
${JSON.stringify(profile, null, 2)}

Education-finance reference data retrieved from the app's Snowflake warehouse
${educationStats  JSON.stringify(educationStats, null, 2)  '(unavailable — do not cite any external statistics)'}

Rules
- Use ONLY the numbers provided above. Never invent or estimate new figures, averages, or statistics. If reference data is unavailable, analyze the profile alone.
- Be encouraging but honest, in plain language for a student audience.
- Keep each array item to one short sentence.

Return a JSON analysis of this student's budget, education debt, and investment plan.`;

    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model 'gemini_3_8_flash',
      response_json_schema ANALYSIS_SCHEMA,
    });

    return Response.json({
      analysis,
      statsSource,
      generatedFor user.id,
    });
  } catch (error) {
    return Response.json({ error error.message }, { status 500 });
  }
}