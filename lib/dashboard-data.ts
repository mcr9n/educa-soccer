// Dados de exemplo (mock) para o Painel inicial do Educa Soccer.
// Em uma versao futura, estes dados virao de um banco de dados.

export type Turma = {
  id: string
  nome: string
  modalidade: "coletiva" | "particular"
  faixaEtaria: string
  totalAlunos: number
  limite: number
}

export type PagamentoPendente = {
  id: string
  aluno: string
  turma: string
  mesReferencia: string
  valor: number
  situacao: "pendente" | "atrasado"
  diasAtraso: number
}

export type FaltaConsecutiva = {
  id: string
  aluno: string
  turma: string
  faltas: number
  ultimaAusencia: string
}

export type AulaExperimental = {
  id: string
  crianca: string
  idade: number
  turmaInteresse: string
  data: string
  situacao: "agendada" | "aguardando" | "realizada"
}

export type UniformePendente = {
  id: string
  aluno: string
  turma: string
  numero: number
  situacao: "aguardando pagamento" | "em produção" | "disponível para entrega"
}

export type Torneio = {
  id: string
  nome: string
  categoria: string
  data: string
  local: string
  situacao: "planejamento" | "confirmado" | "em andamento"
}

export const resumo = {
  alunosAtivos: 128,
  alunosParticulares: 22,
  alunosColetivos: 106,
  exAlunos: 37,
  totalTurmas: 6,
}

export const turmas: Turma[] = [
  { id: "sub7", nome: "Sub-7", modalidade: "coletiva", faixaEtaria: "5 a 7 anos", totalAlunos: 24, limite: 30 },
  { id: "sub9", nome: "Sub-9", modalidade: "coletiva", faixaEtaria: "8 a 9 anos", totalAlunos: 28, limite: 30 },
  { id: "sub11", nome: "Sub-11", modalidade: "coletiva", faixaEtaria: "10 a 11 anos", totalAlunos: 26, limite: 30 },
  { id: "sub13", nome: "Sub-13", modalidade: "coletiva", faixaEtaria: "12 a 13 anos", totalAlunos: 18, limite: 26 },
  { id: "sub15", nome: "Sub-15", modalidade: "coletiva", faixaEtaria: "14 a 15 anos", totalAlunos: 10, limite: 24 },
  { id: "part", nome: "Particular", modalidade: "particular", faixaEtaria: "Livre", totalAlunos: 22, limite: 22 },
]

export const pagamentosPendentes: PagamentoPendente[] = [
  { id: "p1", aluno: "Lucas Andrade", turma: "Sub-9", mesReferencia: "Julho", valor: 180, situacao: "atrasado", diasAtraso: 12 },
  { id: "p2", aluno: "Sofia Ramos", turma: "Sub-7", mesReferencia: "Julho", valor: 180, situacao: "atrasado", diasAtraso: 8 },
  { id: "p3", aluno: "Enzo Martins", turma: "Sub-11", mesReferencia: "Julho", valor: 180, situacao: "pendente", diasAtraso: 3 },
  { id: "p4", aluno: "Helena Costa", turma: "Particular", mesReferencia: "Julho", valor: 320, situacao: "pendente", diasAtraso: 2 },
  { id: "p5", aluno: "Miguel Souza", turma: "Sub-13", mesReferencia: "Julho", valor: 180, situacao: "pendente", diasAtraso: 1 },
  { id: "p6", aluno: "Maria Fernanda Albuquerque", turma: "Sub-11", mesReferencia: "Julho", valor: 180, situacao: "atrasado", diasAtraso: 15 },
  { id: "p7", aluno: "Arthur Gonçalves Ribeiro", turma: "Sub-9", mesReferencia: "Julho", valor: 180, situacao: "atrasado", diasAtraso: 6 },
  { id: "p8", aluno: "Valentina Cardoso", turma: "Particular", mesReferencia: "Julho", valor: 320, situacao: "pendente", diasAtraso: 4 },
  { id: "p9", aluno: "Bernardo Almeida", turma: "Sub-7", mesReferencia: "Julho", valor: 180, situacao: "pendente", diasAtraso: 2 },
  { id: "p10", aluno: "Cecília Nascimento", turma: "Sub-15", mesReferencia: "Julho", valor: 180, situacao: "atrasado", diasAtraso: 9 },
  { id: "p11", aluno: "Heitor Carvalho Mendes", turma: "Sub-13", mesReferencia: "Julho", valor: 180, situacao: "pendente", diasAtraso: 1 },
  { id: "p12", aluno: "Lorena Oliveira", turma: "Sub-11", mesReferencia: "Junho", valor: 180, situacao: "atrasado", diasAtraso: 33 },
]

export const faltasConsecutivas: FaltaConsecutiva[] = [
  { id: "f1", aluno: "Théo Barbosa", turma: "Sub-9", faltas: 4, ultimaAusencia: "25/07" },
  { id: "f2", aluno: "Alice Ferreira", turma: "Sub-7", faltas: 3, ultimaAusencia: "24/07" },
  { id: "f3", aluno: "Davi Nunes", turma: "Sub-11", faltas: 3, ultimaAusencia: "26/07" },
  { id: "f4", aluno: "Maria Fernanda Albuquerque", turma: "Sub-11", faltas: 5, ultimaAusencia: "26/07" },
  { id: "f5", aluno: "Benjamin Vasconcelos", turma: "Sub-13", faltas: 4, ultimaAusencia: "23/07" },
  { id: "f6", aluno: "Cecília Nascimento", turma: "Sub-15", faltas: 3, ultimaAusencia: "25/07" },
  { id: "f7", aluno: "Antônio Guilherme Fontes", turma: "Sub-9", faltas: 3, ultimaAusencia: "24/07" },
]

export const aulasExperimentais: AulaExperimental[] = [
  { id: "e1", crianca: "Pedro Lima", idade: 8, turmaInteresse: "Sub-9", data: "29/07", situacao: "agendada" },
  { id: "e2", crianca: "Manuela Dias", idade: 6, turmaInteresse: "Sub-7", data: "30/07", situacao: "agendada" },
  { id: "e3", crianca: "Gabriel Rocha", idade: 11, turmaInteresse: "Sub-11", data: "—", situacao: "aguardando" },
  { id: "e4", crianca: "Laura Pinto", idade: 10, turmaInteresse: "Sub-11", data: "28/07", situacao: "realizada" },
]

export const uniformesPendentes: UniformePendente[] = [
  { id: "u1", aluno: "João Vitor", turma: "Sub-13", numero: 10, situacao: "aguardando pagamento" },
  { id: "u2", aluno: "Isabela Moraes", turma: "Sub-9", numero: 7, situacao: "em produção" },
  { id: "u3", aluno: "Rafael Teixeira", turma: "Sub-11", numero: 9, situacao: "disponível para entrega" },
  { id: "u4", aluno: "Beatriz Alves", turma: "Sub-7", numero: 11, situacao: "aguardando pagamento" },
]

export const torneios: Torneio[] = [
  { id: "t1", nome: "Copa Verão Educa", categoria: "Sub-9 / Sub-11", data: "10/08", local: "Arena Central", situacao: "confirmado" },
  { id: "t2", nome: "Torneio Bairro Cup", categoria: "Sub-13", data: "24/08", local: "Campo do Parque", situacao: "planejamento" },
  { id: "t3", nome: "Festival Sub-7", categoria: "Sub-7", data: "31/08", local: "Ginásio Municipal", situacao: "planejamento" },
]
