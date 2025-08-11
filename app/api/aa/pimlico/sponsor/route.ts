import { NextResponse } from "next/server"
import { getPimlicoChain } from "@/lib/aa/env"

export async function POST(req: Request) {
  const body = await req.json()
  const { userOperation, entryPoint } = body || {}
  if (!userOperation || !entryPoint) {
    return NextResponse.json({ error: "Missing userOperation or entryPoint" }, { status: 400 })
  }

  const chain = getPimlicoChain()
  const apiKey = process.env.PIMLICO_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "PIMLICO_API_KEY not set" }, { status: 500 })
  }

  const url = `https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "pm_sponsorUserOperation",
      params: [userOperation, entryPoint],
    }),
  })

  const data = await r.json()
  if (!r.ok || data.error) {
    return NextResponse.json({ error: data?.error?.message || "Sponsor failed" }, { status: 500 })
  }

  // Returns paymasterAndData and gas limits
  return NextResponse.json(data.result)
}
