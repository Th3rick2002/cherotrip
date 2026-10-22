import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground">No encontrado</h1>
      <p className="max-w-sm text-muted-foreground">
        Ese evento o lugar no existe o aún no está publicado.
      </p>
      <Link
        href="/explorar"
        className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Ir a Explorar
      </Link>
    </div>
  )
}
