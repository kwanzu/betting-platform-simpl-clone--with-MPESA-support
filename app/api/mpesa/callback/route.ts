import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { AppError, handleError } from "@/lib/errors"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.Body || !body.Body.stkCallback) {
      throw new AppError("Invalid callback data", 400)
    }

    const { ResultCode, ResultDesc, CallbackMetadata } = body.Body.stkCallback

    if (ResultCode === 0) {
      // Payment successful
      const amount = CallbackMetadata.Item.find((item: any) => item.Name === "Amount").Value
      const mpesaReceiptNumber = CallbackMetadata.Item.find((item: any) => item.Name === "MpesaReceiptNumber").Value
      const phoneNumber = CallbackMetadata.Item.find((item: any) => item.Name === "PhoneNumber").Value

      // Update the bet status in the database
      const updatedBet = await prisma.bet.update({
        where: { id: body.bet_id },
        data: {
          status: "paid",
          paymentDetails: {
            amount,
            mpesaReceiptNumber,
            phoneNumber,
          },
        },
      })

      // If bet is now paid, update user's balance
      if (updatedBet.status === "paid") {
        await prisma.user.update({
          where: { id: updatedBet.userId },
          data: { balance: { increment: amount } },
        })
      }

      return NextResponse.json({ message: "Payment processed successfully" })
    } else {
      // Payment failed
      await prisma.bet.update({
        where: { id: body.bet_id },
        data: {
          status: "payment_failed",
          paymentDetails: {
            resultCode: ResultCode,
            resultDesc: ResultDesc,
          },
        },
      })

      throw new AppError("Payment failed", 400)
    }
  } catch (error) {
    const { message, statusCode } = handleError(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

