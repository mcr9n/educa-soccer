import { NextResponse, type NextRequest } from "next/server"
import { COOKIE_PKCE_STATE } from "@/lib/auth/config"
import { trocarCodePorTokens } from "@/lib/auth/keycloak"
import { urlPublica } from "@/lib/auth/request-origin"
import { criarSessao } from "@/lib/auth/session"

/**
 * Callback do fluxo OIDC (Authorization Code + PKCE). Recebe `code` e
 * `state` do IdP, valida o `state` contra o cookie efêmero gravado em
 * `/api/auth/login`, troca o code por tokens e cria a sessão local.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")

  const cookiePkce = request.cookies.get(COOKIE_PKCE_STATE)?.value
  const dadosPkce = cookiePkce ? safeJsonParse(cookiePkce) : null

  if (!code || !state || !dadosPkce || dadosPkce.state !== state) {
    return NextResponse.redirect(urlPublica("/login?erro=state_invalido", request))
  }

  const resultado = await trocarCodePorTokens(code)
  if (!resultado) {
    return NextResponse.redirect(urlPublica("/login?erro=code_invalido", request))
  }

  // `criarSessao` usa `cookies()` de `next/headers`, que dentro de um Route
  // Handler grava diretamente na resposta sendo montada — não é necessário
  // repassar o cookie manualmente.
  await criarSessao(resultado.usuario)

  const returnTo: string = typeof dadosPkce.returnTo === "string" ? dadosPkce.returnTo : "/"
  const response = NextResponse.redirect(urlPublica(returnTo, request))
  response.cookies.delete(COOKIE_PKCE_STATE)
  return response
}

function safeJsonParse(value: string): { state?: string; codeVerifier?: string; returnTo?: string } | null {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
