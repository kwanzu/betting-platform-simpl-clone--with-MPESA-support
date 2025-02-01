"use client"

import {
  ClubIcon as Football,
  TableIcon as TableTennis,
  ShoppingBasketIcon as Basketball,
  BeerIcon as Baseball,
  BoxIcon as Boxing,
  Trophy,
} from "lucide-react"

const sports = [
  { name: "Soccer", icon: Football, count: 245 },
  { name: "Table Tennis", icon: TableTennis, count: 32 },
  { name: "Basketball", icon: Basketball, count: 56 },
  { name: "Baseball", icon: Baseball, count: 24 },
  { name: "Boxing", icon: Boxing, count: 12 },
]

export function SportsSidebar() {
  return (
    <div className="w-60 border-r bg-background p-4">
      <div className="space-y-2">
        {sports.map((sport) => (
          <button
            key={sport.name}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-accent"
          >
            <div className="flex items-center">
              <sport.icon className="mr-2 h-4 w-4" />
              <span>{sport.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{sport.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

