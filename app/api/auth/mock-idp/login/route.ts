import { NextResponse, type NextRequest } from "next/server"
import { autenticarNoIdpMock } from "@/lib/auth/keycloak"
import { emitirAuthorizationCode } from "@/lib/auth/mock-idp"
import { urlPublica } from "@/lib/auth/request-origin"

/**
 * Recebe o submit do formulário da tela `/mock-idp` (equivalente ao POST que
 * o Keycloak recebe na sua própria página de login hospedada) e, se as
 * credenciais forem válidas, emite um authorization code e redireciona de
 * volta para o `redirect_uri` — igual ao comportamento real do IdP.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData()
  const username = String(form.get("username") ?? "")
  const senha = String(form.get("senha") ?? "")
  const state = String(form.get("state") ?? "")
  const redirectUri = String(form.get("redirect_uri") ?? "/api/auth/callback")

  const usuario = autenticarNoIdpMock(username, senha)

  if (!usuario) {
    const destino = urlPublica("/mock-idp", request)
    destino.search = new URLSearchParams({
      state,
      redirect_uri: redirectUri,
      erro: "credenciais_invalidas",
    }).toString()
    return NextResponse.redirect(destino)
  }

  const code = emitirAuthorizationCode(usuario)
  const destino = urlPublica(redirectUri, request)
  destino.searchParams.set("code", code)
  destino.searchParams.set("state", state)
  return NextResponse.redirect(destino)
}
