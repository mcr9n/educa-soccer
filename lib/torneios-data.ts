// Dados de exemplo (mock) de torneios e copas do Educa Soccer.
// Espelha o requisito 8: cadastro de torneios (8.1) e formacao dos times
// dentro de cada torneio (8.2), incluindo a selecao de jogadores com
// filtros, o destaque de alunos fora da faixa etaria do torneio e o aviso
// de aluno ja alocado em outro time do mesmo torneio.
// Em uma versao futura, estes dados virao de um banco de dados.

import { alunos, calcularIdade, formatarData, type Aluno, type Modalidade } from "./alunos-data"
import { getTurma } from "./turmas-data"

export type SituacaoTorneio = "planejamento" | "confirmado" | "em_andamento" | "finalizado"

/** Ordem de exibicao das situacoes do torneio. */
export const situacoesTorneio: SituacaoTorneio[] = ["planejamento", "confirmado", "em_andamento", "finalizado"]

/** Rotulos e cores (estilo tags do jogo) de cada situacao do torneio. */
export const situacaoTorneioInfo: Record<
  SituacaoTorneio,
  { label: string; variant: "green" | "danger" | "gold" | "blue" | "default" }
> = {
  planejamento: { label: "Planejamento", variant: "default" },
  confirmado: { label: "Confirmado", variant: "gold" },
  em_andamento: { label: "Em andamento", variant: "blue" },
  finalizado: { label: "Finalizado", variant: "green" },
}

export type Torneio = {
  id: string
  nome: string
  categoria: string // ex.: "8 a 12 anos" ou "Sub-10"
  dataInicio: string // ISO (YYYY-MM-DD)
  dataTermino: string // ISO (YYYY-MM-DD)
  local: string
  maxJogadoresPorTime: number
  observacoes?: string
  situacao: SituacaoTorneio
}

export type TimeTorneio = {
  id: string
  torneioId: string
  nome: string
  faixaEtaria: string
  treinador: string
  jogadoresIds: string[]
  observacoes?: string
}

export const locaisTorneioSugeridos = [
  "Quadra Sudoeste",
  "Quadra Noroeste",
  "Quadra Asa Norte",
  "Ginásio Guará",
] as const

export const torneios: Torneio[] = [
  {
    id: "trn1",
    nome: "1ª Copa Educa Soccer",
    categoria: "8 a 12 anos",
    dataInicio: "2026-08-22",
    dataTermino: "2026-08-22",
    local: "Quadra Sudoeste",
    maxJogadoresPorTime: 8,
    observacoes:
      "Torneio interno entre as turmas. Times formados por cor de camisa (Amarelo, Azul, Branco e Verde). Premiação com medalhas para todos e troféu para o campeão.",
    situacao: "confirmado",
  },
  {
    id: "trn2",
    nome: "Copa das Férias Sub-10",
    categoria: "Sub-10",
    dataInicio: "2026-12-14",
    dataTermino: "2026-12-15",
    local: "Quadra Noroeste",
    maxJogadoresPorTime: 10,
    observacoes: "",
    situacao: "planejamento",
  },
]

export const timesTorneios: TimeTorneio[] = [
  {
    id: "tm1",
    torneioId: "trn1",
    nome: "Amarelo",
    faixaEtaria: "8 a 12 anos",
    treinador: "Prof. Rafael Duarte",
    jogadoresIds: ["a1", "a4", "a5", "a6", "a7"],
    observacoes: "",
  },
  {
    id: "tm2",
    torneioId: "trn1",
    nome: "Azul",
    faixaEtaria: "8 a 12 anos",
    treinador: "Prof. Diego Nunes",
    jogadoresIds: ["a8", "a9", "a10", "a11"],
    observacoes: "",
  },
  {
    id: "tm3",
    torneioId: "trn1",
    nome: "Branco",
    faixaEtaria: "8 a 12 anos",
    treinador: "Prof. Bruno Antunes",
    jogadoresIds: ["a2", "a3", "a12", "a13", "a14"],
    observacoes: "",
  },
  {
    id: "tm4",
    torneioId: "trn1",
    nome: "Verde",
    faixaEtaria: "8 a 12 anos",
    treinador: "Prof. Rafael Duarte",
    jogadoresIds: ["a15", "a16", "a17", "a18"],
    observacoes: "",
  },
]

