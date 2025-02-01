import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BetPlatform - Your Ultimate Sports Betting Destination",
  description:
    "Experience the thrill of sports betting with live odds, instant payouts, and responsible gambling features.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <footer className="bg-gray-900 text-white py-4">
              <div className="container mx-auto text-center">
                <p>&copy; 2023 BetPlatform. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

