"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition, type FormEvent } from "react"
import { LoaderCircle, Search } from "lucide-react"

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
  const [pending, startTransition] = useTransition()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const params = new URLSearchParams()
    if (value.trim()) params.set("q", value.trim())
    const qs = params.toString()
    startTransition(() => router.push(qs ? `${action}?${qs}` : action))
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Buscar</span>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          autoComplete="off"
          aria-label="Buscar eventos o lugares"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-transparent bg-muted pr-4 pl-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70 sm:px-5">
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Search className="size-4" aria-hidden="true" />}
        <span>{pending ? "Buscando…" : "Buscar"}</span>
      </button>
    </form>
  )
}
