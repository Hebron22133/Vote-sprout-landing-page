import { NextResponse } from "next/server"
import { createProposal, listProposalsByDao } from "@/lib/db/repo"

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const daoId = Number(ctx.params.id)
  const proposals = await listProposalsByDao(daoId)
  return NextResponse.json({ proposals })
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const daoId = Number(ctx.params.id)
    const body = await req.json()
    const p = await createProposal({
      daoId,
      title: body?.title,
      description: body?.description,
      options: Array.isArray(body?.options) ? body.options : ["Yes", "No"],
      creator: body?.creator ?? null,
      txHash: body?.txHash ?? null,
    })
    return NextResponse.json({ proposal: p }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid input" }, { status: 400 })
  }
}
