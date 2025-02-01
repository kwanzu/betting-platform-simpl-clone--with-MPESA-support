import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { UserProfile } from "@/components/user-profile"

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <UserProfile />
    </div>
  )
}

