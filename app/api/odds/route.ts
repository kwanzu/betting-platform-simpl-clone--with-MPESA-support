import { NextResponse } from "next/server"

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const sendOdds = () => {
        // In a real-world scenario, you'd fetch the latest odds from your database or external API
        const odds = {
          "1": { home: 2.5, draw: 3.2, away: 2.8 },
          "2": { home: 1.8, draw: 3.5, away: 4.2 },
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(odds)}\n\n`))
      }

      // Send initial odds
      sendOdds()

      // Update odds every 5 seconds
      const interval = setInterval(sendOdds, 5000)

      return () => {
        clearInterval(interval)
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

