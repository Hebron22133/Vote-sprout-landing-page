export type ID = string | number

export interface Dao {
  id: number
  name: string
  description?: string | null
  created_at: string
}

export interface Proposal {
  id: number
  dao_id: number
  title: string
  description?: string | null
  options: string[]
  created_at: string
  creator?: string | null
  tx_hash?: string | null
}

export interface VoteRow {
  id: number
  proposal_id: number
  voter: string
  choice_index: number
  created_at: string
  tx_hash?: string | null
}

export interface CreateDaoInput {
  name: string
  description?: string | null
}

export interface CreateProposalInput {
  daoId: number
  title: string
  description?: string | null
  options: string[]
  creator?: string | null
  txHash?: string | null
}

export interface CastVoteInput {
  proposalId: number
  voter: string
  choiceIndex: number
  txHash?: string | null
}
