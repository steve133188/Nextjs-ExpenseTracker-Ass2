"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-muted-foreground text-sm">Something went wrong.</p>
      <Button variant="outline" size="sm" onClick={reset}>Try again</Button>
    </div>
  )
}
