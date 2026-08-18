import "server-only"

import { authConfig, USANDO_IDP_MOCK } from "./config"
import { gerarCodeChallenge, gerarStringAleatoria } from "./pkce"
import { consumirAuthorizationCode, gerarTokenResponseMock, validarCredenciaisMock } from "./mock-idp"
import type { TokenResponse, UsuarioSessao } from "./types"

/**
 * Integração com o Keycloak via Authorization Code + PKCE.
 *
 * A resposta do IdP está mockada (`USANDO_IDP_MOCK`): em vez de montar a URL
 * do endpoint `/auth` real do Keycloak e trocar o `code` no endpoint
 * `/token` real, o fluxo abaixo usa as rotas locais em
 * `app/api/auth/mock-idp/*`. A assinatura das funções já é a do fluxo real
 * para que, ao conectar o Keycloak, baste remover o branch `USANDO_IDP_MOCK`.
 */

export type ParametrosAutorizacao = {
  state: string
  codeVerifier: string
  codeChallenge: string
  urlAutorizacao: string
}

/** Monta os parâmetros PKCE e a URL de autorização (real ou mock) para iniciar o login. */
export function iniciarAutorizacao(returnTo: string): ParametrosAutorizacao {
  const state = gerarStringAleatoria(16)
  const codeVerifier = gerarStringAleatoria(32)
  const codeChallenge = gerarCodeChallenge(codeVerifier)

  const params = new URLSearchParams({
    client_id: authConfig.clientId,
    response_type: "code",
    scope: "openid profile email",
    // Caminho relativo: o navegador resolve contra a origem atual. Quando o
    // Keycloak real for conectado, passa a ser a URL absoluta do app.
    redirect_uri: "/api/auth/callback",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })
  if (returnTo) params.set("return_to", returnTo)

  return {
    state,
    codeVerifier,
    codeChallenge,
    urlAutorizacao: `${authConfig.authorizeUrl}?${params.toString()}`,
  }
}

/**
 * Troca o `code` recebido no callback por tokens.
 *
 * Mockado: consome o code emitido por `mock-idp.ts` (sem chamada de rede) e
 * gera uma resposta no formato padrão do token endpoint. Quando o Keycloak
 * real estiver conectado, este trecho faz um POST para `authConfig.tokenUrl`
 * com `code`, `code_verifier` e `redirect_uri`.
 */
export async function trocarCodePorTokens(
  code: string,
): Promise<{ tokens: TokenResponse; usuario: UsuarioSessao } | null> {
  if (USANDO_IDP_MOCK) {
    const usuario = consumirAuthorizationCode(code)
    if (!usuario) return null
    return { tokens: gerarTokenResponseMock(usuario), usuario }
  }

  // Fluxo real (Keycloak): POST para authConfig.tokenUrl com grant_type=authorization_code.
  throw new Error("Integração real com Keycloak ainda não configurada.")
}

/** Valida usuário/senha na tela mockada de login do IdP. */
export function autenticarNoIdpMock(username: string, senha: string): UsuarioSessao | null {
  return validarCredenciaisMock(username, senha)
}
