import { AlertTriangle, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export const metadata = {
  title: "Sign in to educa-soccer",
}

/**
 * Simulação da página de login hospedada do Keycloak.
 *
 * Estilo deliberadamente diferente do resto do app (sem a identidade visual
 * do EducaSoccer) para deixar claro que esta tela representa um domínio
 * separado — o IdP —, exatamente como aconteceria com o Keycloak real
 * hospedado em outra origem. Quando o Keycloak estiver conectado, esta
 * página e as rotas em `app/api/auth/mock-idp/*` são removidas.
 */
export default async function MockIdpPage({
  searchParams,
}: {
  searchParams: Promise<{
    state?: string
    redirect_uri?: string
    client_id?: string
    return_to?: string
    erro?: string
  }>
}) {
  const { state = "", redirect_uri = "/api/auth/callback", client_id, erro } = await searchParams

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-100 p-4 font-sans">
      <div className="w-full max-w-sm">
        <Alert className="mb-4 border-amber-300 bg-amber-50 text-amber-900">
          <AlertTriangle className="text-amber-600" />
          <AlertTitle>Ambiente de simulação</AlertTitle>
          <AlertDescription className="text-amber-800">
            Esta tela simula a página de login hospedada do Keycloak. Nenhum servidor de identidade real está
            conectado ainda.
          </AlertDescription>
        </Alert>

        <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold text-neutral-900">Sign in to educa-soccer</h1>
            <p className="text-sm text-neutral-500">
              {client_id ? `Client: ${client_id}` : "Realm: educa-soccer"}
            </p>
          </div>

          {erro === "credenciais_invalidas" && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>Usuário ou senha inválidos. Tente novamente.</AlertDescription>
            </Alert>
          )}

          <form action="/api/auth/mock-idp/login" method="POST">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Usuário</FieldLabel>
                <Input id="username" name="username" autoComplete="username" required autoFocus />
              </Field>
              <Field>
                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                <Input id="senha" name="senha" type="password" autoComplete="current-password" required />
              </Field>

              <input type="hidden" name="state" value={state} />
              <input type="hidden" name="redirect_uri" value={redirect_uri} />

              <Button type="submit" size="lg" className="w-full">
                Sign In
              </Button>
            </FieldGroup>
          </form>

          <div className="mt-6 rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-3 text-xs text-neutral-600">
            <p className="mb-1 font-medium text-neutral-700">Credenciais de teste (simulação):</p>
            <p>
              <span className="font-mono">coordenacao</span> / <span className="font-mono">Educa@123</span> —
              Administrador/Coordenação
            </p>
            <p>
              <span className="font-mono">professor</span> / <span className="font-mono">Educa@123</span> —
              Professor
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
