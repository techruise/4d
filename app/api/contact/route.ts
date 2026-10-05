import { NextResponse } from 'next/server';

/**
 * Contact endpoint for the /offer page form.
 * - Sends the lead to techruise5@gmail.com through Resend when RESEND_API_KEY is set.
 * - Without a key it just logs the lead (so the site still works while testing).
 */

const TO_EMAIL = 'techruise5@gmail.com';
const MAX = { name: 100, email: 200, package: 100, message: 3000 };
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max) : '';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: Request) {
  try {
    if (limited(req)) {
      return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
    }
    const body = await req.json();
    const name = clean(body?.name, MAX.name);
    const email = clean(body?.email, MAX.email);
    const pkg = clean(body?.package, MAX.package);
    const message = clean(body?.message, MAX.message);

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
      return NextResponse.json({ ok: false, error: 'Missing or invalid fields' }, { status: 400 });
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.log('[techruise contact – no RESEND_API_KEY set]', JSON.stringify({ name, email, pkg, message }));
      return NextResponse.json({ ok: true });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Techruise <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email,
        subject: `New Techruise enquiry from ${name}`,
        html: `<p><strong>Name:</strong> ${esc(name)}</p><p><strong>Email:</strong> ${esc(email)}</p><p><strong>Package:</strong> ${esc(pkg || 'Not sure yet')}</p><p><strong>Message:</strong></p><p>${esc(message).replace(/\n/g, '<br/>')}</p>`,
      }),
    });

    if (!res.ok) {
      console.error('[techruise contact] Resend error', res.status, (await res.text()).slice(0, 200));
      return NextResponse.json({ ok: false, error: 'Could not send' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }
}
