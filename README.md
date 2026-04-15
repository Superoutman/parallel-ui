# parallel-ui

Standalone component library workspace for reusable UI assets.

Current first package:

- `@parallel-ui/book-object`
- `@parallel-ui/playground-web`

## Repository Layout

```text
parallel-ui/
  apps/
    playground-web/
  packages/
    book-object/
```

## Quick Start

```bash
npm install
npm run dev
npm run build:book-object
```

`npm run dev` starts the local web playground at `http://127.0.0.1:4173`.
Use it to preview changes while editing `packages/book-object/src/web.tsx`.

## Daily Maintenance

Start from the latest remote state when the repo is shared or mirrored on another machine:

```bash
git status
git pull
npm install
```

During development:

```bash
npm run dev
```

To preview from a phone on the same Wi-Fi network:

```bash
npm run dev:mobile
```

Then open `http://<your-lan-ip>:4173` on the phone.

After changing the package source, verify the distributable build still works:

```bash
npm run build:book-object
npm pack -w @parallel-ui/book-object
```

When the change is ready to keep or share:

```bash
git add .
git commit -m "feat: describe your change"
git push
```

## Package Usage

Web:

```tsx
import { BookObject, StackedBookObject } from "@parallel-ui/book-object/web"
```

Native:

```tsx
import { BookObject, StackedBookObject } from "@parallel-ui/book-object/native"
```

## Publish Readiness

The workspace is prepared so `packages/book-object` can be packed or published independently.

## Automation

- CI workflow: `.github/workflows/ci.yml`
- Manual publish workflow: `.github/workflows/publish-book-object.yml`
- Release workflow: `.github/workflows/release.yml`
- Release instructions: [PUBLISHING.md](./PUBLISHING.md)
- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Versioning: Changesets in `.changeset/`
