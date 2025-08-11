import { NextResponse } from "next/server"
import { getSql } from "@/lib/db/neon"
import { store } from "@/lib/db/store"
import type { Proposal } from "@/lib/db/types"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id)
  const sql = getSql()
  if (!sql) {
    const proposal = store.proposals.find((p) => p.id === id)
    if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const tallies = new Array(proposal.options.length).fill(0)
    const vs = store.votes.filter((v) => v.proposal_id === id)
    vs.forEach((v) => {
      if (tallies[v.choice_index] !== undefined) tallies[v.choice_index]++
    })
    return NextResponse.json({ proposal, tallies, totalVotes: vs.length })
  }

  const rows = await sql<Proposal[]>`select id, dao_id, title, description, options, created_at from proposals where id = ${id}`
  const proposal = rows[0]
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const voteRows = await sql<{ choice_index: number; c: number }[]>`
    select choice_index, count(*)::int as c from votes where proposal_id = ${id} group by choice_index order by choice_index
  `
  const tallies = new Array(proposal.options.length).fill(0)
  for (const r of voteRows) {
    if (tallies[r.choice_index] !== undefined) tallies[r.choice_index] = r.c
  }
  const totalVotes = voteRows.reduce((s, r) => s + r.c, 0)
  return NextResponse.json({ proposal, tallies, totalVotes })
}
