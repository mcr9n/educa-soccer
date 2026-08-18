import { NextResponse, type NextRequest } from "next/server"
import { COOKIE_PKCE_STATE } from "@/lib/auth/config"
import { iniciarAutorizacao } from "@/lib/auth/keycloak"

/**
 * Inicia o fluxo de login (Authorization Code + PKCE) redirecionando para o
 * endpoint de autorização do IdP — hoje, a tela mockada em `/mock-idp`.
 */
export async function GET(request: NextRequest) {
  const returnTo = sanitizarReturnTo(request.nextUrl.searchParams.get("returnTo"))
  const { state, codeVerifier, urlAutorizacao } = iniciarAutorizacao(returnTo)

  const response = NextResponse.redirect(new URL(urlAutorizacao, request.url))

  // `state` + `code_verifier` ficam em um cookie efêmero e HttpOnly, lidos de
  // volta no callback para validar a resposta do IdP e completar o PKCE.
  response.cookies.set(
    COOKIE_PKCE_STATE,
    JSON.stringify({ state, codeVerifier, returnTo }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    },
  )

  return response
}

/** Restringe `returnTo` a um caminho interno, para evitar redirecionamento aberto. */
function sanitizarReturnTo(valor: string | null): string {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//")) return "/"
  return valor
}
