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

    const { period } = await req.json()

    const validPeriods = ["1 day", "1 week", "1 month", "6 months", "1 year"]
    if (!validPeriods.includes(period)) {
      throw new AppError("Invalid exclusion period", 400)
    }

    const exclusionEndDate = new Date()
    switch (period) {
      case "1 day":
        exclusionEndDate.setDate(exclusionEndDate.getDate() + 1)
        break
      case "1 week":
        exclusionEndDate.setDate(exclusionEndDate.getDate() + 7)
        break
      case "1 month":
        exclusionEndDate.setMonth(exclusionEndDate.getMonth() + 1)
        break
      case "6 months":
        exclusionEndDate.setMonth(exclusionEndDate.getMonth() + 6)
        break
      case "1 year":
        exclusionEndDate.setFullYear(exclusionEndDate.getFullYear() + 1)
        break
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { exclusionEndDate },
    })

    return NextResponse.json({ message: "Self-exclusion set successfully" })
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

