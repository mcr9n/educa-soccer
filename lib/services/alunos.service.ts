import {
  calcularIdade,
  faixaEtaria,
  modalidadeDaTurma,
  turmasDisponiveis,
  type Aluno,
} from "@/lib/alunos-data"

export type ModalidadeFiltro = "todas" | "coletiva" | "particular"

export type FiltrosAlunos = {
  busca: string
  turma: string
  faixaEtaria: string
  modalidade: ModalidadeFiltro
}

export type ResumoAlunos = {
  ativos: number
  particulares: number
  coletivos: number
  porTurma: { turma: string; total: number }[]
}

export function obterAlunosAtivos(alunos: Aluno[]) {
  return alunos.filter((aluno) => aluno.ativo)
}

export function filtrarAlunos(alunos: Aluno[], filtros: FiltrosAlunos) {
  const termo = filtros.busca.trim().toLowerCase()

  return alunos.filter((aluno) => {
    if (termo && !aluno.nome.toLowerCase().includes(termo)) return false
    if (filtros.turma !== "todas" && aluno.turma !== filtros.turma) return false
    if (filtros.modalidade !== "todas" && aluno.modalidade !== filtros.modalidade) return false
    if (filtros.faixaEtaria !== "todas" && faixaEtaria(calcularIdade(aluno.dataNascimento)) !== filtros.faixaEtaria) {
      return false
    }

    return true
  })
}

export function calcularResumoAlunos(alunosAtivos: Aluno[]): ResumoAlunos {
  const particulares = alunosAtivos.filter((aluno) => aluno.modalidade === "particular").length
  const coletivos = alunosAtivos.filter((aluno) => aluno.modalidade === "coletiva").length
  const porTurma = turmasDisponiveis
    .map((turma) => ({ turma, total: alunosAtivos.filter((aluno) => aluno.turma === turma).length }))
    .filter((turma) => turma.total > 0)

  return {
    ativos: alunosAtivos.length,
    particulares,
    coletivos,
    porTurma,
  }
}

export function editarAluno(alunos: Aluno[], id: string, dados: Partial<Aluno>) {
  return alunos.map((aluno) => (aluno.id === id ? { ...aluno, ...dados } : aluno))
}

export function transferirAluno(alunos: Aluno[], id: string, turma: string) {
  const modalidade = modalidadeDaTurma(turma)

  return alunos.map((aluno) => (aluno.id === id ? { ...aluno, turma, modalidade } : aluno))
}

export function marcarAlunoComoExAluno(alunos: Aluno[], id: string) {
  return alunos.map((aluno) => (aluno.id === id ? { ...aluno, ativo: false } : aluno))
}