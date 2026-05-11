"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import type { DateRange } from "react-day-picker"
import type { PeriodKey, Shortcut } from "@/hooks/use-expense-filter"

interface FilterDateRangePickerProps {
  isMobile: boolean
  period: PeriodKey | null
  dateLabel: string | null
  calOpen: boolean
  handleCalOpen: (open: boolean) => void
  shortcuts: Shortcut[]
  applyShortcut: (s: { from: string; to: string }) => void
  calendarSelected: DateRange
  handleRangeSelect: (range: DateRange | undefined) => void
  localRange: DateRange | null
  rangeHint: string
  applyRange: () => void
}

export function FilterDateRangePicker({
  isMobile, period, dateLabel, calOpen, handleCalOpen,
  shortcuts, applyShortcut, calendarSelected,
  handleRangeSelect, localRange, rangeHint, applyRange,
}: FilterDateRangePickerProps) {
  const trigger = (
    <Button
      variant={!period && dateLabel ? "secondary" : "outline"}
      size="sm"
      className="h-7 gap-1.5 text-xs font-normal"
    >
      <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className={!period && dateLabel ? "" : "text-muted-foreground"}>
        {!period && dateLabel ? dateLabel : "Custom range…"}
      </span>
    </Button>
  )

  const body = (
    <>
      <div className="border-b p-2 flex flex-wrap gap-1.5">
        {shortcuts.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => applyShortcut(s)}
            className="rounded-md border border-input bg-background px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
      <Calendar
        mode="range"
        selected={calendarSelected}
        onSelect={handleRangeSelect}
        disabled={{ after: new Date() }}
        numberOfMonths={isMobile ? 1 : 2}
        className="mx-auto"
      />
      <div className="flex items-center justify-between border-t px-3 py-2 gap-2">
        <p className="text-xs text-muted-foreground">{rangeHint}</p>
        <Button
          size="sm"
          className="h-7 text-xs"
          disabled={!localRange?.from || !localRange?.to}
          onClick={applyRange}
        >
          Apply
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={calOpen} onOpenChange={handleCalOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent><div className="overflow-y-auto">{body}</div></DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={calOpen} onOpenChange={handleCalOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" collisionPadding={8}>
        {body}
      </PopoverContent>
    </Popover>
  )
}
