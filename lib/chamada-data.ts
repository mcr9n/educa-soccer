// Dados de exemplo (mock) do controle de frequencia e chamada do Educa Soccer.
// Espelha o requisito 10.1: o professor seleciona a turma, a data da aula e,
// para cada aluno, uma das cinco situacoes abaixo. A chamada e salva por
// turma e data (uma unica ficha por combinacao turma+data).
// Em uma versao futura, estes dados virao de um banco de dados.

import { alunos, type Aluno } from "./alunos-data"
import { turmas, getTurma } from "./turmas-data"

export type StatusChamada = "presente" | "ausente" | "ausencia_justificada" | "aula_cancelada" | "nao_se_aplica"

/** Ordem de exibicao das situacoes nos controles de chamada. */
export const ordemStatusChamada: StatusChamada[] = [
  "presente",
  "ausente",
  "ausencia_justificada",
  "aula_cancelada",
  "nao_se_aplica",
]

/** Rotulos, siglas e cores (estilo tags do jogo) de cada situacao. */
export const statusChamadaInfo: Record<
  StatusChamada,
  { label: string; tag: string; variant: "green" | "danger" | "gold" | "blue" | "default" }
> = {
  presente: { label: "Presente", tag: "P", variant: "green" },
  ausente: { label: "Ausente", tag: "F", variant: "danger" },
  ausencia_justificada: { label: "Falta justificada", tag: "FJ", variant: "gold" },
  aula_cancelada: { label: "Aula cancelada", tag: "AC", variant: "blue" },
  nao_se_aplica: { label: "Não se aplica", tag: "N/A", variant: "default" },
}

/** Pontualidade do aluno na aula, usada no ranking de pontualidade (req. 12.3). */
export type Pontualidade = "no_horario" | "atrasado"

export type PresencaAluno = {
  alunoId: string
  status: StatusChamada
  /** Gols marcados na aula, usado no ranking de artilharia (req. 12.1). So faz sentido quando presente. */
  gols?: number
  /** So faz sentido quando presente; usado no ranking de pontualidade (req. 12.3). */
  pontualidade?: Pontualidade
}

export type Chamada = {
  id: string
  turma: string
  data: string // ISO (YYYY-MM-DD) - data da aula
  presencas: PresencaAluno[]
  registradoPor: string // professor responsavel pela chamada
  registradoEm: string // ISO datetime de quando a chamada foi salva
}

/** Turmas nas quais e possivel fazer chamada (somente as ativas). */
export const turmasParaChamada = turmas.filter((t) => t.situacao === "ativa").map((t) => t.nome)

// Data de referencia usada como padrao ao abrir a tela (mock: dentro do
// periodo com dados gerados no sistema, evitando depender de `new Date()`
// no estado inicial, o que causaria divergencia de hidratacao).
export const dataAtualPadrao = "2026-07-17"

/** Alunos ativos matriculados em uma turma, ordenados por nome. */
export function alunosDaTurma(turma: string): Aluno[] {
  return alunos.filter((a) => a.ativo && a.turma === turma).sort((a, b) => a.nome.localeCompare(b.nome))
}

/** Busca a chamada ja salva de uma turma em uma data especifica. */
export function chamadaExistente(lista: Chamada[], turma: string, data: string): Chamada | undefined {
  return lista.find((c) => c.turma === turma && c.data === data)
}

/** Monta uma ficha de chamada em branco (todos marcados como presentes por padrao). */
export function novaChamadaEmBranco(alunosTurma: Aluno[]): PresencaAluno[] {
  return alunosTurma.map((a) => ({
    alunoId: a.id,
    status: "presente" as StatusChamada,
    gols: 0,
    pontualidade: "no_horario" as Pontualidade,
  }))
}

/** Conta quantos alunos estao em cada situacao. */
export function resumoChamada(presencas: PresencaAluno[]): Record<StatusChamada, number> {
  const resumo: Record<StatusChamada, number> = {
    presente: 0,
    ausente: 0,
    ausencia_justificada: 0,
    aula_cancelada: 0,
    nao_se_aplica: 0,
  }
  for (const p of presencas) resumo[p.status]++
  return resumo
}

/** Aplica a mesma situacao a todos os alunos da ficha (ex.: aula cancelada). */
export function marcarTodosComo(presencas: PresencaAluno[], status: StatusChamada): PresencaAluno[] {
  return presencas.map((p) => ({ ...p, status }))
}

/**
 * Salva (ou atualiza) a chamada de uma turma em uma data. Como a chamada
 * deve ser salva por turma e data (req. 10.1), uma nova gravacao substitui
 * a ficha anterior daquela combinacao em vez de duplicar.
 */
