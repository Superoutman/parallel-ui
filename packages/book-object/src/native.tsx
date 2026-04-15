import { useRef } from 'react'
import { Animated, Image, type ImageSourcePropType, type ImageStyle, StyleSheet, type StyleProp, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { BookObjectSize, BookObjectTokens } from './core'
import { getBookObjectMetrics, getPrimaryShadowLayer, gradientTokenToNativeColors, gradientTokenToNativeLocations } from './core'

export type NativeBookObjectSource = {
  title: string
  cover: ImageSourcePropType
  coverKey: string
  depthColor?: string
  depthColorOverride?: string
}

export type NativeBookObjectData = NativeBookObjectSource

type NativeBookObjectInput = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
}

export type NativeDetailBookObjectProps = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
  progress: Animated.Value
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
}

export type NativeDiscoveryBookObjectProps = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
}

export type NativeStackedBookObjectProps = NativeDiscoveryBookObjectProps
export type NativeBookObjectVariant = 'detail' | 'stacked'
export type NativeBookObjectProps = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
  variant?: NativeBookObjectVariant
  progress?: Animated.Value
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
  hideLeftBleed?: boolean
}

function resolveNativeBookObjectData({ book, data }: NativeBookObjectInput) {
  const resolved = data ?? book
  if (!resolved) {
    throw new Error('@citic-academy/book-object/native requires either `book` or `data`.')
  }

  return resolved
}

function resolveNativeDepthColor(data: NativeBookObjectData) {
  return data.depthColorOverride ?? data.depthColor ?? '#2A2A2A'
}

function Cover({
  title,
  cover,
  imageStyle,
}: {
  title: string
  cover: ImageSourcePropType
  imageStyle?: StyleProp<ImageStyle>
}) {
  return (
    <Image
      accessibilityLabel={`${title} 封面`}
      source={cover}
      style={[styles.coverImage as ImageStyle, imageStyle]}
    />
  )
}

