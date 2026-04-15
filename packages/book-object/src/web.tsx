import type { CSSProperties } from 'react'

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
}

export type WebDiscoveryBookObjectProps = {
  book?: WebBookObjectSource
  data?: WebBookObjectData
}

export type WebStackedBookObjectProps = WebDiscoveryBookObjectProps
export type WebBookObjectVariant = 'detail' | 'stacked'
export type WebBookObjectProps = {
  book?: WebBookObjectSource
  data?: WebBookObjectData
  variant?: WebBookObjectVariant
  expanded?: boolean
  hideLeftBleed?: boolean
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
  return <img alt={title} className="h-full w-full object-cover" src={src} />
}

export function DetailBookObject({
  book,
  data,
  expanded,
  hideLeftBleed = false,
}: WebDetailBookObjectProps) {
  const resolvedBook = resolveWebBookObjectData({ book, data })
  const backLeft = expanded ? (hideLeftBleed ? '0px' : '-3px') : '3px'
  const insideLeft = expanded ? (hideLeftBleed ? '2px' : '-1px') : '3px'
  const backWidth = expanded ? (hideLeftBleed ? '89.15%' : '92%') : '84px'
  const insideWidth = expanded ? (hideLeftBleed ? '85.95%' : '88%') : '84%'
  const frontShadow = hideLeftBleed
    ? 'none'
    : expanded
      ? 'rgba(0,0,0,0.12) 8px -4px 16px, rgba(0,0,0,0.12) 16px 0px 24px'
      : 'rgba(0,0,0,0.1) 5px -2px 12px, rgba(0,0,0,0.1) 10px 0px 16px'
  const backShadow = hideLeftBleed
    ? '2px 2px 5px rgba(0,0,0,0.25)'
    : expanded
      ? '1px 1px 4px rgba(0,0,0,0.2)'
      : '1px 1px 3px rgba(0,0,0,0.16)'

  const pageBorder = '0.75px solid rgba(0,0,0,0.20)'
  const pageBaseClassName =
    'absolute right-0 top-0 h-full w-[98%] rounded-l-[1px] rounded-r-[6px] transition-transform duration-300 ease-out'

  return (
    <div className="relative h-full w-[105px] overflow-visible">
      <div className="absolute inset-0">
        <div
          className="absolute top-[2%] h-[calc(96%-1px)] rounded-l-[2px] rounded-r-[6px] transition-all duration-300 ease-out"
          style={{
            left: backLeft,
            width: backWidth,
            boxShadow: backShadow,
            backgroundColor: resolveWebDepthColor(resolvedBook),
          }}
        />
        <div
          className="absolute top-[calc(3%+1px)] h-[94%] transition-all duration-300 ease-out"
          style={{ left: insideLeft, width: insideWidth, opacity: expanded ? 1 : 0 }}
        >
          <div
            className={`${pageBaseClassName} bg-[#FFFFFF]`}
            style={{ transform: expanded ? 'translateX(0)' : 'translateX(-1px)', border: pageBorder }}
          />
          <div
            className={`${pageBaseClassName} bg-[#F1F1F1]`}
            style={{ transform: expanded ? 'translateX(-2px)' : 'translateX(0)', border: pageBorder }}
          />
          <div
            className={`${pageBaseClassName} bg-[#E7E7E7]`}
            style={{ transform: expanded ? 'translateX(-4px)' : 'translateX(-1px)', border: pageBorder }}
          />
        </div>
        <div
          className="absolute top-0 h-full w-[84px] overflow-hidden rounded-l-[2px] rounded-r-[6px] transition-all duration-300 ease-out"
          style={{
            left: expanded ? '0' : '3px',
            boxShadow: frontShadow,
          }}
        >
          <CoverImage src={resolvedBook.cover} title={resolvedBook.title} />
          <div
            className="pointer-events-none absolute top-0 h-full w-[24px] border-l-2 border-l-[rgba(0,0,0,0.08)] bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.08)_38%,rgba(255,255,255,0)_100%)] transition-all duration-300 ease-out"
            style={{ left: expanded ? '4px' : '6px', opacity: expanded ? 1 : 0.72 }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-l-[2px] rounded-r-[6px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_62%,rgba(255,255,255,0.46)_100%)] mix-blend-screen transition-opacity duration-300 ease-out"
            style={{ opacity: expanded ? 0.22 : 0.14 }}
          />
        </div>
      </div>
    </div>
  )
}

export function DiscoveryBookObject({ book }: WebDiscoveryBookObjectProps) {
  const resolvedBook = resolveWebBookObjectData({ book, data: undefined })
  const wrapperStyle = {
    transform: 'scale(1.35)',
    transformOrigin: 'top left',
  } satisfies CSSProperties

  return (
    <div className="relative h-[151px] w-[119px] overflow-visible">
      <div style={wrapperStyle}>
        <div className="relative h-[112px] w-[105px] overflow-visible">
          <DetailBookObject data={resolvedBook} expanded hideLeftBleed />
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
