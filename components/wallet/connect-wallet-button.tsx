"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi"
import { base } from "viem/chains"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, Check } from 'lucide-react'
import { motion, useReducedMotion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function ConnectWalletButton({ className = "" }: { className?: string }) {
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, status } = useAccount()
  const { switchChain } = useSwitchChain()
  const chainId = useChainId()
  const router = useRouter()
  const reduce = useReducedMotion()
  const [showNetwork, setShowNetwork] = useState(false)

  const ready = status !== "reconnecting"

  // Navigate or prompt to switch once connected
  useEffect(() => {
    if (address && chainId === base.id) {
      router.push("/dao")
    } else if (address && chainId !== base.id) {
      setShowNetwork(true)
    }
  }, [address, chainId, router])

  // Pick injected (e.g., MetaMask) if available, otherwise the first connector
  const injected = connectors.find((c) => c.id === "injected") ?? connectors[0]

  if (!ready) return null

  return (
    <>
      {!address ? (
        <motion.div whileHover={reduce ? {} : { scale: 1.05 }} whileTap={reduce ? {} : { scale: 0.95 }}>
          <Button
            onClick={() => connect({ connector: injected })}
            disabled={!injected || isPending}
            size="lg"
            className={`relative px-10 py-7 text-lg font-bold rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-500 border border-blue-300/30 text-white shadow-[0_8px_24px_rgba(30,64,175,0.45)] ${className}`}
          >
            <Wallet className="w-6 h-6 mr-3" />
            {isPending ? "Connecting..." : "Connect Wallet"}

            {!reduce && (
              <motion.div
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-2xl"
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            )}
          </Button>
        </motion.div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowNetwork(true)}
            className="bg-white/5 border-blue-300/30 text-white hover:bg-white/10"
          >
            {chainId === base.id ? <Check className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
            {chainId === base.id ? "Base Connected" : "Wrong Network"}
          </Button>
          <Button
            variant="outline"
            onClick={() => disconnect()}
            className="bg-white/5 border-blue-300/30 text-white hover:bg-white/10"
          >
            Disconnect
          </Button>
        </div>
      )}

      {/* Wrong network modal */}
      {showNetwork && address && chainId !== base.id && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-blue-900/50 border border-blue-300/20 rounded-2xl p-6 shadow-2xl max-w-md w-full text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-full">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Please switch to Base</h3>
            </div>
            <p className="text-blue-100 mb-6">VoteSprout runs on Base. Switch your wallet to Base and retry.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => switchChain({ chainId: base.id })}
                className="flex-1 bg-blue-600 hover:bg-blue-500 border border-blue-300/30"
              >
                Switch to Base
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNetwork(false)}
                className="bg-white/5 border-blue-300/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
