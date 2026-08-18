/**
 * Configuração do provedor de identidade (Keycloak).
 *
 * As variáveis `KEYCLOAK_URL`, `KEYCLOAK_REALM` e `KEYCLOAK_CLIENT_ID` já
 * estão disponíveis no projeto e são lidas aqui normalmente — são só o
 * endereço do realm real, não segredos. O que está mockado é a resposta do
 * IdP: em vez de redirecionar para o Keycloak de verdade, o fluxo abaixo
 * redireciona para `/mock-idp`, uma tela local que simula a página de login
 * hospedada do Keycloak. Quando o Keycloak real estiver disponível, basta
 * trocar `authorizeUrl`/`tokenUrl` para os endpoints reais do realm —
 * o restante do fluxo (PKCE, callback, sessão) não muda.
 */

const KEYCLOAK_URL = process.env.KEYCLOAK_URL ?? ""
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? "educa-soccer"
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID ?? "educa-soccer-app"

/** Ativa o IdP mockado. Sempre `true` por enquanto — não há Keycloak real conectado ainda. */
export const USANDO_IDP_MOCK = true

export const authConfig = {
  clientId: KEYCLOAK_CLIENT_ID,
  realm: KEYCLOAK_REALM,
  issuer: KEYCLOAK_URL ? `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}` : "mock://educa-soccer-idp",
  /** Endpoint que inicia o login. Mockado: aponta para nossa própria tela `/mock-idp`. */
  authorizeUrl: USANDO_IDP_MOCK ? "/api/auth/mock-idp/authorize" : `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`,
  /** Endpoint de troca do `code` por tokens. Mockado: gerado localmente em `mock-idp.ts`. */
  tokenUrl: USANDO_IDP_MOCK ? null : `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
  logoutUrl: USANDO_IDP_MOCK ? null : `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`,
  /** Duração da sessão local (cookie assinado), em segundos. */
  duracaoSessaoSegundos: 60 * 60 * 8, // 8 horas
} as const

export const COOKIE_SESSAO = "educa_soccer_session"
export const COOKIE_PKCE_STATE = "educa_soccer_auth_state"
