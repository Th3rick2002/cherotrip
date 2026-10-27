import { LogOut } from "lucide-react"
import { signOut } from "@/app/admin/actions"
import { requireAdmin } from "@/lib/admin/auth"

export async function AdminAccount() {
  const admin = await requireAdmin()

  return (
    <div className="space-y-3">
      <p className="truncate text-xs text-slate-400" title={admin.email ?? undefined}>
        {admin.email ?? "Admin"}
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800/60 hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
