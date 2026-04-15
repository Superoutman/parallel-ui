export type BookObjectVariant = 'detail' | 'stacked'
export type BookObjectSizePreset = 'sm' | 'md' | 'lg'
export type BookObjectSize = BookObjectSizePreset | number

export type BookObjectGradientStop = {
  color: string
  opacity: number
  position: number
}

export type BookObjectGradientToken = {
  angle: number
  stops: [BookObjectGradientStop, BookObjectGradientStop, BookObjectGradientStop]
}

export type BookObjectShadowLayerToken = {
  x: number
  y: number
  blur: number
  color: string
  opacity: number
}

export type BookObjectShadowToken = BookObjectShadowLayerToken[]

export type BookObjectTokens = {
  depthColor: string
  pageBorderColor: string
  pageColors: [string, string, string]
  effectBorderColor: string
  effectGradient: BookObjectGradientToken
  lightGradient: BookObjectGradientToken
  frontShadowCollapsed: BookObjectShadowToken
  frontShadowExpanded: BookObjectShadowToken
  backShadowCollapsed: BookObjectShadowToken
  backShadowExpanded: BookObjectShadowToken
  backShadowBleedless: BookObjectShadowToken
}

export type BookObjectDesignTokenSource = {
  color?: {
    depth?: string
    pageBorder?: string
    page1?: string
    page2?: string
    page3?: string
    effectBorder?: string
  }
  gradient?: {
    effect?: Partial<BookObjectGradientToken>
    light?: Partial<BookObjectGradientToken>
  }
  shadow?: {
    frontCollapsed?: BookObjectShadowToken
    frontExpanded?: BookObjectShadowToken
    backCollapsed?: BookObjectShadowToken
    backExpanded?: BookObjectShadowToken
    backBleedless?: BookObjectShadowToken
  }
}

export const bookObjectSizePresets: Record<BookObjectSizePreset, number> = {
  sm: 96,
  md: 112,
  lg: 144,
}

export const defaultBookObjectTokens: BookObjectTokens = {
  depthColor: '#2A2A2A',
  pageBorderColor: 'rgba(0,0,0,0.20)',
  pageColors: ['#FFFFFF', '#F1F1F1', '#E7E7E7'],
  effectBorderColor: 'rgba(0,0,0,0.08)',
  effectGradient: {
    angle: 90,
    stops: [
      { color: '#FFFFFF', opacity: 0.14, position: 0 },
      { color: '#FFFFFF', opacity: 0.08, position: 38 },
      { color: '#FFFFFF', opacity: 0, position: 100 },
    ],
  },
  lightGradient: {
    angle: 90,
    stops: [
      { color: '#FFFFFF', opacity: 0, position: 0 },
      { color: '#FFFFFF', opacity: 0.18, position: 62 },
      { color: '#FFFFFF', opacity: 0.46, position: 100 },
    ],
  },
  frontShadowCollapsed: [
    { x: 5, y: 2, blur: 12, color: '#000000', opacity: 0.1 },
    { x: 10, y: 0, blur: 16, color: '#000000', opacity: 0.1 },
  ],
  frontShadowExpanded: [
    { x: 8, y: 4, blur: 16, color: '#000000', opacity: 0.12 },
    { x: 16, y: 0, blur: 24, color: '#000000', opacity: 0.12 },
  ],
  backShadowCollapsed: [{ x: 1, y: 1, blur: 3, color: '#000000', opacity: 0.16 }],
  backShadowExpanded: [{ x: 1, y: 1, blur: 4, color: '#000000', opacity: 0.2 }],
  backShadowBleedless: [{ x: 2, y: 2, blur: 5, color: '#000000', opacity: 0.25 }],
}

function mergeGradient(
  base: BookObjectGradientToken,
  override?: Partial<BookObjectGradientToken>,
): BookObjectGradientToken {
  return {
    angle: override?.angle ?? base.angle,
    stops: base.stops.map((baseStop, index) => ({
      ...baseStop,
      ...override?.stops?.[index],
    })) as [BookObjectGradientStop, BookObjectGradientStop, BookObjectGradientStop],
  }
}

