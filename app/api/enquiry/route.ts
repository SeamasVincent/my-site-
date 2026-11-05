import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const required = (value: unknown, max = 3000) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 }); }
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ accepted: true });
  const kind = body.kind;
  if (kind !== 'contact' && kind !== 'speaking') return NextResponse.json({ error: 'This form could not be processed.' }, { status: 400 });
  if (!required(body.name, 160) || !required(body.email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email)) || !required(body.topic, 1200)) {
    return NextResponse.json({ error: 'Please provide your name, a valid email address and the requested enquiry details.' }, { status: 400 });
  }
  if (kind === 'contact' && !required(body.message, 6000)) return NextResponse.json({ error: 'Please add a message before sending.' }, { status: 400 });
  if (kind === 'speaking' && (!required(body.format, 120) || !required(body.audience, 800) || !required(body.topic, 1200))) return NextResponse.json({ error: 'Please include the engagement format, audience and session focus.' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_TO_EMAIL || 'vincentseamas@gmail.com';
  if (!apiKey || !from) return NextResponse.json({ error: 'The enquiry service is not configured yet. Your entries are still here; please try again later.' }, { status: 503 });

  const clean = (key: string) => typeof body[key] === 'string' ? String(body[key]).trim().slice(0, 6000) : '';
  const lines = Object.entries(body).filter(([key, value]) => !['website','kind'].includes(key) && typeof value === 'string' && String(value).trim()).map(([key]) => `${key}: ${clean(key)}`);
  const subject = kind === 'speaking' ? `Speaking enquiry from ${clean('name')}` : `Website enquiry from ${clean('name')}`;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: clean('email'), subject, text: lines.join('\n\n') }),
    });
    if (!response.ok) return NextResponse.json({ error: 'The message could not be delivered just now. Your entries are still here; please try again.' }, { status: 502 });
    return NextResponse.json({ accepted: true });
  } catch {
    return NextResponse.json({ error: 'The message could not be delivered just now. Your entries are still here; please try again.' }, { status: 502 });
  }
}
