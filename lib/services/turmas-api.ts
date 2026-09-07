import type { Turma } from "@/lib/turmas-data"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8443"

export type NovaTurma = Omit<Turma, "id">

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

export function listarTurmas(): Promise<Turma[]> {
  return requisicao<Turma[]>("/api/turmas")
}

export function cadastrarTurma(turma: NovaTurma): Promise<Turma> {
  return requisicao<Turma>("/api/turmas", {
    method: "POST",
    body: JSON.stringify(turma),
  })
}
