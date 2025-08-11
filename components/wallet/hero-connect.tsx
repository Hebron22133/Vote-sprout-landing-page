"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Wallet } from 'lucide-react'
import { motion, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"
import { base } from "viem/chains"
import { useEffect, useState } from "react"

export default function HeroConnectButton() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()
  const reduce = useReducedMotion()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (!mounted || !isConnected) return
    if (chainId === base.id) router.push("/dao")
  }, [mounted, isConnected, chainId, router])

  if (!mounted) return null

  const handleClick = async () => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }
    if (chainId !== base.id) {
      switchChain({ chainId: base.id })
      return
    }
    router.push("/dao")
  }

  return (
    <motion.div whileHover={reduce ? {} : { scale: 1.05 }} whileTap={reduce ? {} : { scale: 0.95 }} className="relative inline-block">
      <Button
        onClick={handleClick}
        size="lg"
        className="relative px-10 py-7 text-lg font-bold rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-500 border border-blue-300/30 text-white shadow-[0_8px_24px_rgba(30,64,175,0.45)]"
        style={{ willChange: "transform" }}
      >
        <Wallet className="w-6 h-6 mr-3" />
        {isConnected ? (chainId === base.id ? "Go to Dashboard" : "Switch to Base") : "Connect Wallet"}

        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-2xl"
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{ willChange: "transform, opacity" }}
          />
        )}
      </Button>
    </motion.div>
  )
}
