"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Plus } from 'lucide-react'
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function HeaderBar() {
  const { theme, setTheme } = useTheme()
  const reduce = useReducedMotion()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="VoteSprout logo" width={32} height={32} className="rounded-xl shadow-lg" />
          <span className="text-xl font-bold text-white">VoteSprout</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dao/create">
            <motion.div whileHover={reduce ? {} : { scale: 1.05 }} whileTap={reduce ? {} : { scale: 0.95 }}>
              <Button className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white border border-blue-300/30 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </motion.div>
          </Link>

          <div className="hidden sm:block">
            <ConnectButton chainStatus="icon" showBalance={false} />
          </div>

          <motion.div whileHover={reduce ? {} : { scale: 1.05 }} whileTap={reduce ? {} : { scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-zinc-200" /> : <Moon className="w-5 h-5 text-zinc-300" />}
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
