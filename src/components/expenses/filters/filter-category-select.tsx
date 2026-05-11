"use client"

import { ChevronDown, X } from "lucide-react"
import { EXPENSE_CATEGORIES } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface FilterCategorySelectProps {
  categories: string[]
  catOpen: boolean
  setCatOpen: (open: boolean) => void
  toggleCategory: (cat: string) => void
}

export function FilterCategorySelect({ categories, catOpen, setCatOpen, toggleCategory }: FilterCategorySelectProps) {
  return (
    <Popover open={catOpen} onOpenChange={setCatOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs font-normal">
          {categories.length === 0
            ? <span className="text-muted-foreground">All categories</span>
            : <span>{categories.length} selected</span>
          }
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories…" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {EXPENSE_CATEGORIES.map((cat) => (
                <CommandItem
                  key={cat}
                  value={cat}
                  data-checked={categories.includes(cat) ? "true" : undefined}
                  onSelect={() => toggleCategory(cat)}
                >
                  {cat}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function FilterCategoryChips({ categories, toggleCategory }: { categories: string[]; toggleCategory: (cat: string) => void }) {
  if (categories.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1 pl-0.5">
      {categories.map((cat) => (
        <Badge key={cat} variant="secondary" className="gap-1 pr-1 h-6 text-xs font-normal">
          {cat}
          <button
            onClick={() => toggleCategory(cat)}
            className="rounded-sm opacity-60 hover:opacity-100 focus:outline-none"
            aria-label={`Remove ${cat}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
