import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { CURRENCY_COOKIE } from '@/lib/currency-resolution';
import { isValidLocalePreferences, LANGUAGE_COOKIE, MARKET_COOKIE } from '@/lib/locale-preferences';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  if (!isValidLocalePreferences(body)) {
    return NextResponse.json({ error: 'Unsupported locale preferences.' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const options = {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  };

  cookieStore.set(LANGUAGE_COOKIE, body.language, options);
  cookieStore.set(MARKET_COOKIE, body.market, options);
  cookieStore.set(CURRENCY_COOKIE, body.currency, options);

  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
