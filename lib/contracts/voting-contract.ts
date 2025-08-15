import { ethers } from "ethers"

export const VOTING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with your deployed contract address

export const VOTING_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_candidates",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_durationInHours",
        type: "uint256",
      },
    ],
    name: "createPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pollId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateIndex",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPolls",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string[]",
            name: "candidates",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "votes",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct VotingContract.Poll[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pollId",
        type: "uint256",
      },
    ],
    name: "getPoll",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "candidates",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "votes",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pollId",
        type: "uint256",
      },
    ],
    name: "getResults",
    outputs: [
      {
        internalType: "string[]",
        name: "candidates",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "votes",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "totalVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "winnerIndex",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pollId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "hasUserVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pollId",
        type: "uint256",
      },
    ],
    name: "isPollActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "candidates",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "PollCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
] as const

export interface Poll {
  id: number
  title: string
  description: string
  candidates: string[]
  voteCounts: number[]
  startTime: number
  endTime: number
  active: boolean
  creator: string
  totalVotes: number
  hasUserVoted: boolean
  userChoice: number
}

export interface PollSummary {
  id: number
  title: string
  description: string
  startTime: number
  endTime: number
  active: boolean
  creator: string
}

export class VotingContractService {
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null

  constructor(provider?: ethers.Provider, signer?: ethers.Signer) {
    if (provider) {
      this.contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider)
    }
    if (signer) {
      this.signer = signer
      this.contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)
    }
  }

  async createPoll(
    title: string,
    description: string,
    candidates: string[],
    durationInHours: number,
  ): Promise<{ pollId: number; txHash: string }> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract not initialized with signer")
    }

    try {
      const tx = await this.contract.createPoll(title, description, candidates, durationInHours)
      const receipt = await tx.wait()

      // Find the PollCreated event to get the poll ID
      const pollCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log)
          return parsed?.name === "PollCreated"
        } catch {
          return false
        }
      })

      let pollId = 0
      if (pollCreatedEvent) {
        const parsed = this.contract.interface.parseLog(pollCreatedEvent)
        pollId = Number(parsed?.args?.pollId || 0)
      }

      return {
        pollId,
        txHash: receipt.hash,
      }
    } catch (error: any) {
      throw new Error(`Failed to create poll: ${error.message}`)
    }
  }

  async vote(pollId: number, candidateIndex: number): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract not initialized with signer")
    }

    try {
      const tx = await this.contract.vote(pollId, candidateIndex)
      const receipt = await tx.wait()
      return receipt.hash
    } catch (error: any) {
      throw new Error(`Failed to vote: ${error.message}`)
    }
  }

  async getAllPolls(): Promise<PollSummary[]> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const polls = await this.contract.getAllPolls()
      return polls.map((poll: any) => ({
        id: Number(poll.id),
        title: poll.title,
        description: poll.description,
        startTime: Number(poll.startTime),
        endTime: Number(poll.endTime),
        active: poll.active,
        creator: poll.creator,
      }))
    } catch (error: any) {
      throw new Error(`Failed to get polls: ${error.message}`)
    }
  }

  async getPoll(pollId: number): Promise<Poll> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const result = await this.contract.getPoll(pollId)
      const [id, title, description, candidates, votes, startTime, endTime, creator, active] = result

      return {
        id: Number(id),
        title,
        description,
        candidates,
        voteCounts: votes.map((count: bigint) => Number(count)),
        startTime: Number(startTime),
        endTime: Number(endTime),
        active,
        creator,
        totalVotes: votes.reduce((sum: number, count: bigint) => sum + Number(count), 0),
        hasUserVoted: false, // Will be set separately
        userChoice: -1, // Will be set separately
      }
    } catch (error: any) {
      throw new Error(`Failed to get poll details: ${error.message}`)
    }
  }

  async getResults(pollId: number): Promise<{
    candidates: string[]
    voteCounts: number[]
    totalVotes: number
    winnerIndex: number
  }> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      const result = await this.contract.getResults(pollId)
      const [candidates, votes, totalVotes, winnerIndex] = result

      return {
        candidates,
        voteCounts: votes.map((count: bigint) => Number(count)),
        totalVotes: Number(totalVotes),
        winnerIndex: Number(winnerIndex),
      }
    } catch (error: any) {
      throw new Error(`Failed to get results: ${error.message}`)
    }
  }

  async isPollActive(pollId: number): Promise<boolean> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      return await this.contract.isPollActive(pollId)
    } catch (error: any) {
      throw new Error(`Failed to check poll status: ${error.message}`)
    }
  }

  async hasUserVoted(pollId: number, userAddress: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error("Contract not initialized")
    }

    try {
      return await this.contract.hasUserVoted(pollId, userAddress)
    } catch (error: any) {
      throw new Error(`Failed to check voting status: ${error.message}`)
    }
  }
}
