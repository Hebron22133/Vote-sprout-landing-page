import { NextResponse } from "next/server"
import { castVote } from "@/lib/db/repo"

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const proposalId = Number(ctx.params.id)
    const body = await req.json()
    const v = await castVote({
      proposalId,
      voter: body?.voter,
      choiceIndex: Number(body?.choiceIndex),
    })
    return NextResponse.json({ vote: v }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid input" }, { status: 400 })
  }
}
