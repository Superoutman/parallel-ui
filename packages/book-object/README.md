# @parallel-ui/book-object

Reusable editorial book-cover object for Web and React Native.

This package currently exposes two visual variants:

- `BookObject`: neutral public component with `variant="detail" | "stacked"`
- `DetailBookObject`: compatibility name for the same object inside this repo
- `StackedBookObject`: the discovery-card sized stacked presentation used in the "今日好书" area

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

This package does not yet own:

- surrounding card layout
- click handlers
- book title/author metadata blocks
- cross-platform shared animation API

## Next Step

Before publishing externally, add:

- explicit size variants instead of page-owned wrappers
- screenshots and visual regression checks
