import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { requestTracker } from '../loading/requestTracker.js'

/* Centered loader: use fullScreen for whole pages */
export default function Loader({ fullScreen = false, label = 'Loading', color = '#000' }) {
  return (
    <div
      className={`${fullScreen ? 'min-h-screen' : 'py-24'} flex flex-col items-center justify-center gap-4`}
      role="status"
      aria-live="polite"
      style={{ color }}
    >
      <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl tracking-[0.3em] uppercase">Tivyro</span>
      <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: color, borderTopColor: 'transparent' }} />
      <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">{label}</p>
    </div>
  )
}

/* Grey placeholder cards for product grids */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 mb-3" style={{ aspectRatio: '3/4' }} />
          <div className="h-3 bg-gray-200 w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 w-1/3" />
        </div>
      ))}
    </div>
  )
}

/* Thin bar at the top of the screen whenever the backend is being called */
export function GlobalLoadingBar() {
  const pending = useSyncExternalStore(requestTracker.subscribe, requestTracker.getSnapshot)
  const busy = pending > 0
  const [visible, setVisible] = useState(false)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!busy) {
      setVisible(false)
      setSlow(false)
      return
    }
    const showTimer = setTimeout(() => setVisible(true), 200)   // skip flicker on fast requests
    const slowTimer = setTimeout(() => setSlow(true), 5000)     // server is taking long
    return () => { clearTimeout(showTimer); clearTimeout(slowTimer) }
  }, [busy])

  if (!visible) return null

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[300] overflow-hidden pointer-events-none">
        <div className="h-full w-1/4 bg-black" style={{ animation: 'tivyroBar 1.1s ease-in-out infinite' }} />
      </div>
      {slow && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] bg-black text-white text-[11px] uppercase tracking-[0.18em] px-4 py-2 pointer-events-none">
          Waking up the server… this can take a few seconds
        </div>
      )}
    </>
  )
}