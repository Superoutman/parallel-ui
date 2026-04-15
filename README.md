# parallel-ui

Standalone component library workspace for reusable UI assets.

Current first package:

- `@parallel-ui/book-object`

## Repository Layout

```text
parallel-ui/
  packages/
    book-object/
```

## Quick Start

```bash
npm install
npm run build:book-object
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
