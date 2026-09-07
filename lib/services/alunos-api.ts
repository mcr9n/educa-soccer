import type { Aluno } from "@/lib/alunos-data"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8443"

export type NovoAluno = Omit<Aluno, "id" | "numero" | "ativo"> & {
  ativo?: boolean
}

async function requisicao<T>(caminho: string, init?: RequestInit): Promise<T> {
  let resposta: Response

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    })
  } catch (erro) {
    throw new Error(
      `Não foi possível conectar à API em ${API_URL}. Verifique o backend, HTTPS e CORS. ${erro instanceof Error ? erro.message : ""}`,
    )
  }

  if (!resposta.ok) {
    const mensagem = await resposta.text()
    throw new Error(mensagem || `Erro na API (${resposta.status})`)
  }

  return resposta.json() as Promise<T>
}

export function listarAlunos(): Promise<Aluno[]> {
  return requisicao<Aluno[]>("/api/alunos")
}

export function cadastrarAluno(aluno: NovoAluno): Promise<Aluno> {
  return requisicao<Aluno>("/api/alunos", {
    method: "POST",
    body: JSON.stringify(aluno),
  })
}

export function atualizarAluno(id: string, aluno: Partial<Aluno>): Promise<Aluno> {
  return requisicao<Aluno>(`/api/alunos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(aluno),
  })
}
