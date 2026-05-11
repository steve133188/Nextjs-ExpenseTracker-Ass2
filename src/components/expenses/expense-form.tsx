"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, parseISO } from "date-fns"
import { CalendarIcon, ChevronsUpDown, Check } from "lucide-react"
import { expenseSchema, EXPENSE_CATEGORIES, type ExpenseFormData } from "@/lib/validations"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"

const QUICK_AMOUNTS = [5, 10, 20, 50, 100, 200, 500]

interface ExpenseFormProps {
  id: string
  defaultValues?: Partial<ExpenseFormData>
  onSubmit: (data: ExpenseFormData) => void
  isPending: boolean
  onValidityChange?: (valid: boolean) => void
}

export function ExpenseForm({ id, defaultValues, onSubmit, isPending, onValidityChange }: ExpenseFormProps) {
  const [catOpen, setCatOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)

  const {
    register,
    control,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: defaultValues ?? {
      title: "",
      amount: undefined,
      category: undefined,
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (defaultValues) trigger() }, [])
  useEffect(() => { onValidityChange?.(isValid) }, [isValid, onValidityChange])

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. Grocery run" disabled={isPending} {...register("title")} />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          disabled={isPending}
          {...register("amount", { valueAsNumber: true })}
        />
        <div className="flex flex-wrap gap-1.5">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              disabled={isPending}
              onClick={() => setValue("amount", amt, { shouldValidate: true })}
              className="rounded-md border border-input bg-background px-2.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
            >
              ${amt}
            </button>
          ))}
        </div>
        {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Popover open={catOpen} onOpenChange={setCatOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  disabled={isPending}
                  className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                >
                  {field.value || "Select category…"}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search category…" />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <CommandItem key={cat} value={cat} onSelect={() => { field.onChange(cat); setCatOpen(false) }}>
                          <Check className={cn("mr-2 size-4", field.value === cat ? "opacity-100" : "opacity-0")} />
                          {cat}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Date</Label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className={cn("w-full justify-start gap-2 font-normal", !field.value && "text-muted-foreground")}
                >
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  {field.value ? format(parseISO(field.value), "MMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? parseISO(field.value) : undefined}
                  onSelect={(day) => {
                    field.onChange(day ? format(day, "yyyy-MM-dd") : "")
                    setDateOpen(false)
                  }}
                  disabled={{ after: new Date() }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" placeholder="Add a note…" rows={3} disabled={isPending} {...register("description")} />
        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
      </div>
    </form>
  )
}
