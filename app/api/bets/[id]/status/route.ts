import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { AppError, handleError } from "@/lib/errors"

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const bet = await prisma.bet.findUnique({
      where: { id: params.id },
      select: { status: true },
    })

    if (!bet) {
      throw new AppError("Bet not found", 404)
    }

    return NextResponse.json({ status: bet.status })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

