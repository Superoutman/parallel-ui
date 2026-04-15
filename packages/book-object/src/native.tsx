import { useRef } from 'react'
import { Animated, Image, type ImageSourcePropType, type ImageStyle, StyleSheet, type StyleProp, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import type { BookObjectMotionConfig, BookObjectMotionInput, BookObjectSize, BookObjectTokens } from './core'
import {
  getBookObjectMetrics,
  getBookObjectMotionState,
  getPrimaryShadowLayer,
  gradientTokenToNativeColors,
  gradientTokenToNativeLocations,
} from './core'

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
  motionInput?: Partial<BookObjectMotionInput>
  motionConfig?: Partial<BookObjectMotionConfig>
}

export type NativeDiscoveryBookObjectProps = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
  size?: BookObjectSize
  tokens?: Partial<BookObjectTokens>
  motionInput?: Partial<BookObjectMotionInput>
  motionConfig?: Partial<BookObjectMotionConfig>
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
  motionInput?: Partial<BookObjectMotionInput>
  motionConfig?: Partial<BookObjectMotionConfig>
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
  width,
  height,
  imageStyle,
}: {
  title: string
  cover: ImageSourcePropType
  width: number
  height: number
  imageStyle?: StyleProp<ImageStyle>
}) {
  return (
    <Image
      accessibilityLabel={`${title} 封面`}
      source={cover}
      style={[styles.coverImage as ImageStyle, { width, height }, imageStyle]}
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
  motionInput,
  motionConfig,
}: NativeDetailBookObjectProps & { hideLeftBleed?: boolean }) {
  const resolvedBook = resolveNativeBookObjectData({ book, data })
  const collapsed = getBookObjectMetrics({ expanded: false, size, tokens })
  const expandedState = getBookObjectMetrics({ expanded: true, hideLeftBleed, size, tokens })
  const motion = getBookObjectMotionState({ input: motionInput, config: motionConfig, scale: expandedState.scale })
  const frontShadowCollapsed = getPrimaryShadowLayer(collapsed.front.shadow)
  const frontShadowExpanded = getPrimaryShadowLayer(expandedState.front.shadow)
  const frontShadowSecondaryCollapsed = collapsed.front.shadow[1] ?? null
  const frontShadowSecondaryExpanded = expandedState.front.shadow[1] ?? null
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
  const frontShadowSecondaryOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [frontShadowSecondaryCollapsed?.opacity ?? 0, frontShadowSecondaryExpanded?.opacity ?? 0],
  })
  const frontShadowSecondaryRadius = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (frontShadowSecondaryCollapsed?.blur ?? 0) * collapsed.scale,
      (frontShadowSecondaryExpanded?.blur ?? 0) * expandedState.scale,
    ],
  })
  const frontShadowSecondaryOffsetX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (frontShadowSecondaryCollapsed?.x ?? 0) * collapsed.scale,
      (frontShadowSecondaryExpanded?.x ?? 0) * expandedState.scale,
    ],
  })
  const frontShadowSecondaryOffsetY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (frontShadowSecondaryCollapsed?.y ?? 0) * collapsed.scale,
      (frontShadowSecondaryExpanded?.y ?? 0) * expandedState.scale,
    ],
  })

  return (
    <Animated.View
      style={[
        styles.detailBookObject,
        {
          width: expandedState.frame.width,
          height: expandedState.frame.height,
          transform: [
            { perspective: expandedState.frame.width * 6 },
            { rotateX: `${motion.rotateX}deg` },
            { rotateY: `${motion.rotateY}deg` },
            { translateX: motion.translateX },
            { translateY: motion.translateY },
          ],
        },
      ]}
    >
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
              right: 0,
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
              right: 0,
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
        pointerEvents="none"
        style={[
          styles.detailBookFrontShadowSecondary,
          {
            left: frontLeft,
            width: expandedState.front.width,
            height: expandedState.front.height,
            borderTopLeftRadius: expandedState.front.radiusLeft,
            borderBottomLeftRadius: expandedState.front.radiusLeft,
            borderTopRightRadius: expandedState.front.radiusRight,
            borderBottomRightRadius: expandedState.front.radiusRight,
            shadowOpacity: frontShadowSecondaryOpacity,
            shadowRadius: frontShadowSecondaryRadius,
            shadowOffset: {
              width: Animated.add(frontShadowSecondaryOffsetX, Animated.multiply(motion.shadowOffsetX, 0.7)),
              height: Animated.add(frontShadowSecondaryOffsetY, Animated.multiply(motion.shadowOffsetY, 0.7)),
            },
          },
        ]}
      />
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
            shadowOffset: {
              width: Animated.add(frontShadowOffsetX, motion.shadowOffsetX),
              height: Animated.add(frontShadowOffsetY, motion.shadowOffsetY),
            },
          },
        ]}
      >
        <Cover
          cover={resolvedBook.cover}
          height={expandedState.front.height}
          title={resolvedBook.title}
          width={expandedState.front.width}
        />
        <Animated.View
          style={[
            styles.detailBookEffect,
            {
              left: effectLeft,
              width: expandedState.effect.width,
              borderLeftWidth: expandedState.effect.borderWidth,
              borderLeftColor: expandedState.tokens.effectBorderColor,
              opacity: effectOpacity,
              transform: [{ translateX: motion.highlightShiftX }, { translateY: motion.highlightShiftY }],
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
    </Animated.View>
  )
}

export function DiscoveryBookObject({ book, data, size, tokens, motionInput, motionConfig }: NativeDiscoveryBookObjectProps) {
  const resolvedBook = resolveNativeBookObjectData({ book, data })
  const progressRef = useRef(new Animated.Value(1))
  const metrics = getBookObjectMetrics({ expanded: true, hideLeftBleed: true, size, tokens })
  const originOffsetX = ((metrics.frame.width * metrics.stacked.scale) - metrics.frame.width) / 2
  const originOffsetY = ((metrics.frame.height * metrics.stacked.scale) - metrics.frame.height) / 2

  return (
    <View style={[styles.discoveryBookObjectWrap, { width: metrics.stacked.width, height: metrics.stacked.height }]}>
      <View
        style={[
          styles.discoveryBookObjectInner,
          {
            transform: [
              { translateX: originOffsetX },
              { translateY: originOffsetY },
              { scale: metrics.stacked.scale },
            ],
          },
        ]}
      >
        <DetailBookObject
          data={resolvedBook}
          progress={progressRef.current}
          size={size}
          tokens={tokens}
          hideLeftBleed
          motionInput={motionInput}
          motionConfig={motionConfig}
        />
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
    resizeMode: 'cover',
  },
  detailBookObject: {
    overflow: 'visible',
  },
  detailBookBackCover: {
    position: 'absolute',
    zIndex: 0,
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
    zIndex: 3,
    shadowColor: '#000000',
    elevation: 4,
  },
  detailBookFrontShadowSecondary: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.01)',
    shadowColor: '#000000',
  },
  detailBookEffect: {
    position: 'absolute',
    top: 0,
    height: '100%',
    zIndex: 4,
  },
  detailBookLight: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  discoveryBookObjectWrap: {
    overflow: 'visible',
  },
  discoveryBookObjectInner: {
  },
})
