// Dados de exemplo (mock) da gestao de ex-alunos do Educa Soccer (requisito 7).
// Quando um aluno deixa a escolinha, o cadastro NAO e excluido: ele e movido
// para a area de ex-alunos, preservando todo o historico. Em uma versao futura
// estes dados virao de um banco de dados.

import { modalidadeDaTurma, type Modalidade } from "./turmas-data"

export type MotivoSaida =
  | "Mudança de cidade"
  | "Questões financeiras"
  | "Falta de tempo / agenda"
  | "Mudança de esporte"
  | "Insatisfação"
  | "Conclusão do ciclo"
  | "Outro"

export const motivosSaida: MotivoSaida[] = [
  "Mudança de cidade",
  "Questões financeiras",
  "Falta de tempo / agenda",
  "Mudança de esporte",
  "Insatisfação",
  "Conclusão do ciclo",
  "Outro",
]

// Historico de pagamento resumido por mes (req. 7 - historico de pagamentos).
export type HistoricoPagamento = {
  mes: string
  ano: number
  situacao: "pago" | "atrasado" | "isento"
}

// Historico de frequencia e desempenho (req. 7).
export type HistoricoDesempenho = {
  frequencia: number // % de presenca
  totalPresencas: number
  totalAulas: number
  gols: number
  avaliacao: "Excelente" | "Muito bom" | "Bom" | "Regular"
  observacaoTecnica: string
}

export type ExAluno = {
  id: string
  nome: string
  turmaAnterior: string
  modalidadeAnterior: Modalidade
  responsavel: string
  telefone: string
  email: string
  dataEntrada: string // ISO
  dataSaida: string // ISO
  motivoSaida: MotivoSaida
  observacoesSaida: string
  historicoPagamentos: HistoricoPagamento[]
  desempenho: HistoricoDesempenho
}

function pagamentosMock(situacaoFinal: HistoricoPagamento["situacao"]): HistoricoPagamento[] {
  const base: Array<{ mes: string; ano: number }> = [
    { mes: "Setembro", ano: 2025 },
    { mes: "Outubro", ano: 2025 },
    { mes: "Novembro", ano: 2025 },
    { mes: "Dezembro", ano: 2025 },
    { mes: "Janeiro", ano: 2026 },
  ]
  return base.map((b, i) => ({
    ...b,
    situacao: i === base.length - 1 ? situacaoFinal : "pago",
  }))
}

