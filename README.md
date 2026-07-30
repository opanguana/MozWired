# MozWired

A responsive service storefront built with Next.js, React, TypeScript, and Tailwind CSS.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local development

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm test
npm run format:check
npm run build
```

Use `npm run format` to format supported source files.

## Environment and secrets

Copy `.env.example` to `.env.local` and keep local environment files untracked. Values prefixed
with `NEXT_PUBLIC_` are shipped to the browser and must never contain secrets. Store production
secrets in the deployment platform's encrypted secret manager.

Before opening a pull request, inspect staged changes and run a secret scanner such as Gitleaks:

```bash
git diff --cached
gitleaks git --redact
```

## Site announcement

The optional banner below the navigation is controlled in `config/announcement.ts`. It is currently
active:

```ts
export const siteAnnouncement = {
  id: 'workplace-specialist',
  enabled: true,
  message: 'Build a safer, faster workplace with one technology partner.',
  linkLabel: 'Talk to a specialist',
  linkHref: '#support',
  tone: 'promotion',
  startsAt: null,
  endsAt: null,
};
```

To activate it immediately, change `enabled` to `true`. To schedule it, keep `enabled: true` and
provide ISO 8601 dates with an explicit timezone:

```ts
startsAt: '2026-08-01T00:00:00+02:00',
endsAt: '2026-08-31T23:59:59+02:00',
```

Use a unique `id` for every campaign. Supported tones are `info`, `promotion`, and `donation`.
Both link fields are optional; omit `linkLabel` and `linkHref` for a text-only announcement. Commit
the configuration change and deploy it through the normal review process. Set `enabled` back to
`false` for an immediate manual deactivation.

## Product catalogue and safe updates

`data/catalog-source.json` is the single source of truth for product cards, navigation links,
detail pages, variants, availability, media, and pricing. Every record has a stable `id` and
`slug`; every variant has a stable `sku`; every image has a stable media ID. Published and draft
records use the same schema in `catalog/schema.ts`.

MZN is the authoritative store currency. Prices use integer minor units, so `1_055_000` represents
`10,550.00 MZN`. Prices exclude VAT. Do not store formatted price strings or derive local product
prices from foreign retail prices.

Customers can view verified prices in MZN, USD, ZAR, or EUR. Foreign values are estimates produced
from the fixed, dated Banco de Moçambique sell rates in `data/exchange-rates.json`; they never
replace the stored MZN amount. The project uses ordinary mathematical rounding and does not apply
commercial `.99` endings.

Check the reviewed rate history with:

```bash
npm run rates:check
```

Prepare a dry-run update using decimal MZN required to buy one major foreign unit:

```bash
npm run rates:update -- \
  --effective-at="2026-07-30T15:30:00+02:00" \
  --reviewed-at="2026-07-30T16:00:00+02:00" \
  --source="Banco de Moçambique" \
  --source-url="https://www.bancomoc.mz/en/areas-of-expertise/markets/foreign-exchange-market/" \
  --usd="64.55" --zar="3.94" --eur="73.59"
