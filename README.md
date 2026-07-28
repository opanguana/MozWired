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
deactivated:

```ts
export const siteAnnouncement = {
  id: 'workplace-specialist',
  enabled: false,
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
from the fixed, dated Banco de Moçambique sell rates in `config/currencies.ts`; they never replace
the stored MZN amount. Update the rates and `ratesUpdatedAt` together. The project uses ordinary
mathematical rounding and does not apply commercial `.99` endings.

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
