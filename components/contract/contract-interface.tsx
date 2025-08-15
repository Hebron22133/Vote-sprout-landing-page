"use client"

import { useState, useEffect } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { VotingContractService, VOTING_CONTRACT_ADDRESS } from "@/lib/contracts/voting-contract"
import { ethers } from "ethers"
import { ExternalLink, Plus, Vote, Clock, User, Trophy } from "lucide-react"

interface Poll {
  id: number
  title: string
  description: string
  candidates: string[]
  votes: number[]
  startTime: number
  endTime: number
  creator: string
  active: boolean
}

export function ContractInterface() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [contractService, setContractService] = useState<VotingContractService | null>(null)
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "confirmed" | "failed">("idle")
  const [txHash, setTxHash] = useState<string>("")

  // Create Poll Form State
  const [pollTitle, setPollTitle] = useState("")
  const [pollDescription, setPollDescription] = useState("")
  const [candidates, setCandidates] = useState(["", ""])
  const [duration, setDuration] = useState(24)

  // Vote Form State
  const [selectedPoll, setSelectedPoll] = useState<number>(-1)
  const [selectedCandidate, setSelectedCandidate] = useState<number>(-1)

  useEffect(() => {
    if (walletClient && isConnected) {
      const provider = new ethers.BrowserProvider(walletClient)
      provider.getSigner().then((signer) => {
        setContractService(new VotingContractService(provider, signer))
      })
    }
  }, [walletClient, isConnected])

  const loadPolls = async () => {
    if (!contractService) return

    try {
      setLoading(true)
      const allPolls = await contractService.getAllPolls()
      const pollsWithDetails = await Promise.all(
        allPolls.map(async (poll) => {
          const details = await contractService.getPoll(poll.id)
          return {
            id: details.id,
            title: details.title,
            description: details.description,
            candidates: details.candidates,
            votes: details.voteCounts,
            startTime: details.startTime,
            endTime: details.endTime,
            creator: details.creator,
            active: details.active,
          }
        }),
      )
      setPolls(pollsWithDetails)
    } catch (error: any) {
      toast({
        title: "Error loading polls",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (contractService) {
      loadPolls()
    }
  }, [contractService])

  const handleCreatePoll = async () => {
    if (!contractService) return

    const validCandidates = candidates.filter((c) => c.trim() !== "")
    if (!pollTitle.trim() || !pollDescription.trim() || validCandidates.length < 2) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields and provide at least 2 candidates",
        variant: "destructive",
      })
      return
    }

    try {
      setTxStatus("pending")
      const result = await contractService.createPoll(
        pollTitle.trim(),
        pollDescription.trim(),
        validCandidates,
        duration,
      )

      setTxHash(result.txHash)
      setTxStatus("confirmed")

      toast({
        title: "Poll created successfully!",
        description: `Poll ID: ${result.pollId}`,
      })

      // Reset form
      setPollTitle("")
      setPollDescription("")
      setCandidates(["", ""])
      setDuration(24)

      // Reload polls
      await loadPolls()
    } catch (error: any) {
      setTxStatus("failed")
      toast({
        title: "Failed to create poll",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleVote = async () => {
    if (!contractService || selectedPoll === -1 || selectedCandidate === -1) return

    try {
      setTxStatus("pending")
      const txHash = await contractService.vote(selectedPoll, selectedCandidate)

      setTxHash(txHash)
      setTxStatus("confirmed")

      toast({
        title: "Vote cast successfully!",
        description: "Your vote has been recorded on the blockchain",
      })

      // Reset vote form
      setSelectedPoll(-1)
      setSelectedCandidate(-1)

      // Reload polls
      await loadPolls()
    } catch (error: any) {
      setTxStatus("failed")
      toast({
        title: "Failed to vote",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const addCandidate = () => {
    setCandidates([...candidates, ""])
  }

  const updateCandidate = (index: number, value: string) => {
    const newCandidates = [...candidates]
    newCandidates[index] = value
    setCandidates(newCandidates)
  }

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) {
      setCandidates(candidates.filter((_, i) => i !== index))
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getBaseScanUrl = (txHash: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_PIMLICO_CHAIN === "base" ? "https://basescan.org" : "https://sepolia.basescan.org"
    return `${baseUrl}/tx/${txHash}`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Connect Your Wallet</CardTitle>
            <CardDescription className="text-slate-400">
              Connect your wallet to interact with the voting contract
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Smart Contract Interface</h1>
          <p className="text-slate-400">Interact directly with your deployed voting contract</p>

          {/* Contract Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              Contract: {VOTING_CONTRACT_ADDRESS.slice(0, 6)}...{VOTING_CONTRACT_ADDRESS.slice(-4)}
            </Badge>
            {txHash && (
              <a
                href={getBaseScanUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
              >
                View on BaseScan <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Transaction Status */}
          {txStatus !== "idle" && (
            <div className="flex justify-center">
              <Badge
                variant={txStatus === "confirmed" ? "default" : txStatus === "failed" ? "destructive" : "secondary"}
                className="animate-pulse"
              >
                {txStatus === "pending" && "Transaction Pending..."}
                {txStatus === "confirmed" && "Transaction Confirmed!"}
                {txStatus === "failed" && "Transaction Failed"}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Poll */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Poll
              </CardTitle>
              <CardDescription className="text-slate-400">Deploy a new poll to the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-slate-300">
                  Poll Title
                </Label>
                <Input
                  id="title"
                  value={pollTitle}
                  onChange={(e) => setPollTitle(e.target.value)}
                  placeholder="Enter poll title"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={pollDescription}
                  onChange={(e) => setPollDescription(e.target.value)}
                  placeholder="Enter poll description"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">Candidates</Label>
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={candidate}
                      onChange={(e) => updateCandidate(index, e.target.value)}
                      placeholder={`Candidate ${index + 1}`}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    {candidates.length > 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCandidate(index)}
                        className="border-slate-600 text-slate-300"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCandidate}
                  className="mt-2 border-slate-600 text-slate-300 bg-transparent"
                >
                  Add Candidate
                </Button>
              </div>

              <div>
                <Label htmlFor="duration" className="text-slate-300">
                  Duration (hours)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Button
                onClick={handleCreatePoll}
                disabled={txStatus === "pending"}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {txStatus === "pending" ? "Creating Poll..." : "Create Poll"}
              </Button>
            </CardContent>
          </Card>

          {/* Vote */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Vote className="h-5 w-5" />
                Cast Vote
              </CardTitle>
              <CardDescription className="text-slate-400">Vote on an active poll</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-300">Select Poll</Label>
                <select
                  value={selectedPoll}
                  onChange={(e) => setSelectedPoll(Number(e.target.value))}
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value={-1}>Choose a poll</option>
                  {polls
                    .filter((poll) => poll.active)
                    .map((poll) => (
                      <option key={poll.id} value={poll.id}>
                        {poll.title}
                      </option>
                    ))}
                </select>
              </div>

              {selectedPoll !== -1 && (
                <div>
                  <Label className="text-slate-300">Select Candidate</Label>
                  <div className="space-y-2 mt-2">
                    {polls
                      .find((p) => p.id === selectedPoll)
                      ?.candidates.map((candidate, index) => (
                        <label key={index} className="flex items-center gap-2 text-slate-300">
                          <input
                            type="radio"
                            name="candidate"
                            value={index}
                            checked={selectedCandidate === index}
                            onChange={() => setSelectedCandidate(index)}
                            className="text-blue-600"
                          />
                          {candidate}
                        </label>
                      ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleVote}
                disabled={selectedPoll === -1 || selectedCandidate === -1 || txStatus === "pending"}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {txStatus === "pending" ? "Casting Vote..." : "Cast Vote"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Polls List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Vote className="h-5 w-5" />
                All Polls
              </span>
              <Button
                onClick={loadPolls}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 bg-transparent"
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {polls.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No polls found</p>
            ) : (
              <div className="space-y-4">
                {polls.map((poll) => (
                  <div key={poll.id} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{poll.title}</h3>
                        <p className="text-slate-400 text-sm">{poll.description}</p>
                      </div>
                      <Badge variant={poll.active ? "default" : "secondary"}>{poll.active ? "Active" : "Ended"}</Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <User className="h-4 w-4" />
                        Creator: {poll.creator.slice(0, 6)}...{poll.creator.slice(-4)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        Ends: {formatTime(poll.endTime)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {poll.candidates.map((candidate, index) => {
                        const votes = poll.votes[index] || 0
                        const totalVotes = poll.votes.reduce((sum, v) => sum + v, 0)
                        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
                        const isWinner = votes > 0 && votes === Math.max(...poll.votes)

                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                            <div className="flex items-center gap-2">
                              {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                              <span className="text-white">{candidate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 text-sm">{votes} votes</span>
                              <span className="text-slate-400 text-sm">({percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
