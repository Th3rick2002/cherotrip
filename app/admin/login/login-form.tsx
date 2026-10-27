"use client"

import { useActionState } from "react"
import { LoaderCircle } from "lucide-react"
import { signIn, type SignInState } from "@/app/admin/actions"

const initialState: SignInState = { error: null, email: "" }

export function LoginForm({ next }: { next: string | null }) {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
          Correo
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Entrando…" : "Entrar"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No hay registro público. Pide tu cuenta al equipo de Cherotrip.
      </p>
    </form>
  )
}
