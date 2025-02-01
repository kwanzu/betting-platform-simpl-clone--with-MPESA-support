"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MPESAPayment } from "@/components/mpesa-payment"
import { toast } from "@/components/ui/use-toast"

interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  country: string
  time: string
  odds: {
    home: number
    draw: number
    away: number
  }
}

const initialMatches: Match[] = [
  {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    league: "Premier League",
    country: "England",
    time: "19:45",
    odds: {
      home: 2.45,
      draw: 3.4,
      away: 2.9,
    },
  },
  {
    id: "2",
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    league: "La Liga",
    country: "Spain",
    time: "20:00",
    odds: {
      home: 2.1,
      draw: 3.5,
      away: 3.2,
    },
  },
]

export function MatchesList() {
  const { data: session } = useSession()
  const [matches, setMatches] = useState(initialMatches)
  const [selectedBets, setSelectedBets] = useState<{ [key: string]: string }>({})
  const [betAmount, setBetAmount] = useState<string>("")

  useEffect(() => {
    const eventSource = new EventSource("/api/odds")
    eventSource.onmessage = (event) => {
      const newOdds = JSON.parse(event.data)
      setMatches((prevMatches) =>
        prevMatches.map((match) => ({
          ...match,
          odds: newOdds[match.id] || match.odds,
        })),
      )
    }
    return () => eventSource.close()
  }, [])

  const handleBetSelection = (matchId: string, bet: string) => {
    setSelectedBets((prev) => ({ ...prev, [matchId]: bet }))
  }

  const removeBet = (matchId: string) => {
    setSelectedBets((prev) => {
      const newBets = { ...prev }
      delete newBets[matchId]
      return newBets
    })
  }

  const calculateTotalOdds = () => {
    return Object.entries(selectedBets).reduce((total, [matchId, bet]) => {
      const match = matches.find((m) => m.id === matchId)
      if (match) {
        return total * match.odds[bet as keyof typeof match.odds]
      }
      return total
    }, 1)
  }

  const calculateTotalStake = () => {
    return Object.keys(selectedBets).length * Number.parseFloat(betAmount || "0")
  }

  const totalOdds = calculateTotalOdds()
  const potentialWinnings = Number.parseFloat(betAmount) * totalOdds

  const handlePlaceBet = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to place a bet.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matches: selectedBets,
          amount: Number.parseFloat(betAmount),
          odds: totalOdds,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to place bet")
      }

      const data = await response.json()
      toast({
        title: "Bet Placed",
        description: `Your bet has been placed successfully. Bet ID: ${data.id}`,
      })

      // Reset form
      setSelectedBets({})
      setBetAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place bet. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {match.country} - {match.league}
                </div>
                <div className="mt-1 font-medium">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(["home", "draw", "away"] as const).map((outcome) => (
                  <Button
                    key={outcome}
                    variant={selectedBets[match.id] === outcome ? "default" : "outline"}
                    className="w-20"
                    onClick={() => handleBetSelection(match.id, outcome)}
                  >
                    <div className="text-sm font-medium">{match.odds[outcome]}</div>
                    <div className="text-xs text-muted-foreground">
                      {outcome === "home" ? "1" : outcome === "draw" ? "X" : "2"}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Betting Slip</h2>
        <div className="space-y-4">
          {Object.entries(selectedBets).map(([matchId, bet]) => {
            const match = matches.find((m) => m.id === matchId)
            return (
              <div key={matchId} className="flex justify-between items-center">
                <span>
                  {match?.homeTeam} vs {match?.awayTeam}
                </span>
                <div>
                  <span className="mr-2">
                    {bet.toUpperCase()} @ {match?.odds[bet as keyof typeof match.odds].toFixed(2)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeBet(matchId)}>
                    X
                  </Button>
                </div>
              </div>
            )
          })}
          <div>
            <div className="flex justify-between">
              <span>Total Odds:</span>
              <span>{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Bet Amount:</span>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-32"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span>Total Stake:</span>
              <span>{calculateTotalStake().toFixed(2)} KES</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Potential Winnings:</span>
              <span>{potentialWinnings.toFixed(2)} KES</span>
            </div>
          </div>
          {betAmount && (
            <>
              <Button onClick={handlePlaceBet} className="w-full">
                Place Bet
              </Button>
              <MPESAPayment amount={calculateTotalStake()} onSuccess={handlePlaceBet} />
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

