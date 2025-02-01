import { NextResponse } from "next/server"
import axios from "axios"

const consumerKey = process.env.MPESA_CONSUMER_KEY!
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!
const passkey = process.env.MPESA_PASSKEY!
const shortcode = process.env.MPESA_SHORTCODE!
const callbackUrl = process.env.MPESA_CALLBACK_URL!

async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
  const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  return response.data.access_token
}

export async function POST(req: Request) {
  try {
    const { amount, phone } = await req.json()
    const accessToken = await getAccessToken()

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64")

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: "BetPlatform",
        TransactionDesc: "Betting Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("MPESA API Error:", error)
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 })
  }
}

