import { NextResponse, type NextRequest } from "next/server"

/**
 * Endpoint de autorização mockado — equivalente ao `/protocol/openid-connect/auth`
 * do Keycloak. Aqui apenas repassamos os parâmetros da requisição para a tela
 * `/mock-idp`, que renderiza o formulário de usuário/senha simulando a
 * página hospedada do IdP.
 */
export async function GET(request: NextRequest) {
  const destino = new URL("/mock-idp", request.url)
  destino.search = request.nextUrl.search
  return NextResponse.redirect(destino)
}
