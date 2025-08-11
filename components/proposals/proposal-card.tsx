"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResultsBar } from "./results-bar"
import VoteButtons from "./vote-buttons"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ExternalLink } from 'lucide-react'
import { getBaseScanTxUrl } from "@/lib/aa/env"

export type ProposalWithTallies = {
  id: number
  dao_id: number
  title: string
  description?: string | null
  options: string[]
  created_at: string
  creator?: string | null
  tx_hash?: string | null
  tallies: number[]
  totalVotes: number
}

export default function ProposalCard({
  p,
  onVoted,
}: {
  p: ProposalWithTallies
  onVoted?: () => void
}) {
  const reduce = useReducedMotion()

  const deadline = getDeadline(p.created_at)
  const status = Date.now() > deadline.getTime() ? "Closed" : "Active"
  const colorByIndex = (i: number) => ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-pink-500", "bg-amber-500"][i % 5]

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 20 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-white">{p.title}</CardTitle>
            <span className={`text-xs px-2.5 py-1 rounded-full ${status === "Active" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-900 text-zinc-400"} border border-white/10`}>
              {status}
            </span>
          </div>
          {p.description ? <p className="text-sm text-zinc-300">{p.description}</p> : null}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <p>Ends {deadline.toLocaleString()}</p>
            {p.tx_hash ? (
              <a href={getBaseScanTxUrl(p.tx_hash)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 underline">
                BaseScan <ExternalLink className="w-3 h-3" />
              </a>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            {p.options.map((opt, i) => (
              <ResultsBar key={i} label={opt} value={p.tallies[i] ?? 0} total={p.totalVotes} color={colorByIndex(i)} />
            ))}
          </div>

          {status === "Active" ? <VoteButtons proposalId={p.id} options={p.options} onVoted={onVoted} /> : null}

          <div className="text-right">
            <Link href={`/proposals/${p.id}`} className="text-sm text-blue-300 hover:text-blue-200 underline">
              View details
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function getDeadline(createdAt: string) {
  const d = new Date(createdAt)
  d.setHours(d.getHours() + 72)
  return d
}
