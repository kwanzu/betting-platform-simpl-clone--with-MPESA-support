"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function SelfExclusion() {
  const { data: session } = useSession()
  const [period, setPeriod] = useState("")

  const handleSelfExclusion = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to set self-exclusion.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/self-exclusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ period }),
      })

      if (!response.ok) {
        throw new Error("Failed to set self-exclusion")
      }

      toast({
        title: "Self-Exclusion Set",
        description: `You have been self-excluded for ${period}.`,
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Responsible Gambling</h2>
      <p className="text-sm text-muted-foreground">Set a self-exclusion period to take a break from betting.</p>
      <Select onValueChange={setPeriod}>
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
      <Button onClick={handleSelfExclusion} className="w-full">
        Set Self-Exclusion
      </Button>
    </div>
  )
}

