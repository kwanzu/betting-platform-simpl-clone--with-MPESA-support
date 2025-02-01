"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function AgeVerification({ onVerified }: { onVerified: () => void }) {
  const [birthdate, setBirthdate] = useState("")

  const handleVerify = () => {
    const birthDate = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age >= 18) {
      onVerified()
    } else {
      toast({
        title: "Age Verification Failed",
        description: "You must be 18 or older to use this platform.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="birthdate">Date of Birth</Label>
      <Input id="birthdate" type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
      <Button onClick={handleVerify}>Verify Age</Button>
    </div>
  )
}

