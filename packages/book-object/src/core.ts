export type BookObjectVariant = 'detail' | 'stacked'
export type BookObjectSizePreset = 'sm' | 'md' | 'lg'
export type BookObjectSize = BookObjectSizePreset | number
export type BookObjectMotionInput = {
  x: number
  y: number
}
export type BookObjectSensorSample = {
  gamma: number
  beta: number
}
export type BookObjectMotionConfig = {
  maxRotateX: number
  maxRotateY: number
  maxTranslateX: number
  maxTranslateY: number
  maxShadowOffsetX: number
  maxShadowOffsetY: number
  maxHighlightShiftX: number
  maxHighlightShiftY: number
  inputGammaLimit: number
  inputBetaLimit: number
}
export type BookObjectMotionState = {
  rotateX: number
  rotateY: number
  translateX: number
  translateY: number
  shadowOffsetX: number
  shadowOffsetY: number
  highlightShiftX: number
  highlightShiftY: number
}

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
  lg: 192,
}

export const defaultBookObjectMotionConfig: BookObjectMotionConfig = {
  maxRotateX: 14,
  maxRotateY: 16,
  maxTranslateX: 11,
  maxTranslateY: 14,
  maxShadowOffsetX: 8,
  maxShadowOffsetY: 10,
  maxHighlightShiftX: 6,
  maxHighlightShiftY: 8,
  inputGammaLimit: 24,
  inputBetaLimit: 28,
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

export function clampBookObjectMotionInput(input?: Partial<BookObjectMotionInput>): BookObjectMotionInput {
  return {
    x: clampUnit(input?.x ?? 0),
    y: clampUnit(input?.y ?? 0),
  }
}

export function sensorSampleToBookObjectMotionInput(
  sample: Partial<BookObjectSensorSample>,
  config?: Partial<BookObjectMotionConfig>,
): BookObjectMotionInput {
  const resolved = resolveBookObjectMotionConfig(config)

  return clampBookObjectMotionInput({
    x: (sample.gamma ?? 0) / resolved.inputGammaLimit,
    y: (sample.beta ?? 0) / resolved.inputBetaLimit,
  })
}

export function resolveBookObjectMotionConfig(
  config?: Partial<BookObjectMotionConfig>,
): BookObjectMotionConfig {
  return {
    ...defaultBookObjectMotionConfig,
    ...config,
  }
}

export function getBookObjectMotionState(options?: {
  input?: Partial<BookObjectMotionInput>
  config?: Partial<BookObjectMotionConfig>
  scale?: number
}): BookObjectMotionState {
  const input = clampBookObjectMotionInput(options?.input)
  const config = resolveBookObjectMotionConfig(options?.config)
  const scale = options?.scale ?? 1

  return {
    rotateX: -input.y * config.maxRotateX,
    rotateY: input.x * config.maxRotateY,
    translateX: input.x * config.maxTranslateX * scale,
    translateY: input.y * config.maxTranslateY * scale,
    shadowOffsetX: input.x * config.maxShadowOffsetX * scale,
    shadowOffsetY: input.y * config.maxShadowOffsetY * scale,
    highlightShiftX: input.x * config.maxHighlightShiftX * scale,
    highlightShiftY: input.y * config.maxHighlightShiftY * scale,
  }
}

export function interpolateBookObjectMotionState(
  from: BookObjectMotionState,
  to: BookObjectMotionState,
  factor: number,
): BookObjectMotionState {
  const t = Math.max(0, Math.min(1, factor))

  return {
    rotateX: lerp(from.rotateX, to.rotateX, t),
    rotateY: lerp(from.rotateY, to.rotateY, t),
    translateX: lerp(from.translateX, to.translateX, t),
    translateY: lerp(from.translateY, to.translateY, t),
    shadowOffsetX: lerp(from.shadowOffsetX, to.shadowOffsetX, t),
    shadowOffsetY: lerp(from.shadowOffsetY, to.shadowOffsetY, t),
    highlightShiftX: lerp(from.highlightShiftX, to.highlightShiftX, t),
    highlightShiftY: lerp(from.highlightShiftY, to.highlightShiftY, t),
  }
}

export function gradientTokenToNativeColors(token: BookObjectGradientToken): [string, string, string] {
  return token.stops.map((stop) => withOpacity(stop.color, stop.opacity)) as [string, string, string]
}

export function gradientTokenToNativeLocations(token: BookObjectGradientToken): [number, number, number] {
  return token.stops.map((stop) => stop.position / 100) as [number, number, number]
}

export function shadowTokenToCss(token: BookObjectShadowToken, offsetX = 0, offsetY = 0): string {
  if (token.length === 0) {
    return 'none'
  }

  return token
    .map((layer) => `${layer.x + offsetX}px ${layer.y + offsetY}px ${layer.blur}px ${withOpacity(layer.color, layer.opacity)}`)
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

function clampUnit(value: number): number {
  if (Number.isNaN(value)) {
    return 0
  }

  return Math.max(-1, Math.min(1, value))
}

function lerp(from: number, to: number, factor: number): number {
  return from + (to - from) * factor
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
