import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { CURRENCY_COOKIE, isSupportedCurrency } from '@/lib/currency-resolution';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { currency?: unknown } | null;

  if (!isSupportedCurrency(body?.currency)) {
    return NextResponse.json({ error: 'Unsupported currency.' }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(CURRENCY_COOKIE, body.currency, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });

  return NextResponse.json(
    { currency: body.currency },
    { headers: { 'Cache-Control': 'private, no-store' } }
  );
}
