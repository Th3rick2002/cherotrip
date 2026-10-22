const dateFormatter = new Intl.DateTimeFormat("es-SV", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "America/El_Salvador",
})

const timeFormatter = new Intl.DateTimeFormat("es-SV", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/El_Salvador",
})

export function formatEventWhen(startsAt: string | null): string | null {
  if (!startsAt) return null
  const date = new Date(startsAt)
  const day = dateFormatter.format(date).replace(/\.$/, "")
  const time = timeFormatter.format(date)
  return `${capitalize(day)} · ${time}`
}

export function formatPriceFrom(price: number | null): string {
  if (price == null) return "Consultar"
  if (price === 0) return "Entrada libre"
  return `Desde $${price.toFixed(2).replace(/\.00$/, "")}`
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
