import { readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  decimalMznRateToMinor,
  latestExchangeRateRecord,
  percentageChange,
  validateExchangeRateData,
} from '../../lib/exchange-rates';

const LARGE_CHANGE_THRESHOLD = 0.15;

function option(name: string, args: string[]): string | undefined {
  const prefix = `--${name}=`;
  return args.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
}

async function main() {
  const args = process.argv.slice(2);
  const required = ['effective-at', 'reviewed-at', 'source', 'source-url', 'usd', 'zar', 'eur'];
  const values = Object.fromEntries(required.map((name) => [name, option(name, args)]));
  const missing = required.filter((name) => !values[name]);

  if (missing.length) {
    throw new Error(
      `Missing ${missing.map((name) => `--${name}`).join(', ')}. ` +
        'Rates use decimal MZN per one foreign major unit.'
    );
  }

  const targetPath = join(process.cwd(), 'data/exchange-rates.json');
  const current = validateExchangeRateData(JSON.parse(await readFile(targetPath, 'utf8')));
  const previous = latestExchangeRateRecord(current);
  const rates = {
    USD: decimalMznRateToMinor(values.usd!),
    ZAR: decimalMznRateToMinor(values.zar!),
    EUR: decimalMznRateToMinor(values.eur!),
  };

  const movements = (Object.keys(rates) as (keyof typeof rates)[]).map((currency) => ({
    currency,
    previous: previous.mznMinorPerForeignMajor[currency],
    next: rates[currency],
    change: percentageChange(previous.mznMinorPerForeignMajor[currency], rates[currency]),
  }));

  movements.forEach(({ currency, previous: oldRate, next, change }) => {
    console.log(
      `${currency}: ${(oldRate / 100).toFixed(2)} -> ${(next / 100).toFixed(2)} MZN (${(
        change * 100
      ).toFixed(2)}%)`
    );
  });

  if (
    movements.some(({ change }) => change > LARGE_CHANGE_THRESHOLD) &&
    !args.includes('--allow-large-change')
  ) {
    throw new Error(
      'A rate moved by more than 15%. Verify the source and pass --allow-large-change explicitly.'
    );
  }

  const candidate = validateExchangeRateData({
    ...current,
    records: [
      ...current.records,
      {
        source: values.source,
        sourceUrl: values['source-url'],
        effectiveAt: values['effective-at'],
        reviewedAt: values['reviewed-at'],
        mznMinorPerForeignMajor: rates,
      },
    ],
  });

  if (!args.includes('--apply')) {
    console.log('Dry run complete. No files changed; repeat with --apply after review.');
    return;
  }

  const temporaryPath = `${targetPath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, `${JSON.stringify(candidate, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, targetPath);
  console.log(`Appended reviewed rates to ${targetPath}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
