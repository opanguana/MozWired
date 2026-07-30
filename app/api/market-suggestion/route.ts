import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  canSuggestConvertedCurrency,
  CURRENCY_COOKIE,
  suggestedCurrencyForCountry,
} from '@/lib/currency-resolution';

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.has(CURRENCY_COOKIE) || !canSuggestConvertedCurrency()) {
    return response({ suggestion: null });
  }

  const requestHeaders = await headers();
  const country =
    requestHeaders.get('x-vercel-ip-country') ??
    requestHeaders.get('cf-ipcountry') ??
    requestHeaders.get('x-country-code');
  const suggestion = suggestedCurrencyForCountry(country);

  return response({
    suggestion:
      suggestion && suggestion !== 'MZN'
        ? { country: country?.toUpperCase(), currency: suggestion }
        : null,
  });
}

function response(body: object) {
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie, X-Vercel-IP-Country, CF-IPCountry, X-Country-Code',
    },
  });
}
