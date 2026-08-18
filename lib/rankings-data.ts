// Calculo dos rankings do Educa Soccer (req. 12).
// O sistema gera rankings exclusivamente para as turmas coletivas (req. 12),
// separados por turma e por periodo (semana, mes, semestre, ano ou personalizado).
// Os dados de origem sao as fichas de chamada, que ja registram gols (req. 12.1)
// e pontualidade (req. 12.3) por aluno e por aula.

import type { Aluno } from "./alunos-data"
import { turmas } from "./turmas-data"
import { alunosDaTurma, type Chamada } from "./chamada-data"

export type TipoRanking = "artilharia" | "frequencia" | "pontualidade"
export type PeriodoTipo = "semana" | "mes" | "semestre" | "ano" | "personalizado"

export const tiposRanking: { tipo: TipoRanking; label: string; unidade: string }[] = [
  { tipo: "artilharia", label: "Artilharia", unidade: "gols" },
  { tipo: "frequencia", label: "Frequência", unidade: "% de presença" },
  { tipo: "pontualidade", label: "Pontualidade", unidade: "% de pontualidade" },
]

export const periodosDisponiveis: { tipo: PeriodoTipo; label: string }[] = [
  { tipo: "semana", label: "Semana" },
  { tipo: "mes", label: "Mês" },
  { tipo: "semestre", label: "Semestre" },
  { tipo: "ano", label: "Ano" },
  { tipo: "personalizado", label: "Personalizado" },
]

/** Turmas nas quais e possivel gerar ranking: somente as coletivas ativas (req. 12). */
export const turmasParaRanking = turmas.filter((t) => t.modalidade === "coletiva" && t.situacao === "ativa").map((t) => t.nome)

function parseISO(iso: string): { ano: number; mes: number; dia: number } {
  const [ano, mes, dia] = iso.slice(0, 10).split("-").map(Number)
  return { ano, mes, dia }
}

function toUTCDate(iso: string): Date {
  const { ano, mes, dia } = parseISO(iso)
  return new Date(Date.UTC(ano, mes - 1, dia))
}

function toISO(date: Date): string {
  const ano = date.getUTCFullYear()
  const mes = String(date.getUTCMonth() + 1).padStart(2, "0")
  const dia = String(date.getUTCDate()).padStart(2, "0")
  return `${ano}-${mes}-${dia}`
}

/** Segunda-feira da semana que contem a data de referencia. */
function inicioDaSemana(iso: string): string {
  const d = toUTCDate(iso)
  const diaSemana = d.getUTCDay() // 0 = domingo
  const deslocamento = diaSemana === 0 ? 6 : diaSemana - 1
  d.setUTCDate(d.getUTCDate() - deslocamento)
  return toISO(d)
}

/**
 * Calcula o intervalo (inicio/fim, ambos inclusivos) de um periodo de ranking
 * a partir de uma data de referencia (req. 12.4).
 */
