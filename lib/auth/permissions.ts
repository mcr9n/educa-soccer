import type { PapelUsuario } from "./types"

/**
 * Todas as rotas privadas do sistema, só para referência/documentação — a
 * proteção em si (`proxy.ts`) exige sessão em qualquer rota que não esteja
 * em `rotasPublicas`, então novas telas privadas não precisam ser
 * adicionadas aqui para ficarem protegidas.
 */
export const rotasPrivadas = [
  "/",
  "/alunos",
  "/cadastro",
  "/turmas",
  "/cadastro-turma",
  "/chamada",
  "/notas",
  "/pagamentos",
  "/uniformes",
  "/album",
  "/torneios",
  "/rankings",
  "/alertas-faltas",
  "/aulas-experimentais",
  "/ex-alunos",
] as const

/** Rotas acessíveis sem sessão (login e fluxo de autenticação). */
export const rotasPublicas = ["/login", "/mock-idp", "/403"] as const

export function rotaEhPublica(pathname: string): boolean {
  return rotasPublicas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`))
}

/**
 * Permissões por rota. Por padrão, qualquer usuário autenticado acessa
 * qualquer rota privada — os papéis abaixo restringem apenas as telas
 * sensíveis identificadas no levantamento de requisitos (financeiro e
 * gestão de turmas/uniformes ficam a critério da coordenação).
 */
const permissoesPorRota: Record<string, PapelUsuario[] | undefined> = {
  "/pagamentos": ["ADMIN", "COORDENADOR"],
}

/** Verifica se os papéis do usuário permitem acessar a rota informada. */
export function usuarioPodeAcessarRota(pathname: string, papeis: PapelUsuario[]): boolean {
  const papeisExigidos = Object.entries(permissoesPorRota).find(
    ([rota]) => pathname === rota || pathname.startsWith(`${rota}/`),
  )?.[1]

  if (!papeisExigidos) return true
  return papeisExigidos.some((papel) => papeis.includes(papel))
}
