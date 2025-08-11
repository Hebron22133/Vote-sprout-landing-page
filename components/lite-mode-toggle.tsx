"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Zap, ZapOff } from "lucide-react"
import { useLiteMode } from "./lite-mode-provider"

export default function LiteModeToggle() {
  const { isLiteMode, toggleLiteMode } = useLiteMode()

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLiteMode}
        className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300"
      >
        {isLiteMode ? <ZapOff className="w-4 h-4 text-gray-400" /> : <Zap className="w-4 h-4 text-yellow-400" />}
        <span className="ml-2 text-sm">{isLiteMode ? "Lite" : "Full"}</span>
      </Button>
    </motion.div>
  )
}
