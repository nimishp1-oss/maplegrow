import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { sanitizeProfile } from '../../shared/profileSanitizer.ts';

// ---------------------------------------------------------------------------
// "Maple AI" in-app assistant (server-side only).
// Answers a student's finance question, grounded in their own profile numbers.
// Uses the platform's built-in Gemini access (gemini_3_8_flash — non-default
// model, uses more integration credits). No API key exists in app code.
// ---------------------------------------------------------------------------

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json().catch(() => ({}));
    const question = typeof payload.question === 'string' ? payload.question.slice(0, 600).trim() : '';
    if (!question) return Response.json({ error: 'A question is required.' }, { status: 400 });

    const profile = sanitizeProfile(payload.profile);

    const prompt = `You are "Maple AI", the friendly assistant inside Maple Grow, a student financial planning app.

The student's financial profile (monthly figures unless noted):
${JSON.stringify(profile, null, 2)}

The student asks: "${question}"

Guidelines:
- Be warm, practical, and concise (under 120 words), written for a student audience.
- You may reference the profile numbers above to personalize your answer, but never invent statistics or figures you weren't given. General financial concepts (compounding, emergency funds, credit scores, etc.) are fine to explain.
- Never recommend specific stocks or funds. Explain concepts and trade-offs instead.
- End with one short, practical next step.`;

    const answer = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gemini_3_8_flash',
    });

    return Response.json({ answer });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}