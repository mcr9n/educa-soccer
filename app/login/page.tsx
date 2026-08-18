import Image from "next/image"
import { AlertCircle, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Entrar — EducaSoccer",
  description: "Acesse o sistema de gestão EducaSoccer com sua conta.",
}

const mensagensErro: Record<string, string> = {
  state_invalido: "Sua sessão de login expirou ou é inválida. Tente novamente.",
  code_invalido: "Não foi possível concluir o login. Tente novamente.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; erro?: string }>
}) {
  const { returnTo, erro } = await searchParams
  const urlLogin = `/api/auth/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`
  const mensagemErro = erro ? mensagensErro[erro] ?? "Não foi possível fazer login. Tente novamente." : null

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stadium p-4">
      <div className="panel-bevel w-full max-w-sm overflow-hidden rounded-md bg-card">
        <header className="flex flex-col items-center gap-3 border-b-2 border-panel-shade bg-scoreboard px-6 py-8 text-center">
          <Image
            src="/educa-soccer-crest.png"
            alt="Logotipo do EducaSoccer"
            width={64}
            height={64}
            className="drop-shadow"
          />
          <div>
            <p className="font-pixel text-2xl font-extrabold uppercase leading-none tracking-tight">
              <span className="text-primary-foreground">EDUCA</span>
              <span className="text-danger">SOCCER</span>
            </p>
            <p className="mt-2 font-sans text-xs uppercase tracking-widest text-danger">Sistema de Gestão</p>
          </div>
        </header>

        <div className="flex flex-col gap-4 p-6">
          {mensagemErro && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Erro ao entrar</AlertTitle>
              <AlertDescription>{mensagemErro}</AlertDescription>
            </Alert>
          )}

          <p className="text-center font-sans text-sm leading-relaxed text-muted-foreground">
            Faça login com sua conta institucional para acessar turmas, chamadas, notas e demais áreas do sistema.
          </p>

          <Button
            render={<a href={urlLogin} />}
            nativeButton={false}
            size="lg"
            className="w-full bg-gold text-gold-foreground hover:bg-gold/80"
          >
            <ShieldCheck data-icon="inline-start" />
            Entrar com Keycloak
          </Button>

          <p className="text-center font-sans text-[11px] leading-relaxed text-muted-foreground">
            Você será redirecionado para o provedor de identidade da instituição para autenticar com segurança.
          </p>
        </div>
      </div>
    </main>
  )
}
