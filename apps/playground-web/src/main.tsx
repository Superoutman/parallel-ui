import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BookObject } from '../../../packages/book-object/src/web'
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

function App() {
  const [size, setSize] = useState<(typeof sizes)[number]['value']>('md')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10">
      <div className="flex flex-1 items-center justify-center">
        <BookObject data={sample} expanded size={size} />
      </div>
      <div className="mt-10 inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
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
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
