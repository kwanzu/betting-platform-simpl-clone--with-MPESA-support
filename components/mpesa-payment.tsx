"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

interface MPESAPaymentProps {
  amount: number
  onSuccess: () => void
  betId: string
}

export function MPESAPayment({ amount, onSuccess, betId }: MPESAPaymentProps) {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/mpesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, phone, betId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone to complete the payment.",
        })

        // Start polling for payment status
        pollPaymentStatus(betId)
      } else {
        throw new Error(data.error || "Payment initiation failed")
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pollPaymentStatus = async (betId: string) => {
    const maxAttempts = 10
    const interval = 5000 // 5 seconds

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval))

      const response = await fetch(`/api/bets/${betId}/status`)
      const data = await response.json()

      if (data.status === "paid") {
        onSuccess()
        return
      } else if (data.status === "payment_failed") {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    toast({
      title: "Payment Status Unknown",
      description: "We couldn't confirm your payment. Please check your M-PESA messages or contact support.",
      variant: "warning",
    })
  }

  return (
    <div className="space-y-4">
      <Input
        type="tel"
        placeholder="Enter M-PESA phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button onClick={handlePayment} disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : `Pay ${amount} KES with M-PESA`}
      </Button>
    </div>
  )
}