export function mapDesignTokensToBookObjectTokens(source?: BookObjectDesignTokenSource): Partial<BookObjectTokens> {
  if (!source) {
    return {}
  }

  return {
    depthColor: source.color?.depth,
    pageBorderColor: source.color?.pageBorder,
    pageColors:
      source.color?.page1 && source.color?.page2 && source.color?.page3
        ? [source.color.page1, source.color.page2, source.color.page3]
        : undefined,
    effectBorderColor: source.color?.effectBorder,
    effectGradient: source.gradient?.effect ? mergeGradient(defaultBookObjectTokens.effectGradient, source.gradient.effect) : undefined,
    lightGradient: source.gradient?.light ? mergeGradient(defaultBookObjectTokens.lightGradient, source.gradient.light) : undefined,
    frontShadowCollapsed: source.shadow?.frontCollapsed,
    frontShadowExpanded: source.shadow?.frontExpanded,
    backShadowCollapsed: source.shadow?.backCollapsed,
    backShadowExpanded: source.shadow?.backExpanded,
    backShadowBleedless: source.shadow?.backBleedless,
  }
}

export function resolveBookObjectTokens(tokens?: Partial<BookObjectTokens>): BookObjectTokens {
  return {
    ...defaultBookObjectTokens,
    ...tokens,
    pageColors: tokens?.pageColors ?? defaultBookObjectTokens.pageColors,
    effectGradient: tokens?.effectGradient ?? defaultBookObjectTokens.effectGradient,
    lightGradient: tokens?.lightGradient ?? defaultBookObjectTokens.lightGradient,
    frontShadowCollapsed: tokens?.frontShadowCollapsed ?? defaultBookObjectTokens.frontShadowCollapsed,
    frontShadowExpanded: tokens?.frontShadowExpanded ?? defaultBookObjectTokens.frontShadowExpanded,
    backShadowCollapsed: tokens?.backShadowCollapsed ?? defaultBookObjectTokens.backShadowCollapsed,
    backShadowExpanded: tokens?.backShadowExpanded ?? defaultBookObjectTokens.backShadowExpanded,
    backShadowBleedless: tokens?.backShadowBleedless ?? defaultBookObjectTokens.backShadowBleedless,
  }
}

export function resolveBookObjectSize(size?: BookObjectSize): number {
  if (typeof size === 'number') {
    return size
  }

  if (!size) {
    return bookObjectSizePresets.md
  }

  return bookObjectSizePresets[size]
}

export function gradientTokenToCss(token: BookObjectGradientToken): string {
  const stops = token.stops
    .map((stop) => `${withOpacity(stop.color, stop.opacity)} ${stop.position}%`)
    .join(', ')

  return `linear-gradient(${token.angle}deg, ${stops})`
}

export function gradientTokenToNativeColors(token: BookObjectGradientToken): [string, string, string] {
  return token.stops.map((stop) => withOpacity(stop.color, stop.opacity)) as [string, string, string]
}

export function gradientTokenToNativeLocations(token: BookObjectGradientToken): [number, number, number] {
  return token.stops.map((stop) => stop.position / 100) as [number, number, number]
}

export function shadowTokenToCss(token: BookObjectShadowToken): string {
  if (token.length === 0) {
    return 'none'
  }

  return token
    .map((layer) => `${layer.x}px ${layer.y}px ${layer.blur}px ${withOpacity(layer.color, layer.opacity)}`)
    .join(', ')
}

export function getPrimaryShadowLayer(token: BookObjectShadowToken): BookObjectShadowLayerToken | null {
  return token[0] ?? null
}

function withOpacity(color: string, opacity = 1): string {
  const normalized = color.trim()

  if (normalized.startsWith('#')) {
    const hex = normalized.slice(1)
    const pairs =
      hex.length === 3
        ? hex.split('').map((char) => char + char)
        : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
    const [r, g, b] = pairs.map((pair) => Number.parseInt(pair, 16))
    return `rgba(${r},${g},${b},${opacity})`
  }

  if (normalized.startsWith('rgb(')) {
    return normalized.replace('rgb(', 'rgba(').replace(')', `,${opacity})`)
  }

  if (normalized.startsWith('rgba(')) {
    return normalized.replace(/rgba\(([^)]+),\s*[\d.]+\)$/u, `rgba($1,${opacity})`)
  }

  return normalized
}

const BASE = {
  frameWidth: 105,
  frameHeight: 112,
  frontAspectRatio: 3 / 4,
  frontHeight: 112,
  backTop: 2.24,
  backHeight: 106.52,
  insideTop: 4.36,
  insideHeight: 105.28,
  effectWidth: 24,
  backRadiusLeft: 2,
  backRadiusRight: 6,
  pageRadiusLeft: 1,
  pageRadiusRight: 6,
  frontRadiusLeft: 2,
  frontRadiusRight: 6,
  pageBorderWidth: 0.75,
  effectBorderWidth: 2,
  pageWidthRatio: 0.98,
  stackedScale: 1.35,
} as const

