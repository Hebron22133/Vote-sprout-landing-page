"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion, useReducedMotion } from "framer-motion"
import { useLiteMode } from "@/components/lite-mode-provider"
import { Plus, Trash2, Clock, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useVotingContract } from "@/hooks/use-voting-contract"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CreatePollForm() {
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()
  const router = useRouter()
  const { createPoll, loading, isConnected } = useVotingContract()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [candidates, setCandidates] = useState(["", ""])
  const [duration, setDuration] = useState(24)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdPoll, setCreatedPoll] = useState<{ pollId: number; txHash: string } | null>(null)

  const addCandidate = () => {
    if (candidates.length < 10) {
      setCandidates([...candidates, ""])
    }
  }

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) {
      setCandidates(candidates.filter((_, i) => i !== index))
    }
  }

  const updateCandidate = (index: number, value: string) => {
    const updated = [...candidates]
    updated[index] = value
    setCandidates(updated)
  }

  const isFormValid = () => {
    return title.trim() && candidates.length >= 2 && candidates.every((c) => c.trim()) && duration > 0 && isConnected
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) return

    const filteredCandidates = candidates.filter((c) => c.trim())
    const result = await createPoll(title.trim(), description.trim(), filteredCandidates, duration)

    if (result) {
      setCreatedPoll(result)
      setShowSuccess(true)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push("/polls")
  }

  const getBaseScanUrl = (txHash: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_PIMLICO_CHAIN === "base" ? "https://basescan.org" : "https://sepolia.basescan.org"
    return `${baseUrl}/tx/${txHash}`
  }

  return (
    <>
      <motion.div
        initial={reduce || isLiteMode ? {} : { opacity: 0, y: 20 }}
        animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
      >
        <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create New Poll</CardTitle>
            <p className="text-zinc-300">Create a decentralized poll where users can vote with their wallets</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Poll Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter poll title..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-400"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your poll..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-zinc-400 min-h-[100px]"
                  maxLength={500}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Candidates/Options *</Label>
                  <Button
                    type="button"
                    onClick={addCandidate}
                    disabled={candidates.length >= 10}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {candidates.map((candidate, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={candidate}
                        onChange={(e) => updateCandidate(index, e.target.value)}
                        placeholder={`Option ${index + 1}...`}
                        className="bg-white/5 border-white/10 text-white placeholder:text-zinc-400"
                        maxLength={50}
                      />
                      {candidates.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeCandidate(index)}
                          variant="outline"
                          size="icon"
                          className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Poll Duration (Hours) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  max={8760}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-zinc-400">
                  Poll will be active for {duration} hours ({Math.round((duration / 24) * 10) / 10} days)
                </p>
              </div>

              {!isConnected && (
                <div className="p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-center">Please connect your wallet to create a poll</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={!isFormValid() || loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white border border-blue-300/30 rounded-xl py-3"
              >
                {loading ? "Creating Poll..." : "Create Poll"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-zinc-900 border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-green-400">Poll Created Successfully! 🎉</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-zinc-300">Your poll has been created and deployed to the blockchain.</p>

            {createdPoll && (
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-zinc-400">Poll ID</p>
                  <p className="font-mono text-white">#{createdPoll.pollId}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-zinc-400">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-white text-xs break-all">{createdPoll.txHash}</p>
                    <a
                      href={getBaseScanUrl(createdPoll.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSuccessClose} className="flex-1 bg-blue-600 hover:bg-blue-500">
                View All Polls
              </Button>
              {createdPoll && (
                <Button
                  onClick={() => router.push(`/polls/${createdPoll.pollId}`)}
                  variant="outline"
                  className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  View This Poll
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
