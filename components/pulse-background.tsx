"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function PulseBackground({ isLiteMode = false }: { isLiteMode?: boolean }) {
  const shouldReduceMotion = useReducedMotion()

  // Fully dark, subtle violet/fuchsia glow (no light blue)
  if (shouldReduceMotion || isLiteMode) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-zinc-800 to-fuchsia-800 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-zinc-900 to-purple-800 rounded-full opacity-20 blur-3xl" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-zinc-800 to-fuchsia-800 rounded-full opacity-20 blur-3xl"
        initial={{ scale: 1, opacity: 0.18 }}
        animate={{ scale: 1.08, opacity: 0.26 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", duration: 4, ease: "easeInOut" }}
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-zinc-900 to-purple-800 rounded-full opacity-20 blur-3xl"
        initial={{ scale: 1.06, opacity: 0.24 }}
        animate={{ scale: 1, opacity: 0.18 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", duration: 5, ease: "easeInOut" }}
        style={{ willChange: "transform, opacity" }}
      />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.03 }}
        animate={{ opacity: 0.08 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", duration: 6 }}
        style={{
          background: "radial-gradient(1200px 600px at 20% 10%, rgba(255,255,255,0.08), transparent 60%)",
          willChange: "opacity",
        }}
      />
    </div>
  )
}
