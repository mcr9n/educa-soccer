import alunosData from "./students.json"

export type Modalidade = "particular" | "coletiva"

export type Aluno = {
  id: string
  nome: string
  responsavel: string | null
  nascimento: string | null
  idade: number | null
  telefone: string | null
  email: string | null
  mensalidade: number | null
  turma: string
  bairro: string
  modalidade: Modalidade
  ativo: boolean
}

export const alunos: Aluno[] = alunosData as Aluno[]

/** Bairros distintos, para o filtro de turma/local. */
export const bairros: string[] = [...new Set(alunos.map((a) => a.bairro))].sort()

export type FaixaEtaria = "todas" | "sub7" | "sub9" | "sub11" | "sub13" | "sub15+"

export const faixas: { valor: FaixaEtaria; label: string; test: (idade: number | null) => boolean }[] = [
  { valor: "todas", label: "Todas as idades", test: () => true },
  { valor: "sub7", label: "Até 7 anos", test: (i) => i != null && i <= 7 },
  { valor: "sub9", label: "8 a 9 anos", test: (i) => i != null && i >= 8 && i <= 9 },
  { valor: "sub11", label: "10 a 11 anos", test: (i) => i != null && i >= 10 && i <= 11 },
  { valor: "sub13", label: "12 a 13 anos", test: (i) => i != null && i >= 12 && i <= 13 },
  { valor: "sub15+", label: "14 anos ou mais", test: (i) => i != null && i >= 14 },
]

/** Monta um link de WhatsApp a partir de um telefone brasileiro. */
export function whatsappLink(telefone: string | null, nome: string): string | null {
  if (!telefone) return null
  const digits = telefone.replace(/\D/g, "")
  if (digits.length < 10) return null
  const full = digits.startsWith("55") ? digits : `55${digits}`
  const texto = encodeURIComponent(
    `Olá! Aqui é da Educa Soccer. Gostaríamos de falar sobre o(a) aluno(a) ${nome}.`,
  )
  return `https://wa.me/${full}?text=${texto}`
}

/** Iniciais para o avatar do aluno. */
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}
