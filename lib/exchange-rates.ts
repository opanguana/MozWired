import { z } from 'zod';

const isoDateWithTimezone = z
  .string()
  .refine(
    (value) => /(Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(Date.parse(value)),
    'Use a valid ISO 8601 date with an explicit timezone.'
  );

const rateRecordSchema = z.object({
  source: z.string().trim().min(1),
  sourceUrl: z.url(),
  effectiveAt: isoDateWithTimezone,
  reviewedAt: isoDateWithTimezone,
  mznMinorPerForeignMajor: z.object({
    USD: z.number().int().positive().safe(),
    ZAR: z.number().int().positive().safe(),
    EUR: z.number().int().positive().safe(),
  }),
});

export const exchangeRateDataSchema = z
  .object({
    baseCurrency: z.literal('MZN'),
    records: z.array(rateRecordSchema).min(1),
  })
  .superRefine(({ records }, context) => {
    records.forEach((record, index) => {
      if (Date.parse(record.reviewedAt) < Date.parse(record.effectiveAt)) {
        context.addIssue({
          code: 'custom',
          path: ['records', index, 'reviewedAt'],
          message: 'reviewedAt cannot be earlier than effectiveAt.',
        });
      }

      if (
        index > 0 &&
        Date.parse(record.effectiveAt) <= Date.parse(records[index - 1].effectiveAt)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['records', index, 'effectiveAt'],
          message: 'Rate records must be ordered by increasing effectiveAt.',
        });
      }
    });
  });

export type ExchangeRateData = z.infer<typeof exchangeRateDataSchema>;
export type ExchangeRateRecord = ExchangeRateData['records'][number];

export function validateExchangeRateData(input: unknown): ExchangeRateData {
  return exchangeRateDataSchema.parse(input);
}

export function latestExchangeRateRecord(data: ExchangeRateData): ExchangeRateRecord {
  return data.records[data.records.length - 1];
}

export function decimalMznRateToMinor(value: string): number {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(`Invalid MZN rate "${value}". Use a positive decimal with at most 2 places.`);
  }

  const [major, fraction = ''] = value.split('.');
  const amount = Number(major) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error(`Invalid MZN rate "${value}".`);
  }
  return amount;
}

export function percentageChange(previous: number, next: number): number {
  return Math.abs(next - previous) / previous;
}
