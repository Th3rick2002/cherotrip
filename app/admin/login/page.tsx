import { Suspense } from "react"
import { LoginForm } from "@/app/admin/login/login-form"

export const metadata = {
  title: "Acceso",
}

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Cherotrip
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Panel interno</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acceso solo para el equipo de Turismo y Marketing.
        </p>
        <div className="mt-6">
          <Suspense fallback={<LoginForm next={null} />}>
            <LoginFormWithNext searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function LoginFormWithNext({
  searchParams,
}: {
  searchParams: PageProps<"/admin/login">["searchParams"]
}) {
  const { next } = await searchParams
  return <LoginForm next={typeof next === "string" ? next : null} />
}
