"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Search } from "lucide-react"

type SearchFieldProps = {
  defaultValue?: string
  action?: string
  placeholder?: string
}

export function SearchField({
  defaultValue = "",
  action = "/explorar",
  placeholder = "Buscar eventos o lugares...",
}: SearchFieldProps) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (value.trim()) params.set("q", value.trim())
    const qs = params.toString()
    router.push(qs ? `${action}?${qs}` : action)
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label className="relative block">
        <span className="sr-only">Buscar</span>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-transparent bg-muted pr-4 pl-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
        />
      </label>
    </form>
  )
}
