"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLiteMode } from "@/components/lite-mode-provider"

interface TrailPoint {
  x: number
  y: number
  id: number
}

export function CursorTrail() {
  const { isLiteMode } = useLiteMode()
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isLiteMode || isMobile) return

    let animationId: number
    let lastTime = 0
    const throttleMs = 16 // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleMs) return
      lastTime = now

      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: now,
      }

      setTrail((prev) => [...prev.slice(-20), newPoint])
    }

    const fadeTrail = () => {
      setTrail((prev) => prev.filter((point) => Date.now() - point.id < 1000))
      animationId = requestAnimationFrame(fadeTrail)
    }

    document.addEventListener("mousemove", handleMouseMove)
    animationId = requestAnimationFrame(fadeTrail)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [isLiteMode, isMobile])

  if (isLiteMode || isMobile) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
            style={{
              left: point.x - 4,
              top: point.y - 4,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 1 - index * 0.05,
              opacity: 1 - index * 0.05,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
