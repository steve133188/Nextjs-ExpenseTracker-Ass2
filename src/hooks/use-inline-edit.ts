import { useState } from "react"

export function useInlineEdit() {
  const [editing, setEditing] = useState(false)
  const [value,   setValue]   = useState("")

  function start(currentValue: string) {
    setValue(currentValue)
    setEditing(true)
  }

  function cancel() {
    setEditing(false)
    setValue("")
  }

  return { editing, value, setValue, start, cancel }
}
