import { NextResponse } from "next/server"
import { getPimlicoChain } from "@/lib/aa/env"

export async function POST(req: Request) {
  const body = await req.json()
  const { userOpHash } = body || {}
  if (!userOpHash) return NextResponse.json({ error: "Missing userOpHash" }, { status: 400 })

  const chain = getPimlicoChain()
  const apiKey = process.env.PIMLICO_API_KEY
  if (!apiKey) return NextResponse.json({ error: "PIMLICO_API_KEY not set" }, { status: 500 })

  const url = `https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`

  // Poll for receipt (short loop)
  for (let i = 0; i < 20; i++) {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getUserOperationReceipt",
        params: [userOpHash],
      }),
    })
    const data = await r.json()
    if (data?.result) {
      return NextResponse.json({ receipt: data.result })
    }
    await new Promise((res) => setTimeout(res, 1500))
  }

  return NextResponse.json({ receipt: null })
}
