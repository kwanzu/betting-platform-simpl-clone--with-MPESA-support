import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { AppError, handleError } from "@/lib/errors"

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session || session.user.role !== "admin") {
      throw new AppError("Unauthorized", 401)
    }

    const { result } = await req.json()

    const match = await prisma.match.update({
      where: { id: params.id },
      data: { result },
    })

    // Update all bets related to this match
    const bets = await prisma.bet.findMany({
      where: {
        matches: {
          path: ["$[*].matchId"],
          array_contains: params.id,
        },
      },
    })

    for (const bet of bets) {
      const betResult = bet.matches.every((matchBet: any) =>
        matchBet.matchId === params.id ? matchBet.prediction === result : true,
      )

      await prisma.bet.update({
        where: { id: bet.id },
        data: { status: betResult ? "won" : "lost" },
      })

      if (betResult) {
        // If bet is won, update user's balance
        await prisma.user.update({
          where: { id: bet.userId },
          data: { balance: { increment: bet.amount * bet.odds } },
        })
      }
    }

    return NextResponse.json({ message: "Match result updated and bets processed" })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

