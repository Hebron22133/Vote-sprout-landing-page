"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResultsBar } from "@/components/proposals/results-bar"
import VoteButtons from "@/components/proposals/vote-buttons"
import { motion, useReducedMotion } from "framer-motion"
import CursorTrail from "@/components/cursor-trail"
import PulseBackground from "@/components/pulse-background"
import { useLiteMode } from "@/components/lite-mode-provider"
import { Button } from "@/components/ui/button"
import HeaderBar from "@/components/header-bar"
import { ExternalLink } from 'lucide-react'
import { getBaseScanTxUrl } from "@/lib/aa/env"

type Detail = {
  proposal: {
    id: number
    dao_id: number
    title: string
    description?: string | null
    options: string[]
    created_at: string
    creator?: string | null
    tx_hash?: string | null
  }
  tallies: number[]
  totalVotes: number
}

export default function ProposalDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const [data, setData] = useState<Detail | null>(null)
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()
  const router = useRouter()

  const load = async () => {
    if (!id) return
    try {
      const r = await fetch(`/api/proposals/${id}`, { cache: "no-store" })
      const d = await r.json()
      setData(d)
    } catch {
      setData(null)
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 4000)
    return () => clearInterval(t)
  }, [id])

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a]">
        <HeaderBar />
        <div className="container mx-auto px-4 py-10 text-zinc-300">Loading…</div>
      </div>
    )
  }

  const deadline = getDeadline(data.proposal.created_at)
  const status = Date.now() > deadline.getTime() ? "Closed" : "Active"

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a] relative overflow-hidden">
      <HeaderBar />
      <div className="hidden md:block"><CursorTrail isLiteMode={isLiteMode} /></div>
      <PulseBackground isLiteMode={isLiteMode} />

      <main className="container mx-auto px-4 py-10 relative z-30 max-w-3xl">
        <Button variant="outline" onClick={() => router.back()} className="mb-6 bg-white/5 border border-white/10 text-white">Back</Button>

        <motion.div initial={reduce || isLiteMode ? {} : { opacity: 0, y: 20 }} animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}>
          <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-white text-2xl">{data.proposal.title}</CardTitle>
                <span className={`text-xs px-2.5 py-1 rounded-full ${status === "Active" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-900 text-zinc-400"} border border-white/10`}>{status}</span>
              </div>
              {data.proposal.description ? <p className="text-zinc-300">{data.proposal.description}</p> : null}
              <p className="text-xs text-zinc-400">Created: {new Date(data.proposal.created_at).toLocaleString()}</p>
              {data.proposal.tx_hash ? (
                <a href={getBaseScanTxUrl(data.proposal.tx_hash)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-300 underline">
                  View on BaseScan <ExternalLink className="w-4 h-4" />
                </a>
              ) : null}
              <p className="text-xs text-zinc-400">Time left: {timeLeft(deadline)}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {data.proposal.options.map((opt, i) => (
                  <ResultsBar key={i} label={opt} value={data.tallies[i] ?? 0} total={data.totalVotes} color={["bg-blue-500","bg-purple-500","bg-emerald-500","bg-pink-500","bg-amber-500"][i%5]} />
                ))}
              </div>
              {status === "Active" ? <VoteButtons proposalId={data.proposal.id} options={data.proposal.options} onVoted={load} /> : null}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

function getDeadline(createdAt: string) {
  const d = new Date(createdAt)
  d.setHours(d.getHours() + 72)
  return d
}
function timeLeft(deadline: Date) {
  const ms = Math.max(0, deadline.getTime() - Date.now())
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${m}m`
}
