import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { AppError, handleError } from "@/lib/errors"

const prisma = new PrismaClient()

const betSchema = z.object({
  matches: z.record(z.enum(["home", "draw", "away"])),
  amount: z.number().positive().max(10000), // Set a maximum bet amount
  odds: z.number().positive(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      throw new AppError("Unauthorized", 401)
    }

    const body = await req.json()
    const validatedData = betSchema.parse(body)

    // Check if user has sufficient balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    })

    if (!user || user.balance < validatedData.amount) {
      throw new AppError("Insufficient balance", 400)
    }

    const bet = await prisma.bet.create({
      data: {
        userId: session.user.id,
        matches: validatedData.matches,
        amount: validatedData.amount,
        odds: validatedData.odds,
        status: "pending",
      },
    })

    // Deduct the bet amount from user's balance
    await prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { decrement: validatedData.amount } },
    })

    return NextResponse.json(bet)
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

