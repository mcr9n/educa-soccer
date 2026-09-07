import type { Pagamento, FormaPagamento } from "@/lib/pagamentos-data"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:8443"

type RegistroPagamento = {
  dataPagamento: string
  valorRecebido: number
  formaPagamento: FormaPagamento
  responsavelRegistro: string
  observacoes?: string
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
  if (resposta.status === 204) return undefined as T
  return resposta.json() as Promise<T>
}

export function listarPagamentos(ano: number, mes: number): Promise<Pagamento[]> {
  return requisicao<Pagamento[]>(`/api/pagamentos?ano=${ano}&mes=${mes}`)
}

export function registrarPagamento(id: string, dados: RegistroPagamento): Promise<void> {
  return requisicao<void>(`/api/pagamentos/${encodeURIComponent(id)}/registrar`, {
    method: "PATCH",
    body: JSON.stringify(dados),
  })
}

export function reabrirPagamento(id: string): Promise<void> {
  return requisicao<void>(`/api/pagamentos/${encodeURIComponent(id)}/reabrir`, { method: "PATCH" })
}
