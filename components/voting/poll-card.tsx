"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, useReducedMotion } from "framer-motion"
import { useLiteMode } from "@/components/lite-mode-provider"
import { Clock, User, Vote, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { PollSummary } from "@/lib/contracts/voting-contract"

interface PollCardProps {
  poll: PollSummary
  index: number
}

export function PollCard({ poll, index }: PollCardProps) {
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()

  const isActive = poll.active && Date.now() / 1000 < poll.endTime
  const hasEnded = Date.now() / 1000 > poll.endTime

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now() / 1000
    const remaining = endTime - now

    if (remaining <= 0) return "Ended"

    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    const minutes = Math.floor((remaining % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <motion.div
      initial={reduce || isLiteMode ? {} : { opacity: 0, y: 20 }}
      animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={reduce || isLiteMode ? {} : { y: -5 }}
      className="h-full"
    >
      <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
        <CardHeader className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-white text-xl line-clamp-2">{poll.title}</CardTitle>
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

          {poll.description && <p className="text-zinc-300 text-sm line-clamp-3 mb-4">{poll.description}</p>}

          <div className="space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimeRemaining(poll.endTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>
                {poll.creator.slice(0, 6)}...{poll.creator.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Vote className="w-3 h-3" />
              <span>Created {formatDate(poll.startTime)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Link href={`/polls/${poll.id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-300/30 rounded-xl">
              <span>View Poll</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
