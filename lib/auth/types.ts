/**
 * Tipos do domínio de autenticação.
 *
 * A resposta do IdP (Keycloak) está mockada por enquanto (ver `mock-idp.ts`),
 * mas os tipos e o fluxo (Authorization Code + PKCE, troca de code por
 * tokens, sessão em cookie assinado) já seguem o formato real do OpenID
 * Connect para facilitar a troca do mock pelo Keycloak de verdade depois.
 */

/** Papéis de usuário previstos no levantamento de requisitos do sistema. */
export type PapelUsuario = "ADMIN" | "COORDENADOR" | "PROFESSOR"

/** Dados do usuário autenticado, extraídos das claims do ID Token / userinfo. */
export type UsuarioSessao = {
  /** `sub` — identificador único e estável do usuário no IdP. */
  id: string
  nome: string
  email: string
  papeis: PapelUsuario[]
}

/** Conteúdo assinado guardado no cookie de sessão. */
export type SessaoPayload = {
  usuario: UsuarioSessao
  /** Timestamp (epoch, segundos) de expiração da sessão local. */
  exp: number
}

/** Resposta do endpoint de token no formato padrão do OAuth2/OIDC. */
export type TokenResponse = {
  access_token: string
  id_token: string
  refresh_token?: string
  token_type: "Bearer"
  expires_in: number
}
