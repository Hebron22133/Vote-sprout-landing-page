"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, useReducedMotion } from "framer-motion"
import CursorTrail from "@/components/cursor-trail"
import PulseBackground from "@/components/pulse-background"
import { useLiteMode } from "@/components/lite-mode-provider"
import HeaderBar from "@/components/header-bar"
import { ArrowLeft, Clock, User, Vote } from "lucide-react"
import { useVotingContract } from "@/hooks/use-voting-contract"
import type { Poll } from "@/lib/contracts/voting-contract"

export default function PollDetailsPage() {
  const params = useParams<{ id: string }>()
  const pollId = Number(params.id)
  const router = useRouter()
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()

  const { getPollDetails, vote, loading, isConnected, address } = useVotingContract()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [voting, setVoting] = useState(false)

  const loadPollDetails = async () => {
    const details = await getPollDetails(pollId)
    setPoll(details)
  }

  useEffect(() => {
    if (pollId) {
      loadPollDetails()
    }
  }, [pollId])

  const handleVote = async (candidateIndex: number) => {
    if (!isConnected || !poll) return

    setVoting(true)
    const txHash = await vote(pollId, candidateIndex)
    if (txHash) {
      // Refresh poll details to show updated results
      await loadPollDetails()
    }
    setVoting(false)
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a]">
        <HeaderBar />
        <div className="container mx-auto px-4 py-10 text-zinc-300 text-center">Loading poll details...</div>
      </div>
    )
  }

  const isActive = poll.active && Date.now() / 1000 < poll.endTime
  const hasEnded = Date.now() / 1000 > poll.endTime
  const canVote = isActive && isConnected && !poll.hasUserVoted

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now() / 1000
    const remaining = endTime - now

    if (remaining <= 0) return "Poll has ended"

    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)

    if (days > 0) return `${days} days, ${hours} hours remaining`
    if (hours > 0) return `${hours} hours, ${minutes} minutes remaining`
    return `${minutes} minutes remaining`
  }

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a] relative overflow-hidden">
      <HeaderBar />
      <div className="hidden md:block">
        <CursorTrail isLiteMode={isLiteMode} />
      </div>
      <PulseBackground isLiteMode={isLiteMode} />

      <main className="container mx-auto px-4 py-10 relative z-30 max-w-4xl">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 bg-white/5 border border-white/10 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={reduce || isLiteMode ? {} : { opacity: 0, y: 20 }}
          animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
        >
          <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-white text-3xl mb-2">{poll.title}</CardTitle>
                  {poll.description && <p className="text-zinc-300 text-lg">{poll.description}</p>}
                </div>
                <Badge
                  variant={isActive ? "default" : hasEnded ? "secondary" : "outline"}
                  className={`shrink-0 ${
                    isActive
                      ? "bg-green-600 text-white"
                      : hasEnded
                        ? "bg-gray-600 text-gray-200"
                        : "bg-yellow-600 text-white"
                  }`}
                >
                  {isActive ? "Active" : hasEnded ? "Ended" : "Upcoming"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mt-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeRemaining(poll.endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>
                    Created by {poll.creator.slice(0, 6)}...{poll.creator.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Vote className="w-4 h-4" />
                  <span>{poll.totalVotes} total votes</span>
                </div>
              </div>

              {poll.hasUserVoted && (
                <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">
                    ✓ You voted for: <strong>{poll.candidates[poll.userChoice]}</strong>
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-white text-xl font-semibold">
                  {hasEnded || poll.hasUserVoted ? "Results" : "Candidates"}
                </h3>

                {poll.candidates.map((candidate, index) => {
                  const votes = poll.voteCounts[index]
                  const percentage = getPercentage(votes)
                  const isWinner = hasEnded && votes === Math.max(...poll.voteCounts)

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all ${
                        canVote
                          ? "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer"
                          : "bg-white/5 border-white/10"
                      } ${isWinner ? "ring-2 ring-yellow-500/50" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{candidate}</h4>
                        {(hasEnded || poll.hasUserVoted) && (
                          <div className="text-right">
                            <span className="text-white font-bold">{votes} votes</span>
                            <span className="text-zinc-400 text-sm ml-2">({percentage}%)</span>
                            {isWinner && <span className="text-yellow-400 ml-2">👑</span>}
                          </div>
                        )}
                      </div>

                      {(hasEnded || poll.hasUserVoted) && (
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isWinner ? "bg-yellow-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}

                      {canVote && (
                        <Button
                          onClick={() => handleVote(index)}
                          disabled={voting}
                          className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          {voting ? "Voting..." : `Vote for ${candidate}`}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>

              {!isConnected && isActive && (
                <div className="p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-center">Connect your wallet to vote in this poll</p>
                </div>
              )}

              {isConnected && isActive && poll.hasUserVoted && (
                <div className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-center">
                    Thank you for voting! Results will be visible when the poll ends.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