export function calcularIntervaloPeriodo(
  tipo: PeriodoTipo,
  referencia: string,
  personalizado?: { inicio: string; fim: string },
): { inicio: string; fim: string } {
  if (tipo === "personalizado") {
    if (personalizado && personalizado.inicio && personalizado.fim) return personalizado
    return { inicio: referencia, fim: referencia }
  }

  const { ano, mes } = parseISO(referencia)

  if (tipo === "semana") {
    const inicio = inicioDaSemana(referencia)
    const fim = toUTCDate(inicio)
    fim.setUTCDate(fim.getUTCDate() + 6)
    return { inicio, fim: toISO(fim) }
  }

  if (tipo === "mes") {
    const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`
    const fim = toISO(new Date(Date.UTC(ano, mes, 0)))
    return { inicio, fim }
  }

  if (tipo === "semestre") {
    const inicioMes = mes <= 6 ? 1 : 7
    const fimMes = mes <= 6 ? 6 : 12
    const inicio = `${ano}-${String(inicioMes).padStart(2, "0")}-01`
    const fim = toISO(new Date(Date.UTC(ano, fimMes, 0)))
    return { inicio, fim }
  }

  // ano
  return { inicio: `${ano}-01-01`, fim: `${ano}-12-31` }
}

export type ItemRanking = {
  aluno: Aluno
  posicao: number
  pontuacao: number
  pontuacaoLabel: string
  detalhe: string
  temDados: boolean
}

/**
 * Gera o ranking de uma turma coletiva em um tipo e periodo, deixando claro
 * quais dados foram usados no calculo de cada aluno (req. 12, ultimo paragrafo).
 *
 * Regra adotada para faltas justificadas (req. 12.2): sao desconsideradas do
 * calculo, tanto na frequencia quanto na pontualidade (nao somam pontos e nao
 * entram no total de aulas consideradas). Aulas canceladas tambem sao
 * desconsideradas, pois nao houve aula de fato.
 *
 * Regra adotada para pontualidade (req. 12.3): chegou no horario = 1 ponto,
 * chegou atrasado = 0 ponto, falta nao justificada = 0 ponto, falta
 * justificada = nao contabiliza. O placar exibido e a media de pontos por
 * aula considerada, em percentual.
 */
export function calcularRanking(
  chamadas: Chamada[],
  turma: string,
  tipo: TipoRanking,
  intervalo: { inicio: string; fim: string },
): ItemRanking[] {
  const chamadasPeriodo = chamadas.filter(
    (c) => c.turma === turma && c.data >= intervalo.inicio && c.data <= intervalo.fim,
  )

  const linhas = alunosDaTurma(turma).map((aluno) => {
    let gols = 0
    let presentes = 0
    let ausentes = 0
    let pontosPontualidade = 0
    let aulasPontualidade = 0

    for (const chamada of chamadasPeriodo) {
      const presenca = chamada.presencas.find((p) => p.alunoId === aluno.id)
      if (!presenca) continue
      if (presenca.status === "aula_cancelada" || presenca.status === "nao_se_aplica") continue
      if (presenca.status === "ausencia_justificada") continue // req. 12.2: desconsiderada

      if (presenca.status === "presente") {
        presentes++
        gols += presenca.gols ?? 0
        aulasPontualidade++
        pontosPontualidade += presenca.pontualidade === "atrasado" ? 0 : 1
      } else if (presenca.status === "ausente") {
        ausentes++
        aulasPontualidade++ // falta nao justificada conta como 0 ponto (req. 12.3)
      }
    }

    const totalFrequencia = presentes + ausentes
    const percentualFrequencia = totalFrequencia > 0 ? (presentes / totalFrequencia) * 100 : 0
    const percentualPontualidade = aulasPontualidade > 0 ? (pontosPontualidade / aulasPontualidade) * 100 : 0

    if (tipo === "artilharia") {
      return {
        aluno,
        pontuacao: gols,
        pontuacaoLabel: `${gols} ${gols === 1 ? "gol" : "gols"}`,
        detalhe: `${gols} ${gols === 1 ? "gol" : "gols"} registrado(s) em ${presentes} aula(s) com presença`,
        temDados: presentes > 0,
      }
    }

    if (tipo === "frequencia") {
      return {
        aluno,
        pontuacao: percentualFrequencia,
        pontuacaoLabel: totalFrequencia > 0 ? `${percentualFrequencia.toFixed(0)}%` : "—",
        detalhe:
          totalFrequencia > 0
            ? `${presentes} presença(s) de ${totalFrequencia} aula(s) válida(s) (faltas justificadas e aulas canceladas desconsideradas)`
            : "Nenhuma aula computada no período",
        temDados: totalFrequencia > 0,
      }
    }

    return {
      aluno,
      pontuacao: percentualPontualidade,
      pontuacaoLabel: aulasPontualidade > 0 ? `${percentualPontualidade.toFixed(0)}%` : "—",
      detalhe:
        aulasPontualidade > 0
          ? `${pontosPontualidade} ponto(s) em ${aulasPontualidade} aula(s) válida(s) (1 pt no horário, 0 pt atrasado ou falta, justificadas desconsideradas)`
          : "Nenhuma aula computada no período",
      temDados: aulasPontualidade > 0,
    }
  })

  return [...linhas]
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .map((l, i) => ({ ...l, posicao: i + 1 }))
}

/** Turmas coletivas que possuem pelo menos uma chamada registrada (evita listas vazias no ranking). */
export function turmasComChamadas(chamadas: Chamada[]): string[] {
  const comDados = new Set(chamadas.map((c) => c.turma))
  return turmasParaRanking.filter((t) => comDados.has(t))
}
