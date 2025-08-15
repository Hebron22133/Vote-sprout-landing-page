"use client"

import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { LiteModeToggle } from "@/components/lite-mode-toggle"
import { Plus, Vote, Home } from "lucide-react"

export function HeaderBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="VoteSprout" width={32} height={32} className="rounded-lg" />
          <span className="font-bold text-xl text-white">VoteSprout</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/polls">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Vote className="h-4 w-4 mr-2" />
              Polls
            </Button>
          </Link>
          <Link href="/polls/create">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </Link>
          <Link href="/contract">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              Contract
            </Button>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LiteModeToggle />
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
