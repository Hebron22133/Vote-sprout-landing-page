"use client"

import { Button } from "@/components/ui/button"
import { Zap, ZapOff } from "lucide-react"
import { useLiteMode } from "@/components/lite-mode-provider"

export function LiteModeToggle() {
  const { isLiteMode, toggleLiteMode } = useLiteMode()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLiteMode}
      className="flex items-center gap-2 text-slate-400 hover:text-white"
    >
      {isLiteMode ? (
        <>
          <ZapOff className="h-4 w-4" />
          <span className="hidden sm:inline">Lite Mode</span>
        </>
      ) : (
        <>
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Full Mode</span>
        </>
      )}
    </Button>
  )
}
