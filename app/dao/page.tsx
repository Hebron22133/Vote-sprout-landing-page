"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import CursorTrail from "@/components/cursor-trail"
import PulseBackground from "@/components/pulse-background"
import { useLiteMode } from "@/components/lite-mode-provider"
import ProposalCard, { type ProposalWithTallies } from "@/components/proposals/proposal-card"
import HeaderBar from "@/components/header-bar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export default function DAODashboard() {
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()

  const [proposals, setProposals] = useState<ProposalWithTallies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For now, we use a single micro-DAO with id 1
  const daoId = 1

  const fetchAll = async () => {
    try {
      setLoading(true)
      setError(null)

      const r = await fetch(`/api/daos/${daoId}/proposals`, { cache: "no-store" })
      const d = await r.json()
      const list = Array.isArray(d?.proposals) ? d.proposals : []

      // get tallies; make this resilient
      const withTallies = await Promise.all(
        list.map(async (p: any) => {
          try {
            const rr = await fetch(`/api/proposals/${p.id}`, { cache: "no-store" })
            const dd = await rr.json()
            return {
              ...p,
              tallies: dd?.tallies ?? new Array(p.options?.length ?? 0).fill(0),
              totalVotes: dd?.totalVotes ?? 0,
            }
          } catch {
            return { ...p, tallies: new Array(p.options?.length ?? 0).fill(0), totalVotes: 0 }
          }
        })
      )

      setProposals(withTallies)
    } catch (e: any) {
      setError(e?.message ?? "Failed to load proposals")
      setProposals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, 4000)
    return () => clearInterval(interval)
  }, [])

  const isEmpty = useMemo(() => !loading && proposals.length === 0, [loading, proposals])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a] relative overflow-hidden">
      <HeaderBar />
      <div className="hidden md:block">
        <CursorTrail isLiteMode={isLiteMode} />
      </div>
      <PulseBackground isLiteMode={isLiteMode} />

      <main className="container mx-auto px-4 py-10 relative z-30">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-white">DAO Dashboard</h1>
          <Link href="/dao/create">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-300/30 rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              Create Proposal
            </Button>
          </Link>
        </div>

        {loading && <p className="text-zinc-300">Loading proposals…</p>}
        {error && !loading && (
          <p className="text-red-300 bg-red-900/20 border border-red-500/20 rounded-xl p-3">Error: {error}</p>
        )}
        {isEmpty && !error && (
          <motion.div
            initial={reduce || isLiteMode ? {} : { opacity: 0, y: 10 }}
            animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
            className="text-center text-zinc-300"
          >
            <p>No proposals yet.</p>
            <p className="mt-2">Be the first to create one.</p>
            <Link href="/dao/create">
              <Button className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10">
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </Link>
          </motion.div>
        )}

        {!loading && !error && proposals.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proposals.map((p) => (
              <ProposalCard key={p.id} p={p} onVoted={fetchAll} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
