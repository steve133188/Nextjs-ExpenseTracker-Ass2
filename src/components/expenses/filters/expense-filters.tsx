"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterPeriodButtons } from "@/components/expenses/filters/filter-period-buttons"
import { FilterDateRangePicker } from "@/components/expenses/filters/filter-date-range-picker"
import { FilterCategorySelect, FilterCategoryChips } from "@/components/expenses/filters/filter-category-select"
import type { useExpenseFilter } from "@/hooks/use-expense-filter"

type ExpenseFiltersProps = ReturnType<typeof useExpenseFilter>

export function ExpenseFilters({
  filter: { period, categories },
  isMobile,
  calOpen,
  catOpen,
  setCatOpen,
  localRange,
  hasFilter,
  calendarSelected,
  dateLabel,
  rangeHint,
  shortcuts,
  handlePeriod,
  handleCalOpen,
  handleRangeSelect,
  applyRange,
  applyShortcut,
  toggleCategory,
  clearAll,
}: ExpenseFiltersProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <FilterPeriodButtons period={period} handlePeriod={handlePeriod} />
        <div className="hidden sm:block h-5 w-px bg-border mx-0.5" />
        <FilterDateRangePicker
          isMobile={isMobile}
          period={period}
          dateLabel={dateLabel}
          calOpen={calOpen}
          handleCalOpen={handleCalOpen}
          shortcuts={shortcuts}
          applyShortcut={applyShortcut}
          calendarSelected={calendarSelected}
          handleRangeSelect={handleRangeSelect}
          localRange={localRange}
          rangeHint={rangeHint}
          applyRange={applyRange}
        />
        <div className="hidden sm:block h-5 w-px bg-border mx-0.5" />
        <FilterCategorySelect
          categories={categories}
          catOpen={catOpen}
          setCatOpen={setCatOpen}
          toggleCategory={toggleCategory}
        />
        {hasFilter && (
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={clearAll}>
            <X className="size-3.5" /> Clear
          </Button>
        )}
      </div>
      <FilterCategoryChips categories={categories} toggleCategory={toggleCategory} />
    </div>
  )
}
