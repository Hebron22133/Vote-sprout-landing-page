"use client"

import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"
import { wagmiConfig } from "@/lib/wagmi"

const client = new QueryClient()

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#2563eb", accentColorForeground: "white", borderRadius: "large" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
