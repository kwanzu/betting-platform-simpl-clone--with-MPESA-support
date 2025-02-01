"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResponsibleGamblingPage() {
  const { data: session } = useSession()
  const [depositLimit, setDepositLimit] = useState("")
  const [exclusionPeriod, setExclusionPeriod] = useState("")

  const handleSetDepositLimit = async () => {
    try {
      const response = await fetch("/api/users/deposit-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: Number.parseFloat(depositLimit) }),
      })

      if (!response.ok) throw new Error("Failed to set deposit limit")

      toast({
        title: "Deposit Limit Set",
        description: `Your daily deposit limit has been set to ${depositLimit} KES.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set deposit limit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSelfExclusion = async () => {
    try {
      const response = await fetch("/api/users/self-exclusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: exclusionPeriod }),
      })

      if (!response.ok) throw new Error("Failed to set self-exclusion")

      toast({
        title: "Self-Exclusion Set",
        description: `You have been self-excluded for ${exclusionPeriod}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set self-exclusion. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Responsible Gambling</h1>

      <Card>
        <CardHeader>
          <CardTitle>Set Daily Deposit Limit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Enter daily deposit limit"
            value={depositLimit}
            onChange={(e) => setDepositLimit(e.target.value)}
          />
          <Button onClick={handleSetDepositLimit}>Set Limit</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Self-Exclusion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setExclusionPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Select exclusion period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1 day">1 day</SelectItem>
              <SelectItem value="1 week">1 week</SelectItem>
              <SelectItem value="1 month">1 month</SelectItem>
              <SelectItem value="6 months">6 months</SelectItem>
              <SelectItem value="1 year">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSelfExclusion}>Set Self-Exclusion</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gambling Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We'll implement this in the next step */}
          <p>Your gambling activity summary will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

