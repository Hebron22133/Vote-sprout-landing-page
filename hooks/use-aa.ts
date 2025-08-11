"use client"

import { useMemo, useState } from "react"
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi"
import { type Address, encodeFunctionData, http } from "viem"
import { base, baseSepolia } from "viem/chains"
import { signerToSimpleSmartAccount } from "permissionless/accounts"
import { ENTRYPOINT_ADDRESS_V06 } from "permissionless"
import { GOVERNANCE_ABI, GOVERNANCE_ADDRESS } from "@/lib/contracts/governance"
import { getBaseScanTxUrl } from "@/lib/aa/env"
import { useToast } from "@/hooks/use-toast"

type SendResult = { userOpHash: string; txHash?: string; explorer?: string }

export function useAA() {
  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { toast } = useToast()
  const [pending, setPending] = useState(false)

  const isConfigured = useMemo(() => !!GOVERNANCE_ADDRESS, [])

  async function createSmartAccount() {
    if (!publicClient || !walletClient) throw new Error("Wallet not ready")
    const chain = chainId === baseSepolia.id ? baseSepolia : base
    // Build a SimpleAccount owned by the EOA signer
    return signerToSimpleSmartAccount({
      client: publicClient,
      owner: walletClient,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
      chain,
    })
  }

  async function sponsor(userOperation: any) {
    const r = await fetch("/api/aa/pimlico/sponsor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userOperation, entryPoint: ENTRYPOINT_ADDRESS_V06 }),
    })
    const s = await r.json()
    if (!r.ok) throw new Error(s?.error || "Sponsorship failed")
    return s
  }

  async function send(userOperation: any): Promise<string> {
    const r = await fetch("/api/aa/pimlico/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userOperation, entryPoint: ENTRYPOINT_ADDRESS_V06 }),
    })
    const s = await r.json()
    if (!r.ok) throw new Error(s?.error || "Send failed")
    return s.userOpHash as string
  }

  async function waitForReceipt(userOpHash: string) {
    const r = await fetch("/api/aa/pimlico/receipt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userOpHash }),
    })
    const s = await r.json()
    return s?.receipt
  }

  // Generic executor for a single target call through the smart account
  async function executeGasless(to: Address, data: `0x${string}`): Promise<SendResult> {
    try {
      if (!address) throw new Error("Connect your wallet")
      if (!isConfigured) throw new Error("Missing NEXT_PUBLIC_GOVERNANCE_ADDRESS")
      setPending(true)

      const sa = await createSmartAccount()
      // Build a minimal UserOperation calling the contract via the account
      // Wrap in account.execute(to, value, data)
      const callData = await sa.encodeCallData({ to, value: 0n, data })

      const partial = await sa.createUnsignedUserOperation({ callData })
      const sponsored = await sponsor(partial)

      const withPaymaster = {
        ...partial,
        paymasterAndData: sponsored.paymasterAndData,
        preVerificationGas: sponsored.preVerificationGas,
        verificationGasLimit: sponsored.verificationGasLimit,
        callGasLimit: sponsored.callGasLimit,
        maxFeePerGas: sponsored.maxFeePerGas,
        maxPriorityFeePerGas: sponsored.maxPriorityFeePerGas,
      }

      const signed = await sa.signUserOperation(withPaymaster)
      const userOpHash = await send(signed)

      // Optional: wait for receipt
      const receipt = await waitForReceipt(userOpHash)
      const txHash = receipt?.receipt?.transactionHash || receipt?.transactionHash
      return {
        userOpHash,
        txHash,
        explorer: txHash ? getBaseScanTxUrl(txHash) : undefined,
      }
    } finally {
      setPending(false)
    }
  }

  async function createProposalGasless(title: string, description: string, options: string[]) {
    const data = encodeFunctionData({
      abi: GOVERNANCE_ABI,
      functionName: "createProposal",
      args: [title, description, options],
    })
    return executeGasless(GOVERNANCE_ADDRESS as Address, data)
  }

  async function voteGasless(proposalId: number, choiceIndex: number) {
    const data = encodeFunctionData({
      abi: GOVERNANCE_ABI,
      functionName: "vote",
      args: [BigInt(proposalId), BigInt(choiceIndex)],
    })
    return executeGasless(GOVERNANCE_ADDRESS as Address, data)
  }

  return {
    isConfigured,
    pending,
    createProposalGasless,
    voteGasless,
  }
}
