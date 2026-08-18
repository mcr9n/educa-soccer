// Dados de exemplo (mock) do controle de Notas / Aluno Destaque do Educa Soccer.
// Espelha o requisito 14: cada aula avalia o aluno em 5 criterios diarios
// (Presenca e Pontualidade vindas automaticamente da Chamada, mais
// Comportamento, Participacao e Uniforme lancados aqui) e cada mes registra
// 4 lancamentos pontuais por aluno (Teste, Evento, Boletim, Amigo
// matriculado), exatamente como na planilha "ALUNOS DESTAQUES" usada hoje.
// Em uma versao futura, estes dados virao de um banco de dados.

import { alunos, type Aluno } from "./alunos-data"
import { turmasDisponiveis } from "./turmas-data"
import { chamadasIniciais, type Chamada, type PresencaAluno } from "./chamada-data"

/** Criterios lancados manualmente por aula (0 a 5 pontos cada). */
export type CriterioDiario = "comportamento" | "participacao" | "uniforme"

export const ordemCriteriosDiarios: CriterioDiario[] = ["comportamento", "participacao", "uniforme"]

export const criterioDiarioInfo: Record<CriterioDiario, { label: string; abrev: string }> = {
  comportamento: { label: "Comportamento", abrev: "COMP" },
  participacao: { label: "Participação", abrev: "PART" },
  uniforme: { label: "Uniforme", abrev: "UNIF" },
}

export const pontuacaoMaximaDiaria = 5

/** Lancamentos diarios de um aluno numa aula (Comportamento/Participacao/Uniforme). */
export type NotaDiaria = {
  id: string
  turma: string
  data: string // ISO (YYYY-MM-DD) - mesma data da chamada da aula
  alunoId: string
  comportamento: number // 0 a 5
  participacao: number // 0 a 5
  uniforme: number // 0 a 5
}

/** Criterios lancados uma vez por mes por aluno (pontuais, nao por aula). */
export type CriterioMensal = "testes" | "eventos" | "boletim" | "amigoMatriculado"

export const ordemCriteriosMensais: CriterioMensal[] = ["testes", "eventos", "boletim", "amigoMatriculado"]

export const criterioMensalInfo: Record<
  CriterioMensal,
  { label: string; abrev: string; pontuacaoMaxima: number; descricao: string }
> = {
  testes: { label: "Testes", abrev: "TESTE", pontuacaoMaxima: 5, descricao: "Desempenho nos testes técnicos do mês" },
  eventos: { label: "Eventos", abrev: "EVENTO", pontuacaoMaxima: 5, descricao: "Participação em eventos da escolinha" },
  boletim: { label: "Boletim", abrev: "BOLETIM", pontuacaoMaxima: 5, descricao: "Desempenho escolar apresentado" },
  amigoMatriculado: {
    label: "Amigo matriculado",
    abrev: "AMIGO",
    pontuacaoMaxima: 5,
    descricao: "Indicou um amigo que se matriculou na escolinha",
  },
}

/** Lancamento mensal (pontual) de um aluno: no maximo um valor por criterio por mes. */
export type NotaMensal = {
  id: string
  alunoId: string
  mes: string // ISO (YYYY-MM) - mes de referencia do lancamento
  testes?: number
  eventos?: number
  boletim?: number
  amigoMatriculado?: number
}

/** Meses do ano letivo (fevereiro a novembro), como na aba "DESTAQUE DO ANO" da planilha. */
export const mesesDoAnoLetivo = [
  "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
] as const

export const nomeMesAbrev: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr", "05": "Mai", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
}

export function mesReferencia(ano: number, mes: string): string {
  return `${ano}-${mes}`
}

/** Turmas nas quais e possivel lancar notas (mesmo criterio da chamada: somente ativas). */
export const turmasParaNotas = turmasDisponiveis

/** Alunos ativos de uma turma, ordenados por nome (mesmo padrao da chamada). */
export function alunosDaTurmaNotas(turma: string): Aluno[] {
  return alunos.filter((a) => a.ativo && a.turma === turma).sort((a, b) => a.nome.localeCompare(b.nome))
}

// ---------------------------------------------------------------------------
// Conversao Presenca/Pontualidade a partir da Chamada (evita preenchimento
// duplicado - req. 14: "a nota de Presenca e Pontualidade deve ser
// preenchida automaticamente com base na chamada já registrada").
// ---------------------------------------------------------------------------

export const pontuacaoPresenca = 5
export const pontuacaoPontualidade = 2

/** Se a situacao da chamada gera avaliacao de presenca/pontualidade naquele dia. */
export function statusGeraAvaliacao(status: PresencaAluno["status"]): boolean {
  return status !== "aula_cancelada" && status !== "nao_se_aplica"
}

