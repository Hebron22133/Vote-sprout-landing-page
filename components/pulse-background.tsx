"use client"

import { motion } from "framer-motion"
import { useLiteMode } from "@/components/lite-mode-provider"

export function PulseBackground() {
  const { isLiteMode } = useLiteMode()

  if (isLiteMode) {
    return <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-900 to-slate-800" />
  }

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />

      {/* Animated pulse circles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-blue-500/20"
          style={{
            width: 400 + i * 200,
            height: 400 + i * 200,
            left: "50%",
            top: "50%",
            marginLeft: -(200 + i * 100),
            marginTop: -(200 + i * 100),
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 4 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
