import { TopBar } from "@/components/layout/top-bar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-10 pt-5 sm:px-6 sm:pt-8">
        {children}
      </main>
    </div>
  )
}
