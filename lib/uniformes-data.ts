// Dados de exemplo (mock) da gestao de uniformes do Educa Soccer (req. 11).
// Espelha e organiza a planilha "Pedidos" hoje usada pela escolinha:
// Responsavel, Aluno, Tamanho, Numero, Pagamento, Entregue, Repasse para o JP.
// Aqui o responsavel e a turma vem sempre do cadastro do aluno (fonte unica
// de verdade), e cada situacao ganha tambem a data em que foi marcada.
// Em uma versao futura, estes dados virao de um banco de dados.

import { alunos, type Aluno } from "./alunos-data"

export const tamanhosUniforme = ["4", "6", "8", "10", "12", "14", "16", "P", "M", "G", "GG"] as const
export type TamanhoUniforme = (typeof tamanhosUniforme)[number]

export type PedidoUniforme = {
  id: string
  alunoId: string
  tamanho: TamanhoUniforme
  numero: number
  valor: number
  pago: boolean
  dataPagamento?: string // ISO - preenchida ao marcar como pago
  entregue: boolean
  dataEntrega?: string // ISO - preenchida ao marcar como entregue
  repassadoJP: boolean
  dataRepasse?: string // ISO - preenchida ao marcar o repasse
  observacoes?: string
}

// Valor padrao do uniforme (kit camisa + numero).
export const valorPadraoUniforme = 120

export const pedidosUniformes: PedidoUniforme[] = [
  {
    id: "un1",
    alunoId: "a1",
    tamanho: "8",
    numero: 7,
    valor: 120,
    pago: true,
    dataPagamento: "2026-06-12",
    entregue: false,
    repassadoJP: true,
    dataRepasse: "2026-06-15",
  },
  {
    id: "un2",
    alunoId: "a3",
    tamanho: "12",
    numero: 11,
    valor: 120,
    pago: true,
    dataPagamento: "2026-06-14",
    entregue: false,
    repassadoJP: true,
    dataRepasse: "2026-06-15",
  },
  {
    id: "un3",
    alunoId: "a10",
    tamanho: "4",
    numero: 17,
    valor: 120,
    pago: true,
    dataPagamento: "2026-06-18",
    entregue: false,
    repassadoJP: true,
    dataRepasse: "2026-06-20",
  },
  {
    id: "un4",
    alunoId: "a11",
    tamanho: "10",
    numero: 7,
    valor: 120,
    pago: false,
    entregue: false,
    repassadoJP: true,
    dataRepasse: "2026-06-20",
    observacoes: "Aguardando pagamento no dinheiro combinado com o responsável.",
  },
  {
    id: "a5-un",
    alunoId: "a5",
    tamanho: "10",
    numero: 10,
    valor: 120,
    pago: true,
    dataPagamento: "2026-06-22",
    entregue: false,
    repassadoJP: false,
  },
  {
    id: "un6",
    alunoId: "a15",
    tamanho: "14",
    numero: 10,
    valor: 120,
    pago: true,
    dataPagamento: "2026-06-25",
    entregue: true,
    dataEntrega: "2026-07-03",
    repassadoJP: false,
  },
  {
    id: "un7",
    alunoId: "a4",
    tamanho: "12",
    numero: 4,
    valor: 120,
    pago: true,
    dataPagamento: "2026-07-01",
    entregue: true,
    dataEntrega: "2026-07-10",
    repassadoJP: true,
    dataRepasse: "2026-07-11",
  },
]

/** Aluno vinculado ao pedido de uniforme. */
export function alunoDoPedido(pedido: PedidoUniforme): Aluno | undefined {
  return alunos.find((a) => a.id === pedido.alunoId)
}

/** Turma do aluno do pedido (fonte: cadastro do aluno). */
export function turmaDoPedido(pedido: PedidoUniforme): string {
  return alunoDoPedido(pedido)?.turma ?? "Sem turma"
}

/**
 * Verifica se um numero de uniforme ja esta em uso por outro aluno da mesma
 * turma (req. 11: nao permitir dois alunos da mesma turma com o mesmo numero).
 * `idPedidoAtual` deve ser informado ao editar, para nao comparar consigo mesmo.
 */
export function numeroEmUsoNaTurma(
  lista: PedidoUniforme[],
  turma: string,
  numero: number,
  idPedidoAtual?: string,
): PedidoUniforme | undefined {
  return lista.find(
    (p) => p.id !== idPedidoAtual && p.numero === numero && turmaDoPedido(p) === turma,
  )
}

/** Proximo id sequencial de pedido com base na lista atual. */
export function proximoIdPedidoUniforme(lista: PedidoUniforme[]): string {
  const maior = lista.reduce((max, p) => {
    const n = Number(p.id.replace(/\D/g, "")) || 0
    return Math.max(max, n)
  }, 0)
  return `un${maior + 1}`
}

/** Resumo numerico para o cabeçalho-placar da tela (req. 11). */
export function resumoUniformes(lista: PedidoUniforme[]) {
  return lista.reduce(
    (acc, p) => {
      acc.total++
      if (p.pago) acc.pagos++
      else acc.pagamentoPendente++
      if (p.entregue) acc.entregues++
      else acc.entregaPendente++
      if (p.repassadoJP) acc.repassados++
      else acc.repassePendente++
      return acc
    },
    {
      total: 0,
      pagos: 0,
      pagamentoPendente: 0,
      entregues: 0,
      entregaPendente: 0,
      repassados: 0,
      repassePendente: 0,
    },
  )
}
