"use client"

import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useState } from "react"
import { Loader2, ExternalLink } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useAA } from "@/hooks/use-aa"

export default function VoteButtons({
  proposalId,
  options,
  onVoted,
}: {
  proposalId: number
  options: string[]
  onVoted?: () => void
}) {
  const { address } = useAccount()
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)
  const { toast } = useToast()
  const { isConfigured, voteGasless } = useAA()

  const cast = async (choiceIndex: number) => {
    if (!address) {
      toast({ title: "Connect your wallet", description: "Please connect your wallet to vote." })
      return
    }
    try {
      setLoadingIndex(choiceIndex)

      if (isConfigured) {
        const res = await voteGasless(proposalId, choiceIndex)
        toast({
          title: "Vote sent",
          description: res.txHash ? (
            <a className="inline-flex items-center gap-1 underline" href={res.explorer} target="_blank" rel="noreferrer">
              View on BaseScan <ExternalLink className="w-3 h-3" />
            </a>
          ) : "UserOperation submitted",
        } as any)
      }

      // Always hit API to persist off-chain mirrors
      const r = await fetch(`/api/proposals/${proposalId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter: address, choiceIndex }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d?.error || "Failed to record vote")
      onVoted?.()
    } catch (e: any) {
      toast({ title: "Could not vote", description: e?.message ?? "Please try again.", variant: "destructive" })
    } finally {
      setLoadingIndex(null)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
      {options.map((opt, idx) => (
        <Button
          key={idx}
          onClick={() => cast(idx)}
          className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl"
          disabled={loadingIndex !== null}
        >
          {loadingIndex === idx ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {opt}
        </Button>
      ))}
    </div>
  )
}
