"use client"

import CursorTrail from "@/components/cursor-trail"
import PulseBackground from "@/components/pulse-background"
import { useLiteMode } from "@/components/lite-mode-provider"
import HeaderBar from "@/components/header-bar"
import { CreatePollForm } from "@/components/voting/create-poll-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePollPage() {
  const { isLiteMode } = useLiteMode()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a] relative overflow-hidden">
      <HeaderBar />
      <div className="hidden md:block">
        <CursorTrail isLiteMode={isLiteMode} />
      </div>
      <PulseBackground isLiteMode={isLiteMode} />

      <main className="container mx-auto px-4 py-10 relative z-30 max-w-2xl">
        <Link href="/polls">
          <Button variant="outline" className="mb-6 bg-white/5 border border-white/10 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        </Link>

        <CreatePollForm />
      </main>
    </div>
  )
}
