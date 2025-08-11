"use client"

import { http } from "wagmi"
import { base, baseSepolia } from "viem/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo"

export const wagmiConfig = getDefaultConfig({
  appName: "VoteSprout",
  projectId,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
})
