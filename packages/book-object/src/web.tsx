import type { CSSProperties } from 'react'
import type { BookObjectMotionConfig, BookObjectMotionInput, BookObjectSize, BookObjectTokens } from './core'
import { getBookObjectMetrics, getBookObjectMotionState, shadowTokenToCss } from './core'

export type WebBookObjectSource = {
  title: string
  cover: string
  coverKey: string
  depthColor?: string
  depthColorOverride?: string
}

export type WebBookObjectData = WebBookObjectSource

type WebBookObjectInput = {
  book?: WebBookObjectSource
  data?: WebBookObjectData
}

export type WebDetailBookObjectProps = {
  book?: WebBookObjectSource
  data?: WebBookObjectData
  expanded: boolean
  hideLeftBleed?: boolean
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
  motionInput?: Partial<BookObjectMotionInput>
  motionConfig?: Partial<BookObjectMotionConfig>
}

export type WebDiscoveryBookObjectProps = {
  book?: WebBookObjectSource
  data?: WebBookObjectData
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
  motionInput?: Partial<BookObjectMotionInput>
  motionConfig?: Partial<BookObjectMotionConfig>
}

export type WebStackedBookObjectProps = WebDiscoveryBookObjectProps
export type WebBookObjectVariant = 'detail' | 'stacked'
export type WebBookObjectProps = {
  book?: WebBookObjectSource
  data?: WebBookObjectData
  variant?: WebBookObjectVariant
  expanded?: boolean
  hideLeftBleed?: boolean
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
  motionInput?: Partial<BookObjectMotionInput>
  motionConfig?: Partial<BookObjectMotionConfig>
}

function resolveWebBookObjectData({ book, data }: WebBookObjectInput) {
  const resolved = data ?? book
  if (!resolved) {
    throw new Error('@citic-academy/book-object/web requires either `book` or `data`.')
  }

  return resolved
}

function resolveWebDepthColor(data: WebBookObjectData) {
  return data.depthColorOverride ?? data.depthColor ?? '#2A2A2A'
}

function CoverImage({ title, src }: { title: string; src: string }) {
  return <img alt={title} src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
}

