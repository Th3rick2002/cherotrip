"use client"

import { useState, type KeyboardEvent } from "react"
import { Clock3, MapPin } from "lucide-react"
import type { SubEvent } from "@/lib/types/listing"

function formatDay(value: string) {
  const date = new Date(`${value}T12:00:00`)
  return {
    weekday: new Intl.DateTimeFormat("es-SV", { weekday: "short" }).format(date),
    date: new Intl.DateTimeFormat("es-SV", {
      day: "numeric",
      month: "short",
    }).format(date),
  }
}

function formatTime(value: string) {
  return value.slice(0, 5)
}

export function EventAgenda({ items }: { items: SubEvent[] }) {
  const days = [...new Set(items.map((item) => item.event_date))]
  const [activeDay, setActiveDay] = useState(days[0])
  const dayItems = items.filter((item) => item.event_date === activeDay)

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % days.length
        : event.key === "ArrowLeft"
          ? (index - 1 + days.length) % days.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? days.length - 1
              : -1
    if (nextIndex < 0) return

    event.preventDefault()
    setActiveDay(days[nextIndex])
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]
      ?.focus()
  }

  if (items.length === 0) return null

  return (
    <section aria-labelledby="event-agenda-title" className="space-y-4">
      <div>
        <h2 id="event-agenda-title" className="text-lg font-semibold text-foreground">
          Agenda del evento
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {days.length} {days.length === 1 ? "día" : "días"} de actividades
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Días del evento"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {days.map((day) => {
          const label = formatDay(day)
          const active = day === activeDay
          return (
            <button
              key={day}
              type="button"
              role="tab"
              id={`agenda-day-${day}`}
              aria-controls={`agenda-panel-${day}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onKeyDown={(event) => handleTabKeyDown(event, days.indexOf(day))}
              onClick={() => setActiveDay(day)}
              className={`flex min-w-24 flex-col rounded-xl border px-4 py-2 text-left transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-xs font-medium capitalize">{label.weekday}</span>
              <span className="text-sm font-semibold capitalize">{label.date}</span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`agenda-panel-${activeDay}`}
        aria-labelledby={`agenda-day-${activeDay}`}
        tabIndex={0}
      >
      <ol className="space-y-0">
        {dayItems.map((item, index) => (
          <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
            {index < dayItems.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-7 bottom-0 left-[5.5rem] w-px bg-border"
              />
            ) : null}
            <div className="w-16 shrink-0 pt-1 text-right text-sm font-semibold tabular-nums text-primary">
              {formatTime(item.start_time)}
              {item.end_time ? (
                <span className="block text-xs font-normal text-muted-foreground">
                  {formatTime(item.end_time)}
                </span>
              ) : null}
            </div>
            <span
              aria-hidden="true"
              className="relative z-10 mt-1.5 size-3 shrink-0 rounded-full border-2 border-primary bg-card"
            />
            <div className="min-w-0 flex-1 space-y-1 rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                {item.activity_category?.name ? (
                  <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-foreground">
                    {item.activity_category.name}
                  </span>
                ) : null}
              </div>
              {item.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {formatTime(item.start_time)}
                  {item.end_time ? `–${formatTime(item.end_time)}` : ""}
                </span>
                {item.venue ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {item.venue}
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </section>
  )
}
