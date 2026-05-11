import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-muted-foreground text-sm">Page not found.</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
