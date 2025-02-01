import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const session = await getServerSession()

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  )
}