```

Review the printed changes, then repeat with `--apply`. A movement above 15% is rejected unless the
reviewer also supplies `--allow-large-change`. Applying an update appends a complete record
atomically so previous rates remain auditable. Rates older than 7 days produce an operational
warning; rates older than 30 days fail the health check and converted-currency suggestions stop,
while the authoritative MZN storefront remains available.

Currency selection follows the store localization priority used by modern international
storefronts:

1. A valid customer-selected currency saved in the `mw_currency` cookie.
2. A legacy valid `localStorage` preference, migrated to that cookie.
3. MZN as the safe fallback.

Supported edge country headers may produce a dismissible currency suggestion, but never switch the
customer automatically. Mozambique maps to MZN, the United States to USD, South Africa and the
rand monetary area to ZAR, and euro-area markets to EUR. Unmapped countries remain in MZN. Explicit
selection always wins. Suggestions are suppressed when the configured rates are older than
`maximumSuggestionRateAgeDays`; update the rates, source date, and accessibility disclosure together.
The location endpoint neither stores nor returns an IP address.

The navbar combines language, shopping market, and display currency in one staged preferences
dialog. English and Portuguese preferences are supported, but Portuguese is explicitly marked as
translation-in-progress and the document remains tagged as English until translated page content is
available. Supported shopping markets are Mozambique, South Africa, the United States, and the euro
area. A market recommends its common configured currency without silently replacing a separately
selected currency. Clicking **Apply preferences** validates and persists all three values in the
`mw_language`, `mw_market`, and `mw_currency` cookies; Cancel, Escape, and backdrop dismissal discard
the staged changes.

Interface translation resources live under `locales/`. English is the required fallback and
Mozambican Portuguese uses the BCP 47 tag `pt-MZ`. Missing Portuguese messages fall back to English
and emit a development warning; a translation key is never shown to customers. Keep Portuguese
marked incomplete in `config/locales.ts` until the rendered routes, metadata, disclosures, and
accessibility text have all been reviewed.

Product names, brands, and SKUs remain language-neutral. Editorial card copy lives in each
catalogue product's `content` object. English content must be approved. Portuguese starts as a draft
with nullable copy and becomes customer-visible only after both fields are reviewed and its status
is changed to `approved`; otherwise presentation falls back to English.

Products without an approved MZN amount deliberately use `"pricing": null` and
`"availability": "price_on_request"`, which displays `Contact for MZN price`. Add a verified price
only after an authoritative local amount is approved:

```json
{
  "currency": "MZN",
  "amountMinor": 1055000,
  "label": "from",
  "vatIncluded": false,
  "effectiveFrom": null,
  "effectiveUntil": null
}
```

Before opening a pull request, run:

```bash
npm run catalog:validate
npm test
npm run build
```

For bulk changes, export a JSON array using the catalogue schema and dry-run it first:

```bash
npm run catalog:import -- ./incoming-products.json
npm run catalog:import -- ./incoming-products.json --apply
```

The importer validates the entire candidate, verifies referenced images, refuses accidental product
removals, and replaces the catalogue atomically only with `--apply`. An intentional removal also
requires `--allow-removals`. Review and commit the JSON diff; CI validates the catalogue before
lint, tests, and build. A failed deployment leaves the previously deployed Git revision intact.
Rollback is a normal `git revert <catalog-commit>`.

Use `status: "draft"` to keep a record out of customer-facing selectors. Scheduled prices belong in
`scheduledPrices` with explicit timezone-bearing `effectiveFrom` and `effectiveUntil` values.
Because this site is statically deployed, a scheduled boundary becomes visible on the next build;
use a scheduled deployment when exact activation time matters.

For product media, place assets under `public/images/`, then add them to the product's structured
media collection:

```json
{
  "media": {
    "primaryImageId": "galaxy-a06-main",
    "images": [
      {
        "id": "galaxy-a06-main",
        "role": "main",
        "src": "/images/products/smartphones/galaxy-a06-main.webp",
        "alt": "Samsung Galaxy A06 front view",
        "sortOrder": 0
      },
      {
        "id": "galaxy-a06-back",
        "role": "gallery",
        "src": "/images/products/smartphones/galaxy-a06-back.webp",
        "alt": "Samsung Galaxy A06 rear view",
        "sortOrder": 1
      }
    ]
  }
}
```

Cards and product pages select `primaryImageId`; gallery images remain ordered by `sortOrder`.
Image IDs and sort orders must be unique within each product, the primary image must exist and use
the `main` role, all assets are checked during catalogue validation, and every image requires useful
alternative text. Use `"media": null` to retain the accessible “Image coming soon” placeholder.

## Git workflow

Create a focused branch from the current default branch:

```bash
git switch -c feature/short-description
```

Use Conventional Commits and keep each commit limited to one concern. Push the branch and open a
pull request describing the behavior change, verification performed, and rollback considerations.

## Releases

The project follows Semantic Versioning. Update `CHANGELOG.md`, then create an annotated release
tag:

```bash
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

## Rollback

Prefer a new revert commit so shared history remains intact:

```bash
git revert <commit-sha>
```

To roll back a release, revert the release commits, run all quality checks, and publish a new patch
version. Do not move or delete an already published release tag.
