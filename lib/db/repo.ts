import { z } from "zod"
import { getSql } from "./neon"
import { store } from "./store"
import type { CastVoteInput, CreateDaoInput, CreateProposalInput, Dao, Proposal, VoteRow } from "./types"

const createDaoSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
})

const createProposalSchema = z.object({
  daoId: z.number().int(),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional().nullable(),
  options: z.array(z.string().min(1)).min(2).max(10),
  creator: z.string().optional().nullable(),
  txHash: z.string().optional().nullable(),
})

const castVoteSchema = z.object({
  proposalId: z.number().int(),
  voter: z.string().min(4).max(100),
  choiceIndex: z.number().int().min(0),
  txHash: z.string().optional().nullable(),
})

export async function listDaos(): Promise<Dao[]> {
  const sql = getSql()
  if (!sql) {
    return store.daos.sort((a, b) => b.id - a.id)
  }
  const rows = await sql<Dao[]>`select id, name, description, created_at from daos order by id desc`
  return rows
}

export async function createDao(input: CreateDaoInput): Promise<Dao> {
  const data = createDaoSchema.parse(input)
  const sql = getSql()
  if (!sql) {
    const id = ++store.seq.dao
    const dao: Dao = { id, name: data.name, description: data.description ?? null, created_at: new Date().toISOString() }
    store.daos.unshift(dao)
    return dao
  }
  const rows = await sql<Dao[]>`
    insert into daos (name, description) 
    values (${data.name}, ${data.description ?? null})
    returning id, name, description, created_at
  `
  return rows[0]
}

export async function listProposalsByDao(daoId: number): Promise<Proposal[]> {
  const sql = getSql()
  if (!sql) {
    return store.proposals
      .filter((p) => p.dao_id === daoId)
      .sort((a, b) => b.id - a.id)
  }
  const rows = await sql<Proposal[]>`
    select id, dao_id, title, description, options, created_at, creator, tx_hash
    from proposals
    where dao_id = ${daoId}
    order by id desc
  `
  return rows
}

export async function createProposal(input: CreateProposalInput): Promise<Proposal> {
  const data = createProposalSchema.parse(input)
  const sql = getSql()
  if (!sql) {
    const id = ++store.seq.proposal
    const p: Proposal = {
      id,
      dao_id: data.daoId,
      title: data.title,
      description: data.description ?? null,
      options: data.options,
      created_at: new Date().toISOString(),
      creator: data.creator ?? null,
      tx_hash: data.txHash ?? null,
    }
    store.proposals.unshift(p)
    return p
  }
  const rows = await sql<Proposal[]>`
    insert into proposals (dao_id, title, description, options, creator, tx_hash)
    values (${data.daoId}, ${data.title}, ${data.description ?? null}, ${JSON.stringify(data.options)}::jsonb, ${data.creator ?? null}, ${data.txHash ?? null})
    returning id, dao_id, title, description, options, created_at, creator, tx_hash
  `
  return rows[0]
}

export async function castVote(input: CastVoteInput): Promise<VoteRow> {
  const data = castVoteSchema.parse(input)
  const sql = getSql()
  if (!sql) {
    const exists = store.votes.find((v) => v.proposal_id === data.proposalId && v.voter.toLowerCase() === data.voter.toLowerCase())
    if (exists) throw new Error("You already voted on this proposal.")
    const id = ++store.seq.vote
    const v: VoteRow = {
      id,
      proposal_id: data.proposalId,
      voter: data.voter,
      choice_index: data.choiceIndex,
      created_at: new Date().toISOString(),
      tx_hash: data.txHash ?? null,
    }
    store.votes.push(v)
    return v
  }
  try {
    const rows = await sql<VoteRow[]>`
      insert into votes (proposal_id, voter, choice_index, tx_hash)
      values (${data.proposalId}, ${data.voter}, ${data.choiceIndex}, ${data.txHash ?? null})
      on conflict (proposal_id, voter) do nothing
      returning id, proposal_id, voter, choice_index, created_at, tx_hash
    `
    if (!rows[0]) throw new Error("You already voted on this proposal.")
    return rows[0]
  } catch (err: any) {
    if (String(err?.message || "").includes("duplicate key")) {
      throw new Error("You already voted on this proposal.")
    }
    throw err
  }
}
