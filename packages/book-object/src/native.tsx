import { useRef } from 'react'
import { Animated, Image, type ImageSourcePropType, type ImageStyle, StyleSheet, type StyleProp, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

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
}

export type NativeDiscoveryBookObjectProps = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
}

export type NativeStackedBookObjectProps = NativeDiscoveryBookObjectProps
export type NativeBookObjectVariant = 'detail' | 'stacked'
export type NativeBookObjectProps = {
  book?: NativeBookObjectSource
  data?: NativeBookObjectData
  variant?: NativeBookObjectVariant
  progress?: Animated.Value
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

export function DetailBookObject({ book, data, progress }: NativeDetailBookObjectProps) {
  const resolvedBook = resolveNativeBookObjectData({ book, data })
  const backLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [3, 2] })
  const backWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [84, 92] })
  const insideLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [8, 4] })
  const insideWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [84, 88] })
  const insideOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
  const page1X = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
  const page2X = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
  const page3X = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
  const frontLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [3, 0] })
  const effectLeft = progress.interpolate({ inputRange: [0, 1], outputRange: [6, 4] })
  const effectOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] })
  const lightOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.14, 0.22] })
  const frontShadowOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.15] })
  const frontShadowRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [14, 20] })

  return (
    <View style={styles.detailBookObject}>
      <Animated.View
        style={[
          styles.detailBookBackCover,
          {
            left: backLeft,
            width: backWidth,
            backgroundColor: resolveNativeDepthColor(resolvedBook),
          },
        ]}
      />
      <Animated.View style={[styles.detailBookInside, { left: insideLeft, width: insideWidth, opacity: insideOpacity }]}>
        <Animated.View style={[styles.detailBookPage1, { transform: [{ translateX: page1X }] }]} />
        <Animated.View style={[styles.detailBookPage2, { transform: [{ translateX: page2X }] }]} />
        <Animated.View style={[styles.detailBookPage3, { transform: [{ translateX: page3X }] }]} />
      </Animated.View>
      <Animated.View
        style={[
          styles.detailBookFront,
          { left: frontLeft, shadowOpacity: frontShadowOpacity, shadowRadius: frontShadowRadius },
        ]}
      >
        <Cover cover={resolvedBook.cover} title={resolvedBook.title} />
        <Animated.View style={[styles.detailBookEffect, { left: effectLeft, opacity: effectOpacity }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        <Animated.View style={[styles.detailBookLight, { opacity: lightOpacity }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0.46)']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export function DiscoveryBookObject({ book, data }: NativeDiscoveryBookObjectProps) {
  const resolvedBook = resolveNativeBookObjectData({ book, data })
  const progressRef = useRef(new Animated.Value(1))

  return (
    <View style={styles.discoveryBookObjectWrap}>
      <View style={styles.discoveryBookObjectInner}>
        <DetailBookObject data={resolvedBook} progress={progressRef.current} />
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
    width: 105,
    height: 112,
    overflow: 'visible',
  },
  detailBookBackCover: {
    position: 'absolute',
    top: 2.25,
    width: 84,
    height: 107,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookInside: {
    position: 'absolute',
    top: 4.36,
    left: 4,
    width: 88,
    height: '94%',
    zIndex: 1,
  },
  detailBookPage1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '98%',
    height: '100%',
    borderWidth: 0.75,
    borderColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookPage2: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: '98%',
    height: '100%',
    borderWidth: 0.75,
    borderColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#F1F1F1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookPage3: {
    position: 'absolute',
    top: 0,
    right: 4,
    width: '98%',
    height: '100%',
    borderWidth: 0.75,
    borderColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 1,
    borderBottomLeftRadius: 1,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#E7E7E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  detailBookFront: {
    position: 'absolute',
    top: 0,
    width: 84,
    height: 112,
    overflow: 'hidden',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 0 },
    elevation: 4,
  },
  detailBookEffect: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: '100%',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0,0,0,0.08)',
  },
  detailBookLight: {
    ...StyleSheet.absoluteFillObject,
  },
  discoveryBookObjectWrap: {
    width: 119,
    height: 151,
    overflow: 'visible',
  },
  discoveryBookObjectInner: {
    transform: [{ scale: 1.35 }],
    transformOrigin: 'top left',
  },
})
