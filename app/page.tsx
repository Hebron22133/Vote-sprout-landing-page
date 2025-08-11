"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Zap, Vote, BarChart3, Github, Twitter, ExternalLink } from 'lucide-react'
import { useTheme } from "next-themes"
import CursorTrail from "@/components/cursor-trail"
import PulseBackground from "@/components/pulse-background"
import LiteModeToggle from "@/components/lite-mode-toggle"
import { useLiteMode } from "@/components/lite-mode-provider"
import HeroConnectButton from "@/components/wallet/hero-connect"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const { isLiteMode } = useLiteMode()
  const reduce = useReducedMotion()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const features = [
    {
      icon: Zap,
      title: "Launch a DAO in 60 Seconds",
      description: "Deploy your decentralized organization instantly with our streamlined setup process.",
      gradient: "from-zinc-700 to-zinc-600",
    },
    {
      icon: Vote,
      title: "Propose and Vote Freely",
      description: "Submit proposals and cast votes without worrying about gas fees.",
      gradient: "from-purple-600 to-fuchsia-600",
    },
    {
      icon: BarChart3,
      title: "Live Onchain Results",
      description: "Track voting progress and results in real-time, verified on Base.",
      gradient: "from-emerald-600 to-teal-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#090d12] to-[#05070a] relative overflow-hidden">
      <div className="hidden md:block">
        <CursorTrail isLiteMode={isLiteMode} />
      </div>
      <PulseBackground isLiteMode={isLiteMode} />

      {/* Header */}
      <motion.header
        initial={reduce || isLiteMode ? {} : { opacity: 0, y: -20 }}
        animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="VoteSprout logo" width={32} height={32} className="rounded-xl shadow-lg" />
            <span className="text-xl font-bold text-white">VoteSprout</span>
          </div>

          <div className="flex items-center gap-2">
            <LiteModeToggle />
            <motion.div whileHover={reduce || isLiteMode ? {} : { scale: 1.05 }} whileTap={reduce || isLiteMode ? {} : { scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-zinc-200" /> : <Moon className="w-5 h-5 text-zinc-300" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative z-30">
        <div className="container mx-auto max-w-6xl text-center space-y-10">
          <motion.div initial={reduce || isLiteMode ? {} : { opacity: 0, y: 20 }} animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="px-6 py-3 bg-white/5 border border-white/10 text-zinc-200">
              <Zap className="w-4 h-4 mr-2 text-zinc-200" />
              Built for Base Network
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight"
            initial={reduce || isLiteMode ? {} : { opacity: 0, y: 24 }}
            animate={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-transparent">
              Gasless DAO Voting
            </span>
            <br />
            <span className="bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-300 bg-clip-text text-transparent">
              for Everyone
            </span>
          </motion.h1>

          <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto">
            Create and vote on proposals using your wallet — no ETH needed.
          </p>

          <HeroConnectButton />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 relative z-30">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={reduce || isLiteMode ? {} : { opacity: 0, y: 30 }}
                whileInView={reduce || isLiteMode ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.35 }}
                style={{ willChange: "transform" }}
              >
                <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden group">
                  <CardContent className="p-8 text-center space-y-6 relative">
                    <div
                      className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-2xl`}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-zinc-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={reduce || isLiteMode ? {} : { opacity: 0 }}
        whileInView={reduce || isLiteMode ? {} : { opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 relative z-30 border-t border-white/10"
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-zinc-700 via-purple-700 to-zinc-700 rounded-xl flex items-center justify-center shadow-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">VoteSprout</span>
            </div>

            <div className="flex items-center space-x-6">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: ExternalLink, href: "https://base.org" },
              ].map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/10 border border-white/10 text-white">
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-zinc-400 text-lg">&copy; 2025 VoteSprout. Built for gasless governance.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