export function registrarChamada(
  lista: Chamada[],
  turma: string,
  data: string,
  presencas: PresencaAluno[],
  registradoPor: string,
): Chamada[] {
  const existente = chamadaExistente(lista, turma, data)
  const registradoEm = new Date().toISOString()
  if (existente) {
    return lista.map((c) => (c.id === existente.id ? { ...c, presencas, registradoPor, registradoEm } : c))
  }
  const id = `ch${lista.length + 1}-${Math.random().toString(36).slice(2, 7)}`
  return [...lista, { id, turma, data, presencas, registradoPor, registradoEm }]
}

/**
 * Formata data ISO (YYYY-MM-DD) no padrao brasileiro (DD/MM/AAAA).
 * Faz o parse manual dos componentes para evitar o deslocamento de fuso
 * horario do `new Date(iso)`, que causa divergencia de hidratacao.
 */
export function formatarDataBR(iso: string): string {
  if (!iso) return "—"
  const [ano, mes, dia] = iso.slice(0, 10).split("-")
  if (!ano || !mes || !dia) return "—"
  return `${dia}/${mes}/${ano}`
}

// Gera algumas fichas de chamada ja registradas, para demonstrar o
// historico por turma e data (req. 10.1).
function gerarChamadasIniciais(): Chamada[] {
  const grupos: { turma: string; datas: string[] }[] = [
    { turma: "SUDOESTE (QUINTA 18H40 E SÁBADO 09H00)", datas: ["2026-07-02", "2026-07-09"] },
    { turma: "SUDOESTE (SÁBADO - 10h40 às 11h40)", datas: ["2026-07-04", "2026-07-11"] },
    // Turma com 3 datas para demonstrar o alerta de faltas consecutivas (req. 10.2).
    { turma: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)", datas: ["2026-07-07", "2026-07-14", "2026-07-21"] },
    { turma: "ASA NORTE (SEGUNDA E QUARTA - 18h00 às 19h00)", datas: ["2026-07-06", "2026-07-13"] },
    { turma: "NOROESTE (TERÇA E QUINTA - 18h00 às 19h00)", datas: ["2026-07-02", "2026-07-09"] },
    { turma: "ASA NORTE (SEGUNDA E QUARTA - 19h00 às 20h00)", datas: ["2026-07-06", "2026-07-13"] },
  ]

  // Distribuicao deterministica de situacoes (predominancia de presenca,
  // com faltas e justificativas ocasionais), no mesmo espirito do mock de
  // pagamentos.
  const pool: StatusChamada[] = ["presente", "presente", "presente", "ausente", "ausencia_justificada"]

  // O primeiro aluno (por ordem alfabetica) da turma com 3 datas fica com
  // ausencia em todas elas, para que a tela de Alertas de Faltas exiba um
  // exemplo real de faltas consecutivas.
  const alunoDemonstracaoFaltas = { turma: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)", indice: 0 }

  const lista: Chamada[] = []
  let seq = 0
  for (const grupo of grupos) {
    const alunosTurma = alunosDaTurma(grupo.turma)
    if (alunosTurma.length === 0) continue
    const professor = getTurma(grupo.turma)?.professor ?? "Coordenação"
    grupo.datas.forEach((data, di) => {
      seq++
      const presencas: PresencaAluno[] = alunosTurma.map((aluno, ai) => {
        if (grupo.turma === alunoDemonstracaoFaltas.turma && ai === alunoDemonstracaoFaltas.indice) {
          return { alunoId: aluno.id, status: "ausente" as StatusChamada }
        }
        const status = pool[(ai + di) % pool.length]
        if (status !== "presente") return { alunoId: aluno.id, status }
        // Distribuicao deterministica de gols e pontualidade para os presentes,
        // usada para demonstrar os rankings de artilharia e pontualidade (req. 12).
        const gols = (ai + di) % 4 === 0 ? 2 : (ai + di) % 3 === 0 ? 1 : 0
        const pontualidade: Pontualidade = (ai + di) % 5 === 0 ? "atrasado" : "no_horario"
        return { alunoId: aluno.id, status, gols, pontualidade }
      })
      lista.push({
        id: `ch${seq}`,
        turma: grupo.turma,
        data,
        presencas,
        registradoPor: professor,
        registradoEm: `${data}T20:00:00.000Z`,
      })
    })
  }
  return lista
}

export const chamadasIniciais: Chamada[] = gerarChamadasIniciais()
