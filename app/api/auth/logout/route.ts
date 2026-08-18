import { NextResponse, type NextRequest } from "next/server"
import { destruirSessao } from "@/lib/auth/session"

/**
 * Encerra a sessão local. Quando o Keycloak real estiver conectado, este
 * handler também deve redirecionar para `authConfig.logoutUrl` (end-session
 * endpoint) para encerrar a sessão no IdP — hoje, como o IdP é mockado, só
 * limpamos o cookie local e voltamos para a tela de login.
 */
export async function POST(request: NextRequest) {
  await destruirSessao()
  return NextResponse.redirect(new URL("/login", request.url))
}

export async function GET(request: NextRequest) {
  return POST(request)
}
