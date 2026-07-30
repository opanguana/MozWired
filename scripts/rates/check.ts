import exchangeRateDataSource from '../../data/exchange-rates.json';
import { latestExchangeRateRecord, validateExchangeRateData } from '../../lib/exchange-rates';

const WARNING_AGE_DAYS = 7;
const CUTOFF_AGE_DAYS = 30;
const DAY_MS = 86_400_000;

try {
  const data = validateExchangeRateData(exchangeRateDataSource);
  const latest = latestExchangeRateRecord(data);
  const ageDays = Math.floor((Date.now() - Date.parse(latest.effectiveAt)) / DAY_MS);

  console.log(
    `Rates valid: ${data.records.length} reviewed record(s); latest ${latest.effectiveAt} from ${latest.source}.`
  );

  if (ageDays > CUTOFF_AGE_DAYS) {
    console.error(
      `Rates are ${ageDays} days old and exceed the ${CUTOFF_AGE_DAYS}-day conversion cutoff.`
    );
    process.exitCode = 1;
  } else if (ageDays > WARNING_AGE_DAYS) {
    console.warn(`Rates are ${ageDays} days old; review is recommended.`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
