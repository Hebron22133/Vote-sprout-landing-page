import { NextResponse } from "next/server"
import { createDao, listDaos } from "@/lib/db/repo"

export async function GET() {
  const daos = await listDaos()
  return NextResponse.json({ daos })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const dao = await createDao({ name: body?.name, description: body?.description })
    return NextResponse.json({ dao }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid input" }, { status: 400 })
  }
}
