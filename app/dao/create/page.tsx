"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, ExternalLink } from 'lucide-react'
import CursorTrail from "@/components/cursor-trail"
import PulseBackground from "@/components/pulse-background"
import { useLiteMode } from "@/components/lite-mode-provider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAA } from "@/hooks/use-aa"
import { useToast } from "@/hooks/use-toast"
import { useAccount, usePublicClient, useWriteContract } from "wagmi"
import { GOVERNANCE_ABI, GOVERNANCE_ADDRESS } from "@/lib/contracts/governance"
import type { Address, Hash } from "viem"

type FeeMode = "gasless" | "standard"

export default function CreateProposalPage() {
  const router = useRouter()
  const [options, setOptions] = useState<string[]>(["Yes", "No"])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [mode, setMode] = useState<FeeMode>("gasless")
  const [submitting, setSubmitting] = useState(false)
  const [modal, setModal] = useState<{ open: boolean; tx?: string; url?: string }>({ open: false })
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()
  const { isConfigured, createProposalGasless } = useAA()
  const { toast } = useToast()
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const cleanOptions = useMemo(() => options.map((o) => o.trim()).filter(Boolean), [options])
  const canSubmit = useMemo(() => title.trim().length >= 2 && cleanOptions.length >= 2, [title, cleanOptions])

  const addOption = () => setOptions((p) => [...p, ""])
  const updateOption = (i: number, v: string) => setOptions((p) => p.map((x, idx) => (idx === i ? v : x)))
  const removeOption = (i: number) => setOptions((p) => p.filter((_, idx) => idx !== i))

  async function submit() {
    if (!canSubmit) {
      toast({ title: "Incomplete", description: "Please add a title and at least two options." })
      return
    }
    setSubmitting(true)
    try {
      let txHash: Hash | undefined
      let explorerUrl: string | undefined

      if (mode === "gasless") {
        if (!isConfigured) {
          toast({ title: "Gasless not configured", description: "Falling back to standard transaction." })
        } else {
          const res = await createProposalGasless(title.trim(), desc.trim(), cleanOptions)
          txHash = res.txHash as Hash | undefined
          explorerUrl = res.explorer
        }
      }

      if (mode === "standard" || (!isConfigured && mode === "gasless")) {
        if (!address) throw new Error("Connect your wallet")
        if (!GOVERNANCE_ADDRESS) throw new Error("Missing contract address")
        // Direct wallet tx (user pays network fee)
        const hash = await writeContractAsync({
          address: GOVERNANCE_ADDRESS as Address,
          abi: GOVERNANCE_ABI,
          functionName: "createProposal",
          args: [title.trim(), desc.trim(), cleanOptions],
        })
        txHash = hash as Hash
        const receipt = await publicClient!.waitForTransactionReceipt({ hash })
        explorerUrl = (await import("@/lib/aa/env")).getBaseScanTxUrl(receipt.transactionHash)
      }

      // Mirror to DB for UI (include creator & tx hash)
      const res = await fetch("/api/daos/1/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: desc.trim() || null,
          options: cleanOptions,
          creator: address ?? null,
          txHash: txHash ?? null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to create proposal")

      setModal({ open: true, tx: txHash, url: explorerUrl })
    } catch (e: any) {
      toast({ title: "Failed to submit", description: e?.message ?? "Please try again.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a] relative overflow-hidden">
      <div className="hidden md:block">
        <CursorTrail isLiteMode={isLiteMode} />
      </div>
      <PulseBackground isLiteMode={isLiteMode} />

      <div className="container mx-auto px-4 py-10 relative z-30 max-w-3xl">
        <motion.h1 initial={reduce || isLiteMode ? {} : { opacity: 0, y: 20 }} animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }} className="text-4xl font-bold text-white mb-6">
          Create Proposal
        </motion.h1>

        <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-white">Details</CardTitle>

            {/* Fee mode selector */}
            <div className="mt-1">
              <Label className="text-xs text-zinc-400">Fee Mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as FeeMode)} className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 rounded-xl bg-black/30 border border-white/10 p-3">
                  <RadioGroupItem value="gasless" id="gasless" />
                  <Label htmlFor="gasless" className="text-sm text-white">Gasless (Sponsored)</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-xl bg-black/30 border border-white/10 p-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="text-sm text-white">Standard (Pay Fee)</Label>
                </div>
              </RadioGroup>
              <p className="mt-2 text-xs text-zinc-400">
                Gasless uses a Paymaster to sponsor your transaction. Standard will ask your wallet to pay a small network fee.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="text-sm text-zinc-300">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Proposal title" className="mt-1 bg-black/30 text-white border-white/10" />
            </div>
            <div>
              <label className="text-sm text-zinc-300">Description</label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What is this proposal about?" className="mt-1 bg-black/30 text-white border-white/10" rows={5} />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-300">Options</label>
                <Button type="button" onClick={addOption} size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={opt} onChange={(e) => updateOption(idx, e.target.value)} className="bg-black/30 text-white border-white/10" placeholder={`Option ${idx + 1}`} />
                    {options.length > 2 ? (
                      <Button type="button" variant="outline" className="bg-white/5 border-white/10 text-white" onClick={() => removeOption(idx)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={submit} disabled={submitting || !canSubmit} className="w-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-300/30 rounded-xl">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {mode === "gasless" ? "Submit Proposal (Gasless)" : "Submit Proposal (Pay Fee)"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modal.open} onOpenChange={(o) => { setModal((m) => ({ ...m, open: o })); if (!o) router.push("/dao") }}>
        <DialogContent className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Proposal submitted</DialogTitle>
            <DialogDescription className="text-zinc-300">
              {modal.tx ? "Your transaction has been sent." : "Your proposal has been created."}
            </DialogDescription>
          </DialogHeader>
          {modal.tx && modal.url ? (
            <a href={modal.url} target="_blank" rel="noreferrer" className="text-blue-300 underline break-all inline-flex items-center gap-1">
              View on BaseScan <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}
          <Button onClick={() => router.push("/dao")} className="mt-4 bg-zinc-800 hover:bg-zinc-700 border border-white/10">
            Go to Dashboard
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
