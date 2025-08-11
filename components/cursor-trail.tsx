"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

interface TrailPoint {
  x: number
  y: number
  id: number
}

export default function CursorTrail({ isLiteMode = false }: { isLiteMode?: boolean }) {
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30 })
  const sy = useSpring(y, { stiffness: 300, damping: 30 })

  useEffect(() => setMounted(true), [])

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (reduce || isLiteMode) return
      x.set(e.clientX)
      y.set(e.clientY)
      setTrail((p) => [{ x: e.clientX, y: e.clientY, id: Date.now() }, ...p.slice(0, 3)])
    },
    [x, y, reduce, isLiteMode]
  )

  useEffect(() => {
    if (!mounted || reduce || isLiteMode) return
    const handler = (e: MouseEvent) => onMove(e)
    window.addEventListener("mousemove", handler)
    let t: number
    const clearSoon = () => {
      clearTimeout(t)
      t = window.setTimeout(() => setTrail([]), 200)
    }
    window.addEventListener("mousemove", clearSoon)
    return () => {
      window.removeEventListener("mousemove", handler)
      window.removeEventListener("mousemove", clearSoon)
      clearTimeout(t)
    }
  }, [mounted, onMove, reduce, isLiteMode])

  if (!mounted || reduce || isLiteMode) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* main dark glow */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          x: sx,
          y: sy,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(244,244,245,0.65) 0%, rgba(168,85,247,0.45) 40%, rgba(2,6,23,0) 70%)",
          filter: "blur(1px)",
          willChange: "transform, opacity",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      {/* quick-fading trail dots */}
      {trail.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(212,212,216,0.8) 0%, rgba(147,51,234,0.5) 50%, transparent 80%)",
            willChange: "transform, opacity",
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}
