"use client"

import { motion, useReducedMotion } from "framer-motion"

export function ResultsBar({ label, value, total, color = "bg-blue-500" }: { label: string; value: number; total: number; color?: string }) {
  const reduce = useReducedMotion()
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/90">{label}</span>
        <span className="text-white/70 tabular-nums">{pct}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={reduce ? { width: 0 } : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.6 }}
          style={{ willChange: "width" }}
        />
      </div>
    </div>
  )
}
