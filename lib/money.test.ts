import { convertMznMinor, formatMinorUnits, formatProductPrice } from './money';
import { mznPrice } from '@/types/money';

describe('money utilities', () => {
  it('keeps MZN as the authoritative amount', () => {
    expect(convertMznMinor(1_055_000, 'MZN')).toBe(1_055_000);
    expect(formatProductPrice(mznPrice(1_055_000), 'MZN')).toEqual({
      text: expect.stringMatching(/MZN\s*10,550/),
      approximate: false,
    });
  });

  it('converts MZN using integer arithmetic and labels foreign values approximate', () => {
    expect(formatProductPrice(mznPrice(1_055_000, 'from'), 'USD')).toEqual({
      text: expect.stringMatching(/^Approx\. From USD\s*163\.44$/),
      approximate: true,
    });
    expect(formatProductPrice(mznPrice(1_055_000), 'ZAR')).toEqual({
      text: expect.stringMatching(/^Approx\. ZAR\s*2,678$/),
      approximate: true,
    });
    expect(formatProductPrice(mznPrice(1_055_000), 'EUR')).toEqual({
      text: expect.stringMatching(/^Approx\. EUR\s*143\.36$/),
      approximate: true,
    });
  });

  it('uses a safe contact state for missing prices', () => {
    expect(formatProductPrice(null, 'USD')).toEqual({
      text: 'Contact for MZN price',
      approximate: false,
    });
  });

  it('rejects invalid minor-unit amounts', () => {
    expect(() => formatMinorUnits(Number.NaN, 'MZN')).toThrow(RangeError);
    expect(() => convertMznMinor(-1, 'USD')).toThrow(RangeError);
  });
});
