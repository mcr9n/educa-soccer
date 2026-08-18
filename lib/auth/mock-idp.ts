import type { PapelUsuario, TokenResponse, UsuarioSessao } from "./types"

/**
 * Simulação do provedor de identidade (Keycloak) para desenvolvimento.
 *
 * IMPORTANTE: isso NÃO é autenticação real. As credenciais abaixo existem
 * apenas para simular a base de usuários de um realm do Keycloak enquanto o
 * IdP real não está conectado. Quando o Keycloak estiver configurado, este
 * arquivo é removido e o fluxo em `lib/auth/keycloak.ts` passa a redirecionar
 * para o Keycloak de verdade e trocar o `code` pelos tokens reais.
 */

type UsuarioMock = {
  username: string
  senha: string
  usuario: UsuarioSessao
}

const usuariosMock: UsuarioMock[] = [
  {
    username: "coordenacao",
    senha: "Educa@123",
    usuario: {
      id: "mock-user-coordenacao",
      nome: "Coordenação EducaSoccer",
      email: "coordenacao@educasoccer.com.br",
      papeis: ["ADMIN", "COORDENADOR"] as PapelUsuario[],
    },
  },
  {
    username: "professor",
    senha: "Educa@123",
    usuario: {
      id: "mock-user-professor",
      nome: "Professor EducaSoccer",
      email: "professor@educasoccer.com.br",
      papeis: ["PROFESSOR"] as PapelUsuario[],
    },
  },
]

/** Valida usuário/senha contra a base mockada. Retorna o usuário ou `null` se inválido. */
export function validarCredenciaisMock(username: string, senha: string): UsuarioSessao | null {
  const encontrado = usuariosMock.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.senha === senha,
  )
  return encontrado ? encontrado.usuario : null
}

/**
 * Registro em memória de "codes" de autorização emitidos pelo mock, à espera
 * de troca por tokens no endpoint de callback (equivalente ao token endpoint
 * do Keycloak). Cada code é de uso único e expira rapidamente, como no fluxo
 * real do Authorization Code.
 *
 * Observação: por ser em memória do processo, isso é adequado apenas para o
 * ambiente de desenvolvimento/mock atual (single instance).
 */
const codesEmitidos = new Map<string, { usuario: UsuarioSessao; expiraEm: number }>()

const DURACAO_CODE_MS = 60_000

export function emitirAuthorizationCode(usuario: UsuarioSessao): string {
  const code = crypto.randomUUID()
  codesEmitidos.set(code, { usuario, expiraEm: Date.now() + DURACAO_CODE_MS })
  return code
}

/** Consome um authorization code (uso único), retornando o usuário associado ou `null`. */
export function consumirAuthorizationCode(code: string): UsuarioSessao | null {
  const registro = codesEmitidos.get(code)
  codesEmitidos.delete(code)
  if (!registro || registro.expiraEm < Date.now()) return null
  return registro.usuario
}

/** Simula a resposta do endpoint `/token` do Keycloak para o code recebido. */
export function gerarTokenResponseMock(usuario: UsuarioSessao): TokenResponse {
  // Tokens opacos de simulação — nunca são decodificados como JWT real,
  // servem apenas para preencher o formato da resposta do IdP.
  const payloadFicticio = Buffer.from(JSON.stringify({ sub: usuario.id, mock: true })).toString("base64url")
  return {
    access_token: `mock.${payloadFicticio}.access`,
    id_token: `mock.${payloadFicticio}.id`,
    refresh_token: `mock.${payloadFicticio}.refresh`,
    token_type: "Bearer",
    expires_in: 3600,
  }
}
