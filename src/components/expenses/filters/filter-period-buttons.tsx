"use client"

import { Button } from "@/components/ui/button"
import type { PeriodKey } from "@/hooks/use-expense-filter"

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "year",  label: "Year"  },
]

interface FilterPeriodButtonsProps {
  period: PeriodKey | null
  handlePeriod: (key: PeriodKey) => void
}

export function FilterPeriodButtons({ period, handlePeriod }: FilterPeriodButtonsProps) {
  return (
    <>
      {PERIODS.map(({ key, label }) => (
        <Button
          key={key}
          variant={period === key ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => handlePeriod(key)}
        >
          {label}
        </Button>
      ))}
    </>
  )
}
