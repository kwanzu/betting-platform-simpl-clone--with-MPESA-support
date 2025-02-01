import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { AppError, handleError } from "@/lib/errors"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession()

    if (!session || !session.user) {
      throw new AppError("Unauthorized", 401)
    }

    const { limit } = await req.json()

    if (typeof limit !== "number" || limit <= 0) {
      throw new AppError("Invalid deposit limit", 400)
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { depositLimit: limit },
    })

    return NextResponse.json({ message: "Deposit limit set successfully" })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

