"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { VotingContractService, type Poll, type PollSummary } from "@/lib/contracts/voting-contract"
import { useToast } from "@/hooks/use-toast"

export function useVotingContract() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { toast } = useToast()

  const [votingService, setVotingService] = useState<VotingContractService | null>(null)
  const [loading, setLoading] = useState(false)
  const [polls, setPolls] = useState<PollSummary[]>([])

  // Initialize the voting service
  useEffect(() => {
    if (publicClient) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const service = new VotingContractService(provider)
      setVotingService(service)
    }
  }, [publicClient])

  // Update service with signer when wallet is connected
  useEffect(() => {
    if (walletClient && isConnected) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      provider.getSigner().then((signer) => {
        const service = new VotingContractService(provider, signer)
        setVotingService(service)
      })
    }
  }, [walletClient, isConnected])

  const createPoll = useCallback(
    async (title: string, description: string, candidates: string[], durationInHours: number) => {
      if (!votingService || !isConnected) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        })
        return null
      }

      setLoading(true)
      try {
        const result = await votingService.createPoll(title, description, candidates, durationInHours)

        toast({
          title: "Success",
          description: `Poll created successfully! Poll ID: ${result.pollId}`,
        })

        // Refresh polls list
        await loadPolls()

        return result
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [votingService, isConnected, toast],
  )

  const vote = useCallback(
    async (pollId: number, candidateIndex: number) => {
      if (!votingService || !isConnected) {
        toast({
          title: "Error",
          description: "Please connect your wallet first",
          variant: "destructive",
        })
        return null
      }

      setLoading(true)
      try {
        const txHash = await votingService.vote(pollId, candidateIndex)

        toast({
          title: "Success",
          description: "Vote cast successfully!",
        })

        return txHash
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [votingService, isConnected, toast],
  )

  const loadPolls = useCallback(async () => {
    if (!votingService) return

    setLoading(true)
    try {
      const pollsList = await votingService.getPolls()
      setPolls(pollsList)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load polls: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [votingService, toast])

  const getPollDetails = useCallback(
    async (pollId: number): Promise<Poll | null> => {
      if (!votingService) return null

      try {
        return await votingService.getPollDetails(pollId)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load poll details: ${error.message}`,
          variant: "destructive",
        })
        return null
      }
    },
    [votingService, toast],
  )

  const getResults = useCallback(
    async (pollId: number) => {
      if (!votingService) return null

      try {
        return await votingService.getResults(pollId)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to load results: ${error.message}`,
          variant: "destructive",
        })
        return null
      }
    },
    [votingService, toast],
  )

  // Load polls on mount
  useEffect(() => {
    if (votingService) {
      loadPolls()
    }
  }, [votingService, loadPolls])

  return {
    createPoll,
    vote,
    loadPolls,
    getPollDetails,
    getResults,
    polls,
    loading,
    isConnected,
    address,
  }
}
