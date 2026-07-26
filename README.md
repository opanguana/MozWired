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
