"use client"

import { motion } from "framer-motion"
import { ArrowRight, Vote, Shield, Zap, Users, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeroConnect } from "@/components/wallet/hero-connect"
import { BreathingBricks } from "@/components/breathing-bricks"
import { CursorTrail } from "@/components/cursor-trail"
import { PulseBackground } from "@/components/pulse-background"
import { LiteModeToggle } from "@/components/lite-mode-toggle"
import { useLiteMode } from "@/components/lite-mode-provider"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: Vote,
    title: "Decentralized Voting",
    description: "Create and participate in transparent, blockchain-based polls with immutable results.",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description: "All votes are recorded on Base blockchain, ensuring complete transparency and security.",
  },
  {
    icon: Zap,
    title: "Gasless Voting",
    description: "Vote without paying gas fees using our integrated paymaster solution.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Build and engage with your community through democratic decision-making.",
  },
]

export default function HomePage() {
  const { isLiteMode } = useLiteMode()
  const { isConnected } = useAccount()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {!isLiteMode && (
        <>
          <CursorTrail />
          <PulseBackground />
          <BreathingBricks />
        </>
      )}

      <div className="absolute top-4 right-4 z-50">
        <LiteModeToggle />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="VoteSprout" width={40} height={40} className="rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VoteSprout
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/polls" className="text-slate-300 hover:text-white transition-colors">
              Polls
            </Link>
            <Link href="/polls/create" className="text-slate-300 hover:text-white transition-colors">
              Create Poll
            </Link>
            <HeroConnect />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VoteSprout
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              The future of decentralized voting. Create polls, vote securely, and build consensus on Base blockchain.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            {isConnected ? (
              <Button
                onClick={() => router.push("/polls")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Polls <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <HeroConnect />
            )}

            <Button
              onClick={() => router.push("/polls/create")}
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Create Poll
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex justify-center"
          >
            <ChevronDown className="h-8 w-8 text-slate-400 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose VoteSprout?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Built on Base blockchain for maximum security, transparency, and user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <feature.icon className="h-12 w-12 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Start Voting?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join the decentralized governance revolution. Create your first poll or participate in existing ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/polls/create")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Your First Poll <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => router.push("/polls")}
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                Browse Polls
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
