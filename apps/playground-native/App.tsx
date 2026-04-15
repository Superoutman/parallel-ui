import { useEffect, useMemo, useState } from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Accelerometer } from 'expo-sensors'
import { BookObject } from '../../packages/book-object/src/native'
import { bookObjectSizePresets, clampBookObjectMotionInput, type BookObjectMotionInput } from '../../packages/book-object/src/core'

const bundledCover = require('./assets/enterprise-cover.png')
const motionConfig = {
  maxRotateX: 0,
  maxTranslateY: 18,
  maxShadowOffsetY: 7,
  maxHighlightShiftY: 6,
} as const

const sample = {
  title: '企业版封面',
  coverKey: 'enterprise-cover',
  cover: bundledCover,
  depthColor: '#2a2a2a',
} as const

const sizes = [
  { label: 'S', value: 'sm' as const },
  { label: 'M', value: 'md' as const },
  { label: 'L', value: 'lg' as const },
] as const

export default function App() {
  const [size, setSize] = useState<(typeof sizes)[number]['value']>('md')
  const [input, setInput] = useState<BookObjectMotionInput>({ x: 0, y: 0 })

  useEffect(() => {
    Accelerometer.setUpdateInterval(16)
    const subscription = Accelerometer.addListener(({ x, y }) => {
      setInput((current) =>
        clampBookObjectMotionInput({
          x: current.x + (((-x * 1.7) - current.x) * 0.14),
          y: current.y + (((y * 1.5) - current.y) * 0.14),
        }),
      )
    })

    return () => {
      subscription.remove()
    }
  }, [])

  const sizeLabel = useMemo(() => `${bookObjectSizePresets[size]}`, [size])

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.stage}>
        <BookObject data={sample} expanded motionConfig={motionConfig} size={size} motionInput={input} />
      </View>
      <View style={styles.controls}>
        <View style={styles.segmented}>
          {sizes.map((option) => {
            const active = option.value === size

            return (
              <Pressable
                key={option.label}
                onPress={() => setSize(option.value)}
                style={[styles.segmentButton, active ? styles.segmentButtonActive : null]}
              >
                <Text style={[styles.segmentText, active ? styles.segmentTextActive : null]}>{option.label}</Text>
              </Pressable>
            )
          })}
        </View>
        <Text style={styles.caption}>
          Tilt the phone. Current size {sizeLabel}. Motion input x {input.x.toFixed(2)} / y {input.y.toFixed(2)}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 999,
    padding: 4,
  },
  segmentButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#111111',
  },
  segmentText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  caption: {
    color: '#666666',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
})
