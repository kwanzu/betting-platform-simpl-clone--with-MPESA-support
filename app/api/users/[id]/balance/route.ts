import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { AppError, handleError } from "@/lib/errors"

const prisma = new PrismaClient()

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session || session.user.id !== params.id) {
      throw new AppError("Unauthorized", 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { balance: true },
    })

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return NextResponse.json({ balance: user.balance })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