type DetailStateMetrics = {
  backLeft: number
  backWidth: number
  insideLeft: number
  insideWidth: number
  insideOpacity: number
  frontLeft: number
  effectLeft: number
  effectOpacity: number
  lightOpacity: number
  backShadow: BookObjectShadowToken
  frontShadow: BookObjectShadowToken
  pageTranslations: [number, number, number]
}

function getDetailStateMetrics(expanded: boolean, hideLeftBleed: boolean, tokens: BookObjectTokens): DetailStateMetrics {
  if (!expanded) {
    return {
      backLeft: 3,
      backWidth: 84,
      insideLeft: 3,
      insideWidth: 84,
      insideOpacity: 0,
      frontLeft: 3,
      effectLeft: 6,
      effectOpacity: 0.72,
      lightOpacity: 0.14,
      backShadow: tokens.backShadowCollapsed,
      frontShadow: tokens.frontShadowCollapsed,
      pageTranslations: [-1, 0, -1],
    }
  }

  if (hideLeftBleed) {
    return {
      backLeft: 0,
      backWidth: 93.6075,
      insideLeft: 2,
      insideWidth: 90.2475,
      insideOpacity: 1,
      frontLeft: 0,
      effectLeft: 4,
      effectOpacity: 1,
      lightOpacity: 0.22,
      backShadow: tokens.backShadowBleedless,
      frontShadow: [],
      pageTranslations: [0, -2, -4],
    }
  }

  return {
    backLeft: 0,
    backWidth: 93.6,
    insideLeft: 3,
    insideWidth: 88.4,
    insideOpacity: 1,
    frontLeft: 0,
    effectLeft: 4,
    effectOpacity: 1,
    lightOpacity: 0.22,
    backShadow: tokens.backShadowExpanded,
    frontShadow: tokens.frontShadowExpanded,
    pageTranslations: [0, -2, -4],
  }
}

export function getBookObjectMetrics(options?: {
  expanded?: boolean
  hideLeftBleed?: boolean
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
}) {
  const expanded = options?.expanded ?? true
  const hideLeftBleed = options?.hideLeftBleed ?? false
  const size = resolveBookObjectSize(options?.size)
  const scale = size / BASE.frameHeight
  const tokens = resolveBookObjectTokens(options?.tokens)
  const detail = getDetailStateMetrics(expanded, hideLeftBleed, tokens)

  const px = (value: number) => value * scale

  return {
    tokens,
    scale,
    frame: {
      width: px(BASE.frameWidth),
      height: px(BASE.frameHeight),
    },
    front: {
      width: px(BASE.frontHeight * BASE.frontAspectRatio),
      height: px(BASE.frontHeight),
      left: px(detail.frontLeft),
      radiusLeft: px(BASE.frontRadiusLeft),
      radiusRight: px(BASE.frontRadiusRight),
      shadow: detail.frontShadow,
      shadowCss: shadowTokenToCss(detail.frontShadow),
    },
    back: {
      top: px(BASE.backTop),
      left: px(detail.backLeft),
      width: px(detail.backWidth),
      height: px(BASE.backHeight),
      radiusLeft: px(BASE.backRadiusLeft),
      radiusRight: px(BASE.backRadiusRight),
      shadow: detail.backShadow,
      shadowCss: shadowTokenToCss(detail.backShadow),
    },
    inside: {
      top: px(BASE.insideTop),
      left: px(detail.insideLeft),
      width: px(detail.insideWidth),
      height: px(BASE.insideHeight),
      opacity: detail.insideOpacity,
    },
    page: {
      width: px(detail.insideWidth * BASE.pageWidthRatio),
      radiusLeft: px(BASE.pageRadiusLeft),
      radiusRight: px(BASE.pageRadiusRight),
      borderWidth: px(BASE.pageBorderWidth),
      translations: detail.pageTranslations.map(px) as [number, number, number],
    },
    effect: {
      left: px(detail.effectLeft),
      width: px(BASE.effectWidth),
      borderWidth: px(BASE.effectBorderWidth),
      opacity: detail.effectOpacity,
      gradientCss: gradientTokenToCss(tokens.effectGradient),
    },
    light: {
      opacity: detail.lightOpacity,
      gradientCss: gradientTokenToCss(tokens.lightGradient),
    },
    stacked: {
      scale: BASE.stackedScale,
      width: px(BASE.frameWidth + 14),
      height: px(BASE.frameHeight * BASE.stackedScale),
    },
  }
}