export function DetailBookObject({
  book,
  data,
  expanded,
  hideLeftBleed = false,
  size,
  tokens,
  motionInput,
  motionConfig,
}: WebDetailBookObjectProps) {
  const resolvedBook = resolveWebBookObjectData({ book, data })
  const metrics = getBookObjectMetrics({ expanded, hideLeftBleed, size, tokens })
  const motion = getBookObjectMotionState({ input: motionInput, config: motionConfig, scale: metrics.scale })
  const pageBorder = `${metrics.page.borderWidth}px solid ${metrics.tokens.pageBorderColor}`
  const pageBaseStyle = {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: metrics.page.width,
    borderTopLeftRadius: metrics.page.radiusLeft,
    borderBottomLeftRadius: metrics.page.radiusLeft,
    borderTopRightRadius: metrics.page.radiusRight,
    borderBottomRightRadius: metrics.page.radiusRight,
    transition: 'transform 300ms ease-out',
  } satisfies CSSProperties

  return (
    <div
      style={{
        position: 'relative',
        width: metrics.frame.width,
        height: metrics.frame.height,
        overflow: 'visible',
        transformStyle: 'preserve-3d',
        transform: `perspective(${metrics.frame.width * 6}px) rotateX(${motion.rotateX}deg) rotateY(${motion.rotateY}deg) translate3d(${motion.translateX}px, ${motion.translateY}px, 0)`,
        transition: 'transform 120ms linear',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          style={{
            position: 'absolute',
            top: metrics.back.top,
            left: metrics.back.left,
            width: metrics.back.width,
            height: metrics.back.height,
            borderTopLeftRadius: metrics.back.radiusLeft,
            borderBottomLeftRadius: metrics.back.radiusLeft,
            borderTopRightRadius: metrics.back.radiusRight,
            borderBottomRightRadius: metrics.back.radiusRight,
            transition: 'all 300ms ease-out',
            boxShadow: shadowTokenToCss(metrics.back.shadow, motion.shadowOffsetX * 0.5, motion.shadowOffsetY * 0.5),
            backgroundColor: resolveWebDepthColor(resolvedBook),
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: metrics.inside.top,
            left: metrics.inside.left,
            width: metrics.inside.width,
            height: metrics.inside.height,
            opacity: metrics.inside.opacity,
            transition: 'all 300ms ease-out',
          }}
        >
          <div
            style={{
              ...pageBaseStyle,
              transform: `translateX(${metrics.page.translations[0]}px)`,
              border: pageBorder,
              backgroundColor: metrics.tokens.pageColors[0],
            }}
          />
          <div
            style={{
              ...pageBaseStyle,
              transform: `translateX(${metrics.page.translations[1]}px)`,
              border: pageBorder,
              backgroundColor: metrics.tokens.pageColors[1],
            }}
          />
          <div
            style={{
              ...pageBaseStyle,
              transform: `translateX(${metrics.page.translations[2]}px)`,
              border: pageBorder,
              backgroundColor: metrics.tokens.pageColors[2],
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: metrics.front.left,
            width: metrics.front.width,
            height: metrics.front.height,
            overflow: 'hidden',
            borderTopLeftRadius: metrics.front.radiusLeft,
            borderBottomLeftRadius: metrics.front.radiusLeft,
            borderTopRightRadius: metrics.front.radiusRight,
            borderBottomRightRadius: metrics.front.radiusRight,
            transition: 'all 300ms ease-out',
            boxShadow: shadowTokenToCss(metrics.front.shadow, motion.shadowOffsetX, motion.shadowOffsetY),
          }}
        >
          <CoverImage src={resolvedBook.cover} title={resolvedBook.title} />
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: metrics.effect.left,
              width: metrics.effect.width,
              height: '100%',
              borderLeft: `${metrics.effect.borderWidth}px solid ${metrics.tokens.effectBorderColor}`,
              background: metrics.effect.gradientCss,
              transition: 'all 300ms ease-out',
              opacity: metrics.effect.opacity,
              transform: `translate(${motion.highlightShiftX}px, ${motion.highlightShiftY}px)`,
            }}
          />
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              borderTopLeftRadius: metrics.front.radiusLeft,
              borderBottomLeftRadius: metrics.front.radiusLeft,
              borderTopRightRadius: metrics.front.radiusRight,
              borderBottomRightRadius: metrics.front.radiusRight,
              background: metrics.light.gradientCss,
              mixBlendMode: 'screen',
              transition: 'opacity 300ms ease-out',
              opacity: metrics.light.opacity,
              transform: `translate(${motion.highlightShiftX * 0.5}px, ${motion.highlightShiftY * 0.5}px)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function DiscoveryBookObject({ book, data, size, tokens, motionInput, motionConfig }: WebDiscoveryBookObjectProps) {
  const resolvedBook = resolveWebBookObjectData({ book, data })
  const detailSize = size ?? 112
  const metrics = getBookObjectMetrics({ expanded: true, hideLeftBleed: true, size: detailSize, tokens })
  const wrapperStyle = {
    transform: `scale(${metrics.stacked.scale})`,
    transformOrigin: 'top left',
  } satisfies CSSProperties

  return (
    <div
      style={{
        position: 'relative',
        width: metrics.stacked.width,
        height: metrics.stacked.height,
        overflow: 'visible',
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ position: 'relative', width: metrics.frame.width, height: metrics.frame.height, overflow: 'visible' }}>
          <DetailBookObject
            data={resolvedBook}
            expanded
            hideLeftBleed
            size={detailSize}
            tokens={tokens}
            motionInput={motionInput}
            motionConfig={motionConfig}
          />
        </div>
      </div>
    </div>
  )
}

export function BookObject({
  variant = 'detail',
  expanded = true,
  ...props
}: WebBookObjectProps) {
  if (variant === 'stacked') {
    return <DiscoveryBookObject {...props} />
  }

  return <DetailBookObject {...props} expanded={expanded} />
}

export function StackedBookObject(props: WebStackedBookObjectProps) {
  return <BookObject {...props} variant="stacked" />
}
