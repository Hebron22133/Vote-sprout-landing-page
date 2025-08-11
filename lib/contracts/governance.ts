import { type Abi } from "viem"

// Replace NEXT_PUBLIC_GOVERNANCE_ADDRESS with your deployed contract address on Base.
export const GOVERNANCE_ADDRESS = (process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || "").toLowerCase()

// Minimal ABI for createProposal and vote. Replace with your full ABI when you integrate real logic.
export const GOVERNANCE_ABI = [
  {
    type: "function",
    name: "createProposal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "options", type: "string[]" },
    ],
    outputs: [{ name: "proposalId", type: "uint256" }],
  },
  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [
      { name: "proposalId", type: "uint256" },
      { name: "choiceIndex", type: "uint8" },
    ],
    outputs: [],
  },
] as const satisfies Abi