/** Pontos de presenca (0 ou 5) derivados da situacao da chamada. */
export function pontosPresenca(presenca: PresencaAluno | undefined): number {
  if (!presenca || !statusGeraAvaliacao(presenca.status)) return 0
  return presenca.status === "presente" ? pontuacaoPresenca : 0
}

/** Pontos de pontualidade (0 ou 2) derivados da chamada: so faz sentido se presente. */
export function pontosPontualidade(presenca: PresencaAluno | undefined): number {
  if (!presenca || presenca.status !== "presente") return 0
  return presenca.pontualidade === "no_horario" ? pontuacaoPontualidade : 0
}

/** Busca a presenca de um aluno numa chamada de turma+data especifica. */
export function presencaDoAluno(
  chamadas: Chamada[],
  turma: string,
  data: string,
  alunoId: string,
): PresencaAluno | undefined {
  const chamada = chamadas.find((c) => c.turma === turma && c.data === data)
  return chamada?.presencas.find((p) => p.alunoId === alunoId)
}

// ---------------------------------------------------------------------------
// Lancamentos diarios (Comportamento/Participacao/Uniforme)
// ---------------------------------------------------------------------------

export function notaDiariaExistente(
  lista: NotaDiaria[],
  turma: string,
  data: string,
  alunoId: string,
): NotaDiaria | undefined {
  return lista.find((n) => n.turma === turma && n.data === data && n.alunoId === alunoId)
}

/** Salva (ou atualiza) o lancamento diario de um aluno numa aula. */
export function registrarNotaDiaria(
  lista: NotaDiaria[],
  turma: string,
  data: string,
  alunoId: string,
  valores: Partial<Pick<NotaDiaria, "comportamento" | "participacao" | "uniforme">>,
): NotaDiaria[] {
  const existente = notaDiariaExistente(lista, turma, data, alunoId)
  if (existente) {
    return lista.map((n) => (n.id === existente.id ? { ...n, ...valores } : n))
  }
  const id = `nd${lista.length + 1}-${Math.random().toString(36).slice(2, 7)}`
  return [
    ...lista,
    {
      id,
      turma,
      data,
      alunoId,
      comportamento: valores.comportamento ?? 0,
      participacao: valores.participacao ?? 0,
      uniforme: valores.uniforme ?? 0,
    },
  ]
}

/** Total de pontos diarios (todos os 5 criterios) de um aluno numa aula especifica. */
export function totalNotaDiaria(
  notasDiarias: NotaDiaria[],
  chamadas: Chamada[],
  turma: string,
  data: string,
  alunoId: string,
): number {
  const presenca = presencaDoAluno(chamadas, turma, data, alunoId)
  const diaria = notaDiariaExistente(notasDiarias, turma, data, alunoId)
  return (
    pontosPresenca(presenca) +
    pontosPontualidade(presenca) +
    (diaria?.comportamento ?? 0) +
    (diaria?.participacao ?? 0) +
    (diaria?.uniforme ?? 0)
  )
}

// ---------------------------------------------------------------------------
// Lancamentos mensais (Testes/Eventos/Boletim/Amigo matriculado)
// ---------------------------------------------------------------------------

export function notaMensalExistente(lista: NotaMensal[], alunoId: string, mes: string): NotaMensal | undefined {
  return lista.find((n) => n.alunoId === alunoId && n.mes === mes)
}

/** Salva (ou atualiza) os lancamentos pontuais de um aluno num mes. */
export function registrarNotaMensal(
  lista: NotaMensal[],
  alunoId: string,
  mes: string,
  valores: Partial<Pick<NotaMensal, "testes" | "eventos" | "boletim" | "amigoMatriculado">>,
): NotaMensal[] {
  const existente = notaMensalExistente(lista, alunoId, mes)
  if (existente) {
    return lista.map((n) => (n.id === existente.id ? { ...n, ...valores } : n))
  }
  const id = `nm${lista.length + 1}-${Math.random().toString(36).slice(2, 7)}`
  return [...lista, { id, alunoId, mes, ...valores }]
}

/** Total de pontos mensais (pontuais) de um aluno num mes. */
export function totalNotaMensal(notasMensais: NotaMensal[], alunoId: string, mes: string): number {
  const lancamento = notaMensalExistente(notasMensais, alunoId, mes)
  if (!lancamento) return 0
  return (
    (lancamento.testes ?? 0) +
    (lancamento.eventos ?? 0) +
    (lancamento.boletim ?? 0) +
    (lancamento.amigoMatriculado ?? 0)
  )
}

// ---------------------------------------------------------------------------
// Total anual e ranking de Aluno Destaque (req. 14.4)
// ---------------------------------------------------------------------------

export type PontuacaoAnualAluno = {
  aluno: Aluno
  totalDiario: number
  totalMensal: number
  totalGeral: number
  aulasAvaliadas: number
}

/**
 * Calcula a pontuacao total (diaria + mensal) de todos os alunos de uma turma
 * em um ano, para a classificacao de Aluno Destaque.
 */
