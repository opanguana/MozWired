import {
  decimalMznRateToMinor,
  latestExchangeRateRecord,
  validateExchangeRateData,
} from './exchange-rates';

const record = {
  source: 'Banco de Moçambique',
  sourceUrl: 'https://example.com/rates',
  effectiveAt: '2026-07-08T15:30:00+02:00',
  reviewedAt: '2026-07-08T16:00:00+02:00',
  mznMinorPerForeignMajor: { USD: 6455, ZAR: 394, EUR: 7359 },
};

describe('exchange-rate data', () => {
  it('parses reviewed decimal rates without floating-point storage', () => {
    expect(decimalMznRateToMinor('64.55')).toBe(6455);
    expect(decimalMznRateToMinor('3.9')).toBe(390);
    expect(() => decimalMznRateToMinor('64.555')).toThrow('at most 2 places');
  });

  it('requires chronological, reviewed records', () => {
    expect(
      latestExchangeRateRecord(validateExchangeRateData({ baseCurrency: 'MZN', records: [record] }))
    ).toEqual(record);

    expect(() =>
      validateExchangeRateData({
        baseCurrency: 'MZN',
        records: [
          record,
          {
            ...record,
            effectiveAt: '2026-07-07T15:30:00+02:00',
            reviewedAt: '2026-07-07T16:00:00+02:00',
          },
        ],
      })
    ).toThrow('ordered by increasing effectiveAt');
  });
});
