"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Clock, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVotingContract } from "@/hooks/use-voting-contract"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HeaderBar } from "@/components/header-bar"

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

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const { getAllPolls, getResults } = useVotingContract()
  const { isConnected } = useAccount()
  const router = useRouter()

  useEffect(() => {
    loadPolls()
  }, [getAllPolls])

  const loadPolls = async () => {
    try {
      setLoading(true)
      const pollsData = await getAllPolls()
      setPolls(pollsData)
    } catch (error) {
      console.error("Error loading polls:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const remaining = endTime - now

    if (remaining <= 0) return "Ended"

    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const getTotalVotes = (votes: number[]) => {
    return votes.reduce((sum, count) => sum + count, 0)
  }

  const getWinningCandidate = (candidates: string[], votes: number[]) => {
    const maxVotes = Math.max(...votes)
    const winnerIndex = votes.indexOf(maxVotes)
    return maxVotes > 0 ? candidates[winnerIndex] : "No votes yet"
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <HeaderBar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="bg-slate-900/50 border-slate-700 p-8 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-slate-300 mb-6">Please connect your wallet to view and participate in polls.</p>
              <Button onClick={() => router.push("/")}>Go to Home Page</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeaderBar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All Polls
            </h1>
            <p className="text-slate-300">Participate in decentralized voting and governance</p>
          </div>

          <Link href="/polls/create">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-700 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700 p-12 text-center">
            <CardContent>
              <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No Polls Yet</h3>
              <p className="text-slate-300 mb-6">Be the first to create a poll and start the conversation!</p>
              <Link href="/polls/create">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Poll
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {poll.title}
                      </CardTitle>
                      <Badge
                        variant={poll.active && Date.now() / 1000 < poll.endTime ? "default" : "secondary"}
                        className={poll.active && Date.now() / 1000 < poll.endTime ? "bg-green-600" : "bg-slate-600"}
                      >
                        {poll.active && Date.now() / 1000 < poll.endTime ? "Active" : "Ended"}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm line-clamp-2">{poll.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {getTotalVotes(poll.votes)} votes
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTimeRemaining(poll.endTime)}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400 mb-1">Leading:</p>
                        <p className="font-medium text-blue-400">{getWinningCandidate(poll.candidates, poll.votes)}</p>
                      </div>

                      <Button
                        onClick={() => router.push(`/polls/${poll.id}`)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
