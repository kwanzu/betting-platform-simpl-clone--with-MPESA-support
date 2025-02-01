import { getServerSession } from "next-auth/next"
import { LiveBalance } from "@/components/live-balance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const miniApps = [
  { name: "Sports Betting", href: "/sports", icon: "🏅" },
  { name: "Live Casino", href: "/casino", icon: "🎰" },
  { name: "Virtual Sports", href: "/virtual", icon: "🎮" },
  { name: "Promotions", href: "/promotions", icon: "🎁" },
]

export default async function Home() {
  const session = await getServerSession()

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Welcome to BetPlatform</h1>

      {session && <LiveBalance />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {miniApps.map((app) => (
          <Card key={app.name} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                <span className="mr-2 text-2xl">{app.icon}</span>
                {app.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={app.href}>Launch {app.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!session && (
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">Get Started Now</h2>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
          >
            <Link href="/login">Login to Start Betting</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

