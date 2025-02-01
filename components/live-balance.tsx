"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LiveBalance() {
  const { data: session } = useSession()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/users/${session.user.id}/balance`)
        const data = await response.json()
        setBalance(data.balance)
      }
    }

    fetchBalance()
    const intervalId = setInterval(fetchBalance, 30000) // Update every 30 seconds

    return () => clearInterval(intervalId)
  }, [session])

  if (balance === null) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance.toFixed(2)} KES</div>
      </CardContent>
    </Card>
  )
}