export function DetailBookObject({
  book,
  data,
  progress,
  size,
  tokens,
  hideLeftBleed = false,
}: NativeDetailBookObjectProps & { hideLeftBleed?: boolean }) {
  const resolvedBook = resolveNativeBookObjectData({ book, data })
  const collapsed = getBookObjectMetrics({ expanded: false, size, tokens })
  const expandedState = getBookObjectMetrics({ expanded: true, hideLeftBleed, size, tokens })
  const frontShadowCollapsed = getPrimaryShadowLayer(collapsed.front.shadow)
  const frontShadowExpanded = getPrimaryShadowLayer(expandedState.front.shadow)
  const backLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.back.left, expandedState.back.left] })
  const backWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.back.width, expandedState.back.width] })
  const insideLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.inside.left, expandedState.inside.left] })
  const insideWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.inside.width, expandedState.inside.width] })
  const insideOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.inside.opacity, expandedState.inside.opacity] })
  const page1X = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.page.translations[0], expandedState.page.translations[0]] })
  const page2X = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.page.translations[1], expandedState.page.translations[1]] })
  const page3X = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.page.translations[2], expandedState.page.translations[2]] })
  const frontLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.front.left, expandedState.front.left] })
  const effectLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [6 * collapsed.scale, expandedState.effect.left] })
  const effectOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.effect.opacity, expandedState.effect.opacity] })
  const lightOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [collapsed.light.opacity, expandedState.light.opacity] })
  const frontShadowOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [frontShadowCollapsed?.opacity ?? 0, frontShadowExpanded?.opacity ?? 0],
  })
  const frontShadowRadius = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (frontShadowCollapsed?.blur ?? 0) * collapsed.scale,
      (frontShadowExpanded?.blur ?? 0) * expandedState.scale,
    ],
  })
  const frontShadowOffsetX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (frontShadowCollapsed?.x ?? 0) * collapsed.scale,
      (frontShadowExpanded?.x ?? 0) * expandedState.scale,
    ],
  })
  const frontShadowOffsetY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (frontShadowCollapsed?.y ?? 0) * collapsed.scale,
      (frontShadowExpanded?.y ?? 0) * expandedState.scale,
    ],
  })

  return (
    <View style={[styles.detailBookObject, { width: expandedState.frame.width, height: expandedState.frame.height }]}>
      <Animated.View
        style={[
          styles.detailBookBackCover,
          {
            top: expandedState.back.top,
            left: backLeft,
            width: backWidth,
            height: expandedState.back.height,
            borderTopLeftRadius: expandedState.back.radiusLeft,
            borderBottomLeftRadius: expandedState.back.radiusLeft,
            borderTopRightRadius: expandedState.back.radiusRight,
            borderBottomRightRadius: expandedState.back.radiusRight,
            backgroundColor: resolveNativeDepthColor(resolvedBook),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.detailBookInside,
          {
            top: expandedState.inside.top,
            left: insideLeft,
            width: insideWidth,
            height: expandedState.inside.height,
            opacity: insideOpacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.detailBookPage1,
            {
              width: expandedState.page.width,
              borderWidth: expandedState.page.borderWidth,
              borderColor: expandedState.tokens.pageBorderColor,
              borderTopLeftRadius: expandedState.page.radiusLeft,
              borderBottomLeftRadius: expandedState.page.radiusLeft,
              borderTopRightRadius: expandedState.page.radiusRight,
              borderBottomRightRadius: expandedState.page.radiusRight,
              backgroundColor: expandedState.tokens.pageColors[0],
              transform: [{ translateX: page1X }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.detailBookPage2,
            {
              right: 2 * expandedState.scale,
              width: expandedState.page.width,
              borderWidth: expandedState.page.borderWidth,
              borderColor: expandedState.tokens.pageBorderColor,
              borderTopLeftRadius: expandedState.page.radiusLeft,
              borderBottomLeftRadius: expandedState.page.radiusLeft,
              borderTopRightRadius: expandedState.page.radiusRight,
              borderBottomRightRadius: expandedState.page.radiusRight,
              backgroundColor: expandedState.tokens.pageColors[1],
              transform: [{ translateX: page2X }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.detailBookPage3,
            {
              right: 4 * expandedState.scale,
              width: expandedState.page.width,
              borderWidth: expandedState.page.borderWidth,
              borderColor: expandedState.tokens.pageBorderColor,
              borderTopLeftRadius: expandedState.page.radiusLeft,
              borderBottomLeftRadius: expandedState.page.radiusLeft,
              borderTopRightRadius: expandedState.page.radiusRight,
              borderBottomRightRadius: expandedState.page.radiusRight,
              backgroundColor: expandedState.tokens.pageColors[2],
              transform: [{ translateX: page3X }],
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.detailBookFront,
          {
            left: frontLeft,
            width: expandedState.front.width,
            height: expandedState.front.height,
            borderTopLeftRadius: expandedState.front.radiusLeft,
            borderBottomLeftRadius: expandedState.front.radiusLeft,
            borderTopRightRadius: expandedState.front.radiusRight,
            borderBottomRightRadius: expandedState.front.radiusRight,
            shadowOpacity: frontShadowOpacity,
            shadowRadius: frontShadowRadius,
            shadowOffset: { width: frontShadowOffsetX, height: frontShadowOffsetY },
          },
        ]}
      >
        <Cover cover={resolvedBook.cover} title={resolvedBook.title} />
        <Animated.View
          style={[
            styles.detailBookEffect,
            {
              left: effectLeft,
              width: expandedState.effect.width,
              borderLeftWidth: expandedState.effect.borderWidth,
              borderLeftColor: expandedState.tokens.effectBorderColor,
              opacity: effectOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={gradientTokenToNativeColors(expandedState.tokens.effectGradient)}
            end={{ x: 1, y: 0 }}
            locations={gradientTokenToNativeLocations(expandedState.tokens.effectGradient)}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        <Animated.View style={[styles.detailBookLight, { opacity: lightOpacity }]}>
          <LinearGradient
            colors={gradientTokenToNativeColors(expandedState.tokens.lightGradient)}
            end={{ x: 1, y: 0 }}
            locations={gradientTokenToNativeLocations(expandedState.tokens.lightGradient)}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export function DiscoveryBookObject({ book, data, size, tokens }: NativeDiscoveryBookObjectProps) {
  const resolvedBook = resolveNativeBookObjectData({ book, data })
  const progressRef = useRef(new Animated.Value(1))
  const metrics = getBookObjectMetrics({ expanded: true, hideLeftBleed: true, size, tokens })

  return (
    <View style={[styles.discoveryBookObjectWrap, { width: metrics.stacked.width, height: metrics.stacked.height }]}>
      <View style={[styles.discoveryBookObjectInner, { transform: [{ scale: metrics.stacked.scale }] }]}>
        <DetailBookObject data={resolvedBook} progress={progressRef.current} size={size} tokens={tokens} hideLeftBleed />
      </View>
    </View>
  )
}

export function BookObject({
  variant = 'detail',
  progress,
  ...props
}: NativeBookObjectProps) {
  const progressRef = useRef(progress ?? new Animated.Value(1))

  if (variant === 'stacked') {
    return <DiscoveryBookObject {...props} />
  }

  return <DetailBookObject {...props} progress={progressRef.current} />
}

export function StackedBookObject(props: NativeStackedBookObjectProps) {
  return <BookObject {...props} variant="stacked" />
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailBookObject: {
    overflow: 'visible',
  },
  detailBookBackCover: {
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookInside: {
    position: 'absolute',
    zIndex: 1,
  },
  detailBookPage1: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookPage2: {
    position: 'absolute',
    top: 0,
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookPage3: {
    position: 'absolute',
    top: 0,
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookFront: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    elevation: 4,
  },
  detailBookEffect: {
    position: 'absolute',
    top: 0,
    height: '100%',
  },
  detailBookLight: {
    ...StyleSheet.absoluteFillObject,
  },
  discoveryBookObjectWrap: {
    overflow: 'visible',
  },
  discoveryBookObjectInner: {
  },
})
