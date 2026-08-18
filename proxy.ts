import { NextResponse, type NextRequest } from "next/server"
import { COOKIE_SESSAO } from "@/lib/auth/config"
import { rotaEhPublica, usuarioPodeAcessarRota } from "@/lib/auth/permissions"
import { verificarTokenSessaoEdge } from "@/lib/auth/verify-edge"

/**
 * Protege todas as rotas de página do sistema: sem sessão válida, redireciona
 * para `/login` preservando o destino original (`returnTo`). Com sessão mas
 * sem papel suficiente para a rota, redireciona para `/403`.
 *
 * Não cobre `/api/*` (as rotas de auth cuidam da própria lógica) nem
 * assets — ver `matcher` abaixo.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (rotaEhPublica(pathname)) {
    // Usuário já autenticado não deveria ver a tela de login de novo.
    if (pathname === "/login") {
      const sessao = await verificarTokenSessaoEdge(request.cookies.get(COOKIE_SESSAO)?.value)
      if (sessao) return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  const sessao = await verificarTokenSessaoEdge(request.cookies.get(COOKIE_SESSAO)?.value)

  if (!sessao) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("returnTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!usuarioPodeAcessarRota(pathname, sessao.usuario.papeis)) {
    return NextResponse.redirect(new URL("/403", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico|glb|gltf|mp3)$).*)"],
}
