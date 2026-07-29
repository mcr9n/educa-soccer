// Dados de exemplo (mock) das turmas do Educa Soccer.
// Esta e a fonte de verdade dos nomes de turma usados em todo o sistema
// (inclusive nas fichas dos alunos). Os nomes seguem o formato real usado
// pela escolinha: LOCAL (DIAS - HORARIO), ex.: "SUDOESTE (SEXTA - 17h00 às 18h00)".

export type Modalidade = "coletiva" | "particular"
export type SituacaoTurma = "ativa" | "inativa"

export type Turma = {
  id: string
  nome: string
  local: string
  dias: string[]
  horario: string
  modalidade: Modalidade
  faixaEtaria: string
  professor: string
  situacao: SituacaoTurma
  limite?: number // limite de alunos, quando aplicavel
}

export const diasDaSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
] as const

export const locaisDisponiveis = ["Sudoeste", "Noroeste", "Asa Norte", "Lago Norte", "Guará"] as const

export const professoresDisponiveis = [
  "Prof. Rafael Duarte",
  "Prof. Diego Nunes",
  "Prof. Bruno Antunes",
] as const

export const turmas: Turma[] = [
  {
    id: "t1",
    nome: "SUDOESTE (QUINTA 18H40 E SÁBADO 09H00)",
    local: "Sudoeste",
    dias: ["Quinta", "Sábado"],
    horario: "18h40 / 09h00",
    modalidade: "coletiva",
    faixaEtaria: "8 a 10 anos",
    professor: "Prof. Rafael Duarte",
    situacao: "ativa",
    limite: 16,
  },
  {
    id: "t2",
    nome: "SUDOESTE (SEXTA - 17h00 às 18h00)",
    local: "Sudoeste",
    dias: ["Sexta"],
    horario: "17h00 às 18h00",
    modalidade: "coletiva",
    faixaEtaria: "6 a 8 anos",
    professor: "Prof. Diego Nunes",
    situacao: "ativa",
    limite: 14,
  },
  {
    id: "t3",
    nome: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    local: "Sudoeste",
    dias: ["Sábado"],
    horario: "10h40 às 11h40",
    modalidade: "coletiva",
    faixaEtaria: "7 a 11 anos",
    professor: "Prof. Rafael Duarte",
    situacao: "ativa",
    limite: 16,
  },
  {
    id: "t4",
    nome: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)",
    local: "Noroeste",
    dias: ["Terça", "Quinta"],
    horario: "17h00 às 18h00",
    modalidade: "coletiva",
    faixaEtaria: "11 a 13 anos",
    professor: "Prof. Bruno Antunes",
    situacao: "ativa",
    limite: 18,
  },
  {
    id: "t5",
    nome: "ASA NORTE (SEGUNDA E QUARTA - 18h00 às 19h00)",
    local: "Asa Norte",
    dias: ["Segunda", "Quarta"],
    horario: "18h00 às 19h00",
    modalidade: "coletiva",
    faixaEtaria: "9 a 12 anos",
    professor: "Prof. Diego Nunes",
    situacao: "ativa",
    limite: 18,
  },
  {
    id: "t6",
    nome: "SUDOESTE (SÁBADO - 09h00 às 10h00)",
    local: "Sudoeste",
    dias: ["Sábado"],
    horario: "09h00 às 10h00",
    modalidade: "coletiva",
    faixaEtaria: "8 a 10 anos",
    professor: "Prof. Rafael Duarte",
    situacao: "ativa",
    limite: 16,
  },
  {
    id: "t7",
    nome: "NOROESTE (TERÇA E QUINTA - 18h00 às 19h00)",
    local: "Noroeste",
    dias: ["Terça", "Quinta"],
    horario: "18h00 às 19h00",
    modalidade: "coletiva",
    faixaEtaria: "8 a 11 anos",
    professor: "Prof. Bruno Antunes",
    situacao: "ativa",
    limite: 18,
  },
  {
    id: "t8",
    nome: "ASA NORTE (SEGUNDA E QUARTA - 19h00 às 20h00)",
    local: "Asa Norte",
    dias: ["Segunda", "Quarta"],
    horario: "19h00 às 20h00",
    modalidade: "coletiva",
    faixaEtaria: "13 a 15 anos",
    professor: "Prof. Diego Nunes",
    situacao: "ativa",
    limite: 18,
  },
  {
    id: "t9",
    nome: "PARTICULAR (HORÁRIO A COMBINAR)",
    local: "A combinar",
    dias: ["A combinar"],
    horario: "A combinar",
    modalidade: "particular",
    faixaEtaria: "Todas as idades",
    professor: "Prof. Rafael Duarte",
    situacao: "ativa",
  },
  {
    id: "t10",
    nome: "GUARÁ (SEGUNDA - 09h00 às 10h00)",
    local: "Guará",
    dias: ["Segunda"],
    horario: "09h00 às 10h00",
    modalidade: "coletiva",
    faixaEtaria: "6 a 9 anos",
    professor: "Prof. Bruno Antunes",
    situacao: "inativa",
    limite: 14,
  },
]

/** Lista de nomes de turma usada nos seletores e filtros do sistema. */
export const turmasDisponiveis = turmas.map((t) => t.nome)

/** Busca a turma pelo nome. */
export function getTurma(nome: string): Turma | undefined {
  return turmas.find((t) => t.nome === nome)
}

/** Modalidade associada a uma turma (padrao coletiva). */
export function modalidadeDaTurma(nome: string): Modalidade {
  return getTurma(nome)?.modalidade ?? "coletiva"
}

/** Proximo id sequencial de turma com base na lista atual. */
export function proximoIdTurma(lista: Turma[]): string {
  const maior = lista.reduce((max, t) => {
    const n = Number(t.id.replace(/\D/g, "")) || 0
    return Math.max(max, n)
  }, 0)
  return `t${maior + 1}`
}

/**
 * Registra uma nova turma na lista em memoria (mock).
 * Em uma versao futura isto seria uma escrita no banco de dados.
 */
export function adicionarTurma(nova: Omit<Turma, "id">): Turma {
  const turma: Turma = { ...nova, id: proximoIdTurma(turmas) }
  turmas.push(turma)
  return turma
}

/** Sugere um nome de turma no formato padrao a partir de local, dias e horario. */
export function sugerirNomeTurma(local: string, dias: string[], horario: string): string {
  const localFmt = local.trim().toUpperCase()
  const diasFmt = dias.join(" E ").toUpperCase()
  const horarioFmt = horario.trim()
  if (!localFmt) return ""
  const detalhe = [diasFmt, horarioFmt].filter(Boolean).join(" - ")
  return detalhe ? `${localFmt} (${detalhe})` : localFmt
}
