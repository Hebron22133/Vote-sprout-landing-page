import type { Dao, Proposal, VoteRow } from "./types"

type Store = {
  daos: Dao[]
  proposals: Proposal[]
  votes: VoteRow[]
  seq: { dao: number; proposal: number; vote: number }
}

const g = globalThis as unknown as { __VS_STORE__?: Store }

if (!g.__VS_STORE__) {
  const now = new Date().toISOString()
  g.__VS_STORE__ = {
    daos: [
      { id: 1, name: "VoteSprout Core", description: "Core governance DAO", created_at: now },
      { id: 2, name: "Community Grants", description: "Grants and funding", created_at: now },
    ],
    proposals: [
      {
        id: 1,
        dao_id: 1,
        title: "Adopt Gasless Voting Standard",
        description: "Adopt gasless voting across all products.",
        options: ["For", "Against", "Abstain"],
        created_at: now,
      },
    ],
    votes: [],
    seq: { dao: 2, proposal: 1, vote: 0 },
  }
}

export const store = g.__VS_STORE__!
