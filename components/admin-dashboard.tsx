"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Bet {
  id: string
  userId: string
  amount: number
  odds: number
  status: string
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [bets, setBets] = useState<Bet[]>([])

  useEffect(() => {
    fetchUsers()
    fetchBets()
  }, [])

  const fetchUsers = async () => {
    const response = await fetch("/api/admin/users")
    const data = await response.json()
    setUsers(data)
  }

  const fetchBets = async () => {
    const response = await fetch("/api/admin/bets")
    const data = await response.json()
    setBets(data)
  }

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })
      toast({
        title: "User Role Updated",
        description: "The user's role has been successfully updated.",
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserRoleChange(user.id, user.role === "admin" ? "user" : "admin")}
                  >
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Bets</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Odds</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.id}>
                <TableCell>{bet.userId}</TableCell>
                <TableCell>{bet.amount}</TableCell>
                <TableCell>{bet.odds}</TableCell>
                <TableCell>{bet.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