/** Intervalo numerico (idade minima/maxima) extraido do texto da categoria. */
export type FaixaTorneio = { min: number | null; max: number | null }

/**
 * Interpreta o campo livre de categoria/faixa etaria do torneio (ex.:
 * "8 a 12 anos", "Sub-10", "10 anos") para permitir o destaque de alunos
 * fora da faixa (req. 8.2).
 */
export function parseFaixaEtaria(categoria: string): FaixaTorneio {
  const numeros = categoria.match(/\d+/g)?.map(Number) ?? []
  if (numeros.length >= 2) {
    return { min: Math.min(numeros[0], numeros[1]), max: Math.max(numeros[0], numeros[1]) }
  }
  if (numeros.length === 1) {
    if (/sub/i.test(categoria)) return { min: null, max: numeros[0] }
    return { min: numeros[0], max: numeros[0] }
  }
  return { min: null, max: null }
}

/** Idade do aluno em anos completos, calculada em relacao a uma data de referencia (ISO). */
export function idadeNaData(dataNascimento: string, dataReferenciaISO: string): number {
  const [ano, mes, dia] = dataReferenciaISO.slice(0, 10).split("-").map(Number)
  return calcularIdade(dataNascimento, new Date(ano, (mes || 1) - 1, dia || 1))
}

/** Verifica se uma idade atende a faixa etaria informada. */
export function atendeFaixaEtaria(idade: number, faixa: FaixaTorneio): boolean {
  if (faixa.min !== null && idade < faixa.min) return false
  if (faixa.max !== null && idade > faixa.max) return false
  return true
}

/** Times cadastrados dentro de um torneio especifico. */
export function timesDoTorneio(times: TimeTorneio[], torneioId: string): TimeTorneio[] {
  return times.filter((t) => t.torneioId === torneioId)
}

/** Dados completos dos alunos que compoem um time. */
export function jogadoresDoTime(time: TimeTorneio): Aluno[] {
  return time.jogadoresIds
    .map((id) => alunos.find((a) => a.id === id))
    .filter((a): a is Aluno => Boolean(a))
}

/** Total de jogadores (somando todos os times) cadastrados em um torneio. */
export function totalJogadoresTorneio(times: TimeTorneio[], torneioId: string): number {
  return timesDoTorneio(times, torneioId).reduce((soma, t) => soma + t.jogadoresIds.length, 0)
}

/**
 * Busca outro time do mesmo torneio em que o aluno ja esteja alocado
 * (req. 8.2: "informar se o aluno ja esta em outro time no mesmo torneio").
 * `excluirTimeId` permite ignorar o proprio time durante a edicao.
 */
export function timeDoAlunoNoTorneio(
  times: TimeTorneio[],
  torneioId: string,
  alunoId: string,
  excluirTimeId?: string,
): TimeTorneio | undefined {
  return times.find(
    (t) => t.torneioId === torneioId && t.id !== excluirTimeId && t.jogadoresIds.includes(alunoId),
  )
}

/** Formata o periodo do torneio no padrao brasileiro, unindo as datas quando ha mais de um dia. */
export function formatarPeriodoTorneio(dataInicio: string, dataTermino: string): string {
  if (dataInicio === dataTermino) return formatarData(dataInicio)
  return `${formatarData(dataInicio)} a ${formatarData(dataTermino)}`
}

/** Proximo id sequencial de torneio com base na lista atual. */
export function proximoIdTorneio(lista: Torneio[]): string {
  const maior = lista.reduce((max, t) => Math.max(max, Number(t.id.replace(/\D/g, "")) || 0), 0)
  return `trn${maior + 1}`
}

/** Proximo id sequencial de time com base na lista atual. */
export function proximoIdTime(lista: TimeTorneio[]): string {
  const maior = lista.reduce((max, t) => Math.max(max, Number(t.id.replace(/\D/g, "")) || 0), 0)
  return `tm${maior + 1}`
}

/** Turma e modalidade do aluno, usadas nos filtros do seletor de jogadores (req. 8.2). */
export function infoTurmaAluno(aluno: Aluno): { turma: string; modalidade: Modalidade } {
  return { turma: aluno.turma, modalidade: getTurma(aluno.turma)?.modalidade ?? aluno.modalidade }
}
