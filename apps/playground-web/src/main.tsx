import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  BookObject,
  type BookObjectMotionInput,
  type BookObjectMotionState,
  defaultBookObjectMotionConfig,
  getBookObjectMotionState,
  interpolateBookObjectMotionState,
  sensorSampleToBookObjectMotionInput,
} from '../../../packages/book-object/src'
import './styles.css'

const sample = {
  title: '货币权力',
  coverKey: '4101001547',
  cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=900&q=80',
  depthColor: '#2a2a2a',
} as const

const sizes = [
  { label: 'S', value: 'sm' },
  { label: 'M', value: 'md' },
  { label: 'L', value: 'lg' },
] as const

type DeviceOrientationPermissionState = 'idle' | 'granted' | 'blocked'

function useDeviceTiltMotion() {
  const [permission, setPermission] = useState<DeviceOrientationPermissionState>('idle')
  const [hasOrientationSignal, setHasOrientationSignal] = useState(false)
  const [input, setInput] = useState<BookObjectMotionInput>({ x: 0, y: 0 })
  const [motion, setMotion] = useState<BookObjectMotionState>(() => getBookObjectMotionState())
  const targetInputRef = useRef<BookObjectMotionInput>({ x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (permission !== 'granted') {
      return
    }

    const update = () => {
      const nextTarget = getBookObjectMotionState({
        input: targetInputRef.current,
        config: defaultBookObjectMotionConfig,
      })
      setMotion((current) => interpolateBookObjectMotionState(current, nextTarget, 0.18))
      frameRef.current = window.requestAnimationFrame(update)
    }

    frameRef.current = window.requestAnimationFrame(update)

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [permission])

  useEffect(() => {
    if (permission !== 'granted') {
      return
    }

    const onOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0
      const beta = event.beta ?? 0
      setHasOrientationSignal(true)
      const nextInput = sensorSampleToBookObjectMotionInput({ gamma, beta }, defaultBookObjectMotionConfig)
      targetInputRef.current = nextInput
      setInput(nextInput)
    }

    window.addEventListener('deviceorientation', onOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', onOrientation, true)
    }
  }, [permission])

  const enable = async () => {
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
      setPermission('blocked')
      return
    }

    const requestPermission = (
      DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
    ).requestPermission

    if (requestPermission) {
      const result = await requestPermission()
      setPermission(result === 'granted' ? 'granted' : 'blocked')
      return
    }

    setPermission('granted')
  }

  const setFromPointer = (clientX: number, clientY: number) => {
    const width = window.innerWidth || 1
    const height = window.innerHeight || 1
    const normalizedX = ((clientX / width) - 0.5) * 2
    const normalizedY = ((clientY / height) - 0.5) * 2

    const nextInput = {
      x: normalizedX,
      y: normalizedY,
    }

    targetInputRef.current = nextInput
    setInput(nextInput)
  }

  const reset = () => {
    const nextInput = { x: 0, y: 0 }
    targetInputRef.current = nextInput
    setInput(nextInput)
  }

  return { permission, enable, input, motion, hasOrientationSignal, reset, setFromPointer }
}

function App() {
  const [size, setSize] = useState<(typeof sizes)[number]['value']>('md')
  const { permission, enable, input, motion, hasOrientationSignal, reset, setFromPointer } = useDeviceTiltMotion()

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10"
      onPointerDown={(event) => {
        if (!hasOrientationSignal) {
          setFromPointer(event.clientX, event.clientY)
        }
      }}
      onPointerMove={(event) => {
        if (!hasOrientationSignal) {
          setFromPointer(event.clientX, event.clientY)
        }
      }}
      onPointerUp={() => {
        if (!hasOrientationSignal) {
          reset()
        }
      }}
      onPointerLeave={() => {
        if (!hasOrientationSignal) {
          reset()
        }
      }}
      style={{ touchAction: 'none' }}
    >
      <div className="flex flex-1 items-center justify-center">
        <BookObject
          data={sample}
          expanded
          size={size}
          motionInput={input}
          motionConfig={defaultBookObjectMotionConfig}
        />
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
          {sizes.map((option) => {
            const active = option.value === size

            return (
              <button
                key={option.label}
                onClick={() => setSize(option.value)}
                style={{
                  appearance: 'none',
                  border: 0,
                  borderRadius: 9999,
                  background: active ? '#111111' : 'transparent',
                  color: active ? '#ffffff' : '#111111',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1,
                  padding: '10px 14px',
                }}
                type="button"
              >
                {option.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => void enable()}
          style={{
            appearance: 'none',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 9999,
            background: permission === 'granted' ? '#111111' : '#ffffff',
            color: permission === 'granted' ? '#ffffff' : '#111111',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            padding: '10px 14px',
          }}
          type="button"
        >
          {permission === 'granted' ? 'Gyro On' : 'Enable Gyro'}
        </button>
        <p
          style={{
            color: '#666666',
            fontSize: 12,
            lineHeight: 1.5,
            margin: 0,
            textAlign: 'center',
          }}
        >
          {hasOrientationSignal
            ? 'Gyro signal detected.'
            : `Drag on the screen to preview 3D motion. x ${input.x.toFixed(2)} / y ${input.y.toFixed(2)} / ry ${motion.rotateY.toFixed(1)}deg`}
        </p>
      </div>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