export const exAlunos: ExAluno[] = [
  {
    id: "ex1",
    nome: "Vinícius Prado Almeida",
    turmaAnterior: "SUDOESTE (SÁBADO - 09h00 às 10h00)",
    modalidadeAnterior: "coletiva",
    responsavel: "Renata Prado Almeida",
    telefone: "(61) 99811-2200",
    email: "renata.almeida@email.com",
    dataEntrada: "2023-03-06",
    dataSaida: "2026-01-20",
    motivoSaida: "Mudança de cidade",
    observacoesSaida: "Família se mudou para São Paulo. Aluno dedicado, sentiremos falta.",
    historicoPagamentos: pagamentosMock("pago"),
    desempenho: {
      frequencia: 92,
      totalPresencas: 88,
      totalAulas: 96,
      gols: 41,
      avaliacao: "Excelente",
      observacaoTecnica: "Ótima leitura de jogo e liderança dentro de campo.",
    },
  },
  {
    id: "ex2",
    nome: "Beatriz Camargo Lopes",
    turmaAnterior: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)",
    modalidadeAnterior: "coletiva",
    responsavel: "Douglas Lopes",
    telefone: "(61) 98422-6754",
    email: "douglas.lopes@email.com",
    dataEntrada: "2024-02-12",
    dataSaida: "2025-11-30",
    motivoSaida: "Questões financeiras",
    observacoesSaida: "Responsável demonstrou interesse em retornar quando possível.",
    historicoPagamentos: pagamentosMock("atrasado"),
    desempenho: {
      frequencia: 78,
      totalPresencas: 54,
      totalAulas: 69,
      gols: 12,
      avaliacao: "Bom",
      observacaoTecnica: "Boa evolução técnica, precisa de mais constância.",
    },
  },
  {
    id: "ex3",
    nome: "Enzo Ribeiro Tavares",
    turmaAnterior: "ASA NORTE (SEGUNDA E QUARTA - 18h00 às 19h00)",
    modalidadeAnterior: "coletiva",
    responsavel: "Marcela Tavares",
    telefone: "(61) 99560-1188",
    email: "marcela.tavares@email.com",
    dataEntrada: "2022-08-01",
    dataSaida: "2025-12-15",
    motivoSaida: "Mudança de esporte",
    observacoesSaida: "Optou por natação. Manteve bom relacionamento com a equipe.",
    historicoPagamentos: pagamentosMock("pago"),
    desempenho: {
      frequencia: 85,
      totalPresencas: 120,
      totalAulas: 141,
      gols: 27,
      avaliacao: "Muito bom",
      observacaoTecnica: "Excelente condicionamento físico e disciplina.",
    },
  },
  {
    id: "ex4",
    nome: "Laura Antunes Vidal",
    turmaAnterior: "PARTICULAR (HORÁRIO A COMBINAR)",
    modalidadeAnterior: "particular",
    responsavel: "Cristina Vidal",
    telefone: "(61) 98133-9042",
    email: "cristina.vidal@email.com",
    dataEntrada: "2024-09-10",
    dataSaida: "2026-01-08",
    motivoSaida: "Falta de tempo / agenda",
    observacoesSaida: "Conflito com atividades escolares no contraturno.",
    historicoPagamentos: pagamentosMock("pago"),
    desempenho: {
      frequencia: 96,
      totalPresencas: 46,
      totalAulas: 48,
      gols: 9,
      avaliacao: "Muito bom",
      observacaoTecnica: "Evoluiu rápido nos treinos individuais.",
    },
  },
  {
    id: "ex5",
    nome: "Pedro Henrique Mota Lira",
    turmaAnterior: "SUDOESTE (QUINTA 18H40 E SÁBADO 09H00)",
    modalidadeAnterior: "coletiva",
    responsavel: "Anderson Lira",
    telefone: "(62) 99677-4521",
    email: "anderson.lira@email.com",
    dataEntrada: "2021-05-04",
    dataSaida: "2025-10-25",
    motivoSaida: "Conclusão do ciclo",
    observacoesSaida: "Chegou à idade máxima da categoria. Encaminhado para clube parceiro.",
    historicoPagamentos: pagamentosMock("pago"),
    desempenho: {
      frequencia: 90,
      totalPresencas: 168,
      totalAulas: 187,
      gols: 63,
      avaliacao: "Excelente",
      observacaoTecnica: "Artilheiro histórico da categoria. Grande talento.",
    },
  },
  {
    id: "ex6",
    nome: "Sofia Nunes Barreto",
    turmaAnterior: "ASA NORTE (SEGUNDA E QUARTA - 19h00 às 20h00)",
    modalidadeAnterior: "coletiva",
    responsavel: "Tatiana Barreto",
    telefone: "(61) 98744-3390",
    email: "tatiana.barreto@email.com",
    dataEntrada: "2023-11-18",
    dataSaida: "2025-09-30",
    motivoSaida: "Insatisfação",
    observacoesSaida: "Buscou turma em horário diferente que não tínhamos disponível.",
    historicoPagamentos: pagamentosMock("isento"),
    desempenho: {
      frequencia: 71,
      totalPresencas: 39,
      totalAulas: 55,
      gols: 6,
      avaliacao: "Regular",
      observacaoTecnica: "Potencial a desenvolver com mais frequência.",
    },
  },
]

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

/** Tempo de permanencia (em meses) entre entrada e saida. */
export function tempoPermanencia(entrada: string, saida: string): string {
  const a = new Date(entrada)
  const b = new Date(saida)
  const meses = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`
  const anos = Math.floor(meses / 12)
  const rem = meses % 12
  return rem === 0 ? `${anos} ${anos === 1 ? "ano" : "anos"}` : `${anos} ${anos === 1 ? "ano" : "anos"} e ${rem} ${rem === 1 ? "mês" : "meses"}`
}

/** Variante de tag da avaliacao de desempenho, coerente com o restante do app. */
export function avaliacaoVariant(a: HistoricoDesempenho["avaliacao"]): "green" | "blue" | "gold" {
  if (a === "Excelente" || a === "Muito bom") return "green"
  if (a === "Bom") return "blue"
  return "gold"
}

/** Variante de tag para uma situacao de pagamento do historico. */
export function pagamentoVariant(s: HistoricoPagamento["situacao"]): "green" | "danger" | "blue" {
  if (s === "pago") return "green"
  if (s === "atrasado") return "danger"
  return "blue"
}

// Reexporta utilitarios ja existentes para uso na tela de ex-alunos.
export { linkWhatsApp } from "./alunos-data"
export { turmasDisponiveis } from "./turmas-data"
export { modalidadeDaTurma }
