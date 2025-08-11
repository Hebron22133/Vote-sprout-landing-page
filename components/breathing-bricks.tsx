"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

interface MousePosition {
  x: number
  y: number
}

export default function BreathingBricks() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    if (isClient) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [handleMouseMove, isClient])

  if (!isClient) {
    return null
  }

  // Create a grid of tiny bricks
  const brickSize = 15 // Much smaller bricks
  const cols = Math.ceil(window.innerWidth / brickSize) + 4
  const rows = Math.ceil(window.innerHeight / brickSize) + 4

  const bricks = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * brickSize - brickSize * 2
      const y = row * brickSize - brickSize * 2

      // Calculate distance from mouse
      const distance = Math.sqrt(
        Math.pow(mousePosition.x - (x + brickSize / 2), 2) + Math.pow(mousePosition.y - (y + brickSize / 2), 2),
      )

      // Create breathing effect based on distance - much more pronounced
      const maxDistance = 200
      const intensity = Math.max(0, 1 - distance / maxDistance)

      bricks.push({
        id: `${row}-${col}`,
        x,
        y,
        intensity,
        distance,
      })
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bricks.map((brick) => (
        <motion.div
          key={brick.id}
          className="absolute border border-white/10 bg-gradient-to-br from-white/5 to-transparent rounded-sm"
          style={{
            left: brick.x,
            top: brick.y,
            width: brickSize,
            height: brickSize,
          }}
          animate={{
            scale: brick.intensity > 0.1 ? [1, 1.8 + brick.intensity * 2, 1] : 1,
            opacity: brick.intensity > 0.1 ? [0.2, 0.9 + brick.intensity, 0.2] : 0.1,
            rotateZ: brick.intensity > 0.2 ? [0, brick.intensity * 15, 0] : 0,
            y: brick.intensity > 0.1 ? [0, -brick.intensity * 8, 0] : 0,
            background:
              brick.intensity > 0.2
                ? [
                    `linear-gradient(135deg, rgba(6,182,212,${brick.intensity * 0.6}), rgba(168,85,247,${brick.intensity * 0.4}), rgba(236,72,153,${brick.intensity * 0.3}))`,
                    `linear-gradient(135deg, rgba(236,72,153,${brick.intensity * 0.8}), rgba(6,182,212,${brick.intensity * 0.5}), rgba(168,85,247,${brick.intensity * 0.4}))`,
                    `linear-gradient(135deg, rgba(168,85,247,${brick.intensity * 0.7}), rgba(236,72,153,${brick.intensity * 0.4}), rgba(6,182,212,${brick.intensity * 0.3}))`,
                  ]
                : "linear-gradient(135deg, rgba(255,255,255,0.05), transparent)",
            borderColor:
              brick.intensity > 0.3
                ? [
                    `rgba(6,182,212,${brick.intensity * 0.8})`,
                    `rgba(168,85,247,${brick.intensity * 0.8})`,
                    `rgba(236,72,153,${brick.intensity * 0.8})`,
                  ]
                : "rgba(255,255,255,0.1)",
            boxShadow:
              brick.intensity > 0.4
                ? [
                    `0 0 ${brick.intensity * 20}px rgba(6,182,212,${brick.intensity * 0.6})`,
                    `0 0 ${brick.intensity * 25}px rgba(168,85,247,${brick.intensity * 0.7})`,
                    `0 0 ${brick.intensity * 20}px rgba(236,72,153,${brick.intensity * 0.6})`,
                  ]
                : "none",
          }}
          transition={{
            duration: brick.intensity > 0.1 ? 1.5 + brick.intensity : 0.3,
            repeat: brick.intensity > 0.1 ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
            type: "tween",
          }}
        />
      ))}

      {/* Add some extra glowing particles for high-intensity areas */}
      {bricks
        .filter((brick) => brick.intensity > 0.7)
        .slice(0, 8)
        .map((brick) => (
          <motion.div
            key={`glow-${brick.id}`}
            className="absolute rounded-full blur-md"
            style={{
              left: brick.x + brickSize / 2 - 3,
              top: brick.y + brickSize / 2 - 3,
              width: 6,
              height: 6,
            }}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.4, 1, 0.4],
              background: [
                "radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(168,85,247,0.9) 0%, transparent 70%)",
                "radial-gradient(circle, rgba(236,72,153,0.8) 0%, transparent 70%)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Add ripple effects for very high intensity areas */}
      {bricks
        .filter((brick) => brick.intensity > 0.8)
        .slice(0, 3)
        .map((brick) => (
          <motion.div
            key={`ripple-${brick.id}`}
            className="absolute border-2 rounded-full"
            style={{
              left: brick.x + brickSize / 2 - 15,
              top: brick.y + brickSize / 2 - 15,
              width: 30,
              height: 30,
            }}
            animate={{
              scale: [0, 3],
              opacity: [0.8, 0],
              borderColor: ["rgba(6,182,212,0.6)", "rgba(168,85,247,0.4)", "rgba(236,72,153,0.2)", "transparent"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        ))}
    </div>
  )
}
