# @parallel-ui/book-object

Reusable editorial book-cover object for Web and React Native.

This package currently exposes two visual variants:

- `BookObject`: neutral public component with `variant="detail" | "stacked"`
- `DetailBookObject`: compatibility name for the same object inside this repo
- `StackedBookObject`: the discovery-card sized stacked presentation used in the "今日好书" area

This package now also exposes:

- shared metrics via `getBookObjectMetrics`
- public size presets via `bookObjectSizePresets`
- token mapping helpers via `mapDesignTokensToBookObjectTokens`

## Build

```bash
npm run build -w @parallel-ui/book-object
```

Build output is written to `dist/`.

## Package Check

```bash
npm pack
```

## Current Status

This package is currently developed inside the `citic-academy` monorepo and is still marked `private`.

The intended future standalone form is:

- repo: `parallel-ui`
- package: `@parallel-ui/book-object`

When extracted into the standalone repo, update:

- package name
- repository / bugs / homepage metadata
- import examples in this README

## Web

```tsx
import { BookObject, StackedBookObject } from "@parallel-ui/book-object/web"

const data = {
  title: "货币权力",
  cover: "/covers/4101001547.jpg",
  coverKey: "4101001547",
}

<StackedBookObject data={data} />
<BookObject data={data} variant="stacked" />
<BookObject data={data} expanded />
<BookObject data={data} size="lg" />
```

## React Native

```tsx
import { Animated } from "react-native"
import { BookObject, StackedBookObject } from "@parallel-ui/book-object/native"

const data = {
  title: "货币权力",
  cover: require("../assets/covers/4101001547.jpg"),
  coverKey: "4101001547",
}

const progress = new Animated.Value(1)

<StackedBookObject data={data} />
<BookObject data={data} variant="stacked" />
<BookObject data={data} progress={progress} />
<BookObject data={data} size="lg" progress={progress} />
```

## Size API

The public `size` prop is available on both web and native detail / stacked variants.

```ts
type BookObjectSize = "sm" | "md" | "lg" | number
```

Built-in presets:

- `"sm"` = `96`
- `"md"` = `112`
- `"lg"` = `144`

`number` means the detail-book height in pixels (web) or density-independent units (native).
All other geometry is derived proportionally from that single base size.

## Token API

The package now uses structured tokens instead of raw gradient/shadow strings.

```ts
import type { BookObjectTokens } from "@parallel-ui/book-object"
```

Important token groups:

- `pageColors`
- `effectGradient`
- `lightGradient`
- `frontShadowCollapsed`
- `frontShadowExpanded`
- `backShadowCollapsed`
- `backShadowExpanded`
- `backShadowBleedless`

Example:

```tsx
<BookObject
  data={data}
  size="lg"
  tokens={{
    depthColor: "#1f2937",
    pageColors: ["#ffffff", "#f6f2ea", "#ebe4d6"],
  }}
/>
```

## Design Source Mapping

For future token-source integration, map higher-level design tokens into component tokens first:

```ts
import { mapDesignTokensToBookObjectTokens } from "@parallel-ui/book-object"

const bookTokens = mapDesignTokensToBookObjectTokens({
  color: {
    depth: "#1f2937",
    pageBorder: "rgba(0,0,0,0.16)",
    page1: "#ffffff",
    page2: "#f7f3eb",
    page3: "#ece3d2",
  },
})
```

Then pass the mapped result to `tokens`.

## Shared Metrics

If a product team needs layout-aware integration, consume the same geometry model used by both renderers:

```ts
import { getBookObjectMetrics } from "@parallel-ui/book-object"

const metrics = getBookObjectMetrics({
  size: "lg",
  expanded: true,
})
```

## Book Data Shape

Minimal required fields:

```ts
{
  title: string
  cover: string | ImageSourcePropType
  coverKey: string
  depthColor?: string
  depthColorOverride?: string
}
```

The package still accepts the legacy `book` prop for compatibility inside this repo, but `data` is the preferred public API.

## Current Boundary

This package owns:

- book object geometry
- page stack styling
- front-cover highlight and shadows
- depth color resolution
- shared cross-platform size metrics
- tokenized visual structure for future design-source integration

This package does not yet own:

- surrounding card layout
- click handlers
- book title/author metadata blocks
- fully shared animation API

## Next Step

Before publishing externally, add:

- screenshots and visual regression checks
- release-level API docs for tokens and metrics
