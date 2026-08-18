import { type AulaExperimental, type SituacaoContato, proximoIdAulaExperimental } from "@/lib/aulas-experimentais-data"

export type FiltrosAulasExperimentais = {
  busca: string
  turma: string
  situacao: string
}

export type ResumoAulasExperimentais = {
  total: number
  agendadas: number
  aguardando: number
  matriculasConfirmadas: number
}

export function filtrarAulasExperimentais(
  lista: AulaExperimental[],
  filtros: FiltrosAulasExperimentais,
): AulaExperimental[] {
  const termo = filtros.busca.trim().toLowerCase()

  return lista.filter((item) => {
    if (
      termo &&
      !item.nomeCrianca.toLowerCase().includes(termo) &&
      !item.nomeResponsavel.toLowerCase().includes(termo)
    ) {
      return false
    }
    if (filtros.turma !== "todas" && item.turmaInteresse !== filtros.turma) return false
    if (filtros.situacao !== "todas" && item.situacao !== filtros.situacao) return false
    return true
  })
}

export function calcularResumoAulasExperimentais(lista: AulaExperimental[]): ResumoAulasExperimentais {
  return {
    total: lista.length,
    agendadas: lista.filter((i) => i.situacao === "Aula experimental agendada").length,
    aguardando: lista.filter(
      (i) => i.situacao === "Novo contato" || i.situacao === "Aguardando resposta",
    ).length,
    matriculasConfirmadas: lista.filter((i) => i.situacao === "Matrícula confirmada").length,
  }
}

export function editarAulaExperimental(
  lista: AulaExperimental[],
  id: string,
  dados: Partial<AulaExperimental>,
): AulaExperimental[] {
  return lista.map((item) => (item.id === id ? { ...item, ...dados } : item))
}

export function atualizarSituacao(
  lista: AulaExperimental[],
  id: string,
  situacao: SituacaoContato,
): AulaExperimental[] {
  return editarAulaExperimental(lista, id, { situacao })
}

export function removerAulaExperimental(lista: AulaExperimental[], id: string): AulaExperimental[] {
  return lista.filter((item) => item.id !== id)
}

export function adicionarAulaExperimental(
  lista: AulaExperimental[],
  novo: Omit<AulaExperimental, "id">,
): { lista: AulaExperimental[]; criado: AulaExperimental } {
  const criado: AulaExperimental = { ...novo, id: proximoIdAulaExperimental(lista) }
  return { lista: [criado, ...lista], criado }
}