export function calcularPontuacaoAnual(
  alunosTurma: Aluno[],
  chamadas: Chamada[],
  notasDiarias: NotaDiaria[],
  notasMensais: NotaMensal[],
  turma: string,
  ano: number,
): PontuacaoAnualAluno[] {
  const chamadasDoAno = chamadas.filter((c) => c.turma === turma && c.data.startsWith(String(ano)))

  return alunosTurma.map((aluno) => {
    let totalDiario = 0
    let aulasAvaliadas = 0
    for (const chamada of chamadasDoAno) {
      const presenca = chamada.presencas.find((p) => p.alunoId === aluno.id)
      if (!presenca || !statusGeraAvaliacao(presenca.status)) continue
      aulasAvaliadas++
      totalDiario += totalNotaDiaria(notasDiarias, chamadas, turma, chamada.data, aluno.id)
    }

    let totalMensal = 0
    for (const mes of mesesDoAnoLetivo) {
      totalMensal += totalNotaMensal(notasMensais, aluno.id, mesReferencia(ano, mes))
    }

    return { aluno, totalDiario, totalMensal, totalGeral: totalDiario + totalMensal, aulasAvaliadas }
  })
}

export type PosicaoRanking = PontuacaoAnualAluno & { posicao: number; empatado: boolean }

/**
 * Ordena os alunos por pontuacao total (desc) e atribui a posicao no
 * ranking. Em caso de empate, os alunos ficam na mesma posicao (o
 * requisito deixa o criterio de desempate a cargo do responsavel pela
 * escolinha), com um sinalizador visual (`empatado`) para decisao manual.
 */
export function classificarAlunoDestaque(pontuacoes: PontuacaoAnualAluno[]): PosicaoRanking[] {
  const ordenado = [...pontuacoes].sort((a, b) => b.totalGeral - a.totalGeral)
  let posicaoAtual = 0
  let pontuacaoAnterior: number | null = null
  const contagemPorPontuacao = new Map<number, number>()
  for (const p of ordenado) {
    contagemPorPontuacao.set(p.totalGeral, (contagemPorPontuacao.get(p.totalGeral) ?? 0) + 1)
  }
  return ordenado.map((p) => {
    if (pontuacaoAnterior === null || p.totalGeral !== pontuacaoAnterior) {
      posicaoAtual++
      pontuacaoAnterior = p.totalGeral
    }
    return { ...p, posicao: posicaoAtual, empatado: (contagemPorPontuacao.get(p.totalGeral) ?? 0) > 1 }
  })
}

/**
 * Formata mes de referencia ISO (YYYY-MM) como "Mês/AAAA", ex.: "Julho/2026".
 */
const nomeMesCompleto: Record<string, string> = {
  "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril", "05": "Maio", "06": "Junho",
  "07": "Julho", "08": "Agosto", "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
}

export function formatarMesReferencia(mes: string): string {
  const [ano, m] = mes.split("-")
  return `${nomeMesCompleto[m] ?? m}/${ano}`
}

// ---------------------------------------------------------------------------
// Dados iniciais (mock) - gera alguns lancamentos para as turmas/datas que
// ja possuem chamada registrada, para demonstrar o calculo do aluno
// destaque sem exigir preenchimento manual previo.
// ---------------------------------------------------------------------------

function gerarNotasDiariasIniciais(): NotaDiaria[] {
  const lista: NotaDiaria[] = []
  let seq = 0
  for (const chamada of chamadasIniciais) {
    for (const presenca of chamada.presencas) {
      if (!statusGeraAvaliacao(presenca.status)) continue
      seq++
      // Distribuicao deterministica de notas (predominancia de nota maxima,
      // com pequenas variacoes), no mesmo espirito dos demais mocks.
      const base = seq % 5
      lista.push({
        id: `nd${seq}`,
        turma: chamada.turma,
        data: chamada.data,
        alunoId: presenca.alunoId,
        comportamento: base === 0 ? 4 : 5,
        participacao: base === 1 ? 3 : 5,
        uniforme: base === 2 ? 4 : 5,
      })
    }
  }
  return lista
}

function gerarNotasMensaisIniciais(): NotaMensal[] {
  const lista: NotaMensal[] = []
  let seq = 0
  alunos
    .filter((a) => a.ativo)
    .forEach((aluno, ai) => {
      seq++
      lista.push({
        id: `nm${seq}`,
        alunoId: aluno.id,
        mes: "2026-07",
        testes: ai % 3 === 0 ? 5 : 0,
        eventos: ai % 4 === 0 ? 5 : 0,
        boletim: ai % 2 === 0 ? 5 : 3,
        amigoMatriculado: ai % 6 === 0 ? 5 : 0,
      })
    })
  return lista
}

export const notasDiariasIniciais: NotaDiaria[] = gerarNotasDiariasIniciais()
export const notasMensaisIniciais: NotaMensal[] = gerarNotasMensaisIniciais()
