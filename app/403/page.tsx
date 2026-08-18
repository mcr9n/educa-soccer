import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Acesso restrito — EducaSoccer",
}

export default function AcessoRestritoPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-stadium p-4">
      <div className="panel-bevel flex w-full max-w-sm flex-col items-center gap-4 rounded-md bg-card p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-danger bg-danger/10 text-danger">
          <ShieldAlert className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-pixel text-lg font-extrabold uppercase tracking-tight text-foreground">
            Acesso Restrito
          </h1>
          <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
            Seu usuário não tem permissão para acessar esta área do sistema.
          </p>
        </div>
        <Button render={<a href="/" />} nativeButton={false} className="w-full">
          Voltar ao painel inicial
        </Button>
      </div>
    </main>
  )
}
