import type { Chamada, PresencaAluno } from "@/lib/chamada-data"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:8443"

export type ChamadaRequest = {
  turma: string
  data: string
  registradoPor: string
  presencas: PresencaAluno[]
}

async function requisicao<T>(caminho: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (!resposta.ok) {
    const mensagem = await resposta.text()
    throw new Error(mensagem || `Erro na API (${resposta.status})`)
  }
  return resposta.json() as Promise<T>
}

export function listarChamadas(turma: string): Promise<Chamada[]> {
  return requisicao<Chamada[]>(`/api/chamadas?turma=${encodeURIComponent(turma)}`)
}

export function buscarChamada(turma: string, data: string): Promise<Chamada | null> {
  return requisicao<Chamada>(`/api/chamadas/por-data?turma=${encodeURIComponent(turma)}&data=${data}`).catch((erro) => {
    if (erro.message.includes("(404)")) return null
    throw erro
  })
}

export function salvarChamada(request: ChamadaRequest): Promise<Chamada> {
  return requisicao<Chamada>("/api/chamadas", { method: "POST", body: JSON.stringify(request) })
}
