// Dados de exemplo (mock) da gestao de pagamentos do Educa Soccer.
// Cada pagamento espelha o requisito 6.1: aluno, mes de referencia, ano,
// valor, vencimento, situacao, data do pagamento, forma de pagamento e
// observacoes. O valor pode diferir entre alunos particulares e coletivos.
// Em uma versao futura, estes dados virao de um banco de dados.

import { alunos, type Aluno } from "./alunos-data"

export type SituacaoPagamento = "pago" | "pendente" | "atrasado" | "isento"

export type FormaPagamento = "PIX" | "Dinheiro" | "Cartão" | "Transferência" | "Boleto"

export const formasPagamento: FormaPagamento[] = ["PIX", "Dinheiro", "Cartão", "Transferência", "Boleto"]

export type Pagamento = {
  id: string
  alunoId: string
  mes: number // 1-12
  ano: number
  valor: number
  vencimento: string // ISO (YYYY-MM-DD)
  situacao: SituacaoPagamento
  dataPagamento?: string // ISO - preenchido quando pago
  valorRecebido?: number
  formaPagamento?: FormaPagamento
  responsavelRegistro?: string // quem registrou o pagamento (req. 6.2)
  observacoes?: string
}

export const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const

/** Nome curto do mes (Jan, Fev, ...). */
export function mesCurto(mes: number): string {
  return meses[mes - 1]?.slice(0, 3) ?? ""
}

/** Usuario logado (mock) usado como "responsavel pelo registro". */
export const usuarioLogado = "Coordenação"

// Ano de referencia do sistema (mock).
export const anoAtual = 2026

// Meses ja gerados no sistema de exemplo (Jan a Jul de 2026).
const mesesGerados = [1, 2, 3, 4, 5, 6, 7]

// Distribuicao deterministica de situacoes para gerar dados realistas.
// Cada aluno recebe um "perfil" de pagador com base no indice.
function perfilPagador(indice: number): SituacaoPagamento[] {
  switch (indice % 5) {
    case 0: // Sempre em dia
      return ["pago", "pago", "pago", "pago", "pago", "pago", "pago"]
    case 1: // Em dia, mas o mes atual (Jul) pendente
      return ["pago", "pago", "pago", "pago", "pago", "pago", "pendente"]
    case 2: // Um mes atrasado
      return ["pago", "pago", "pago", "pago", "pago", "atrasado", "pendente"]
    case 3: // Bolsista / isento em alguns meses
      return ["isento", "isento", "pago", "pago", "pago", "pago", "pendente"]
    default: // Atrasos recorrentes
      return ["pago", "pago", "atrasado", "pago", "pago", "atrasado", "atrasado"]
  }
}

function iso(ano: number, mes: number, dia: number): string {
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`
}

// Gera o historico de pagamentos de todos os alunos ativos.
function gerarPagamentos(): Pagamento[] {
  const lista: Pagamento[] = []
  alunos.forEach((aluno, i) => {
    const perfil = perfilPagador(i)
    mesesGerados.forEach((mes, m) => {
      const situacao = perfil[m] ?? "pendente"
      const valor = aluno.mensalidade // valor difere entre particular e coletiva (vem da ficha)
      const vencimento = iso(anoAtual, mes, 10)
      const pago = situacao === "pago"
      const forma: FormaPagamento = (["PIX", "Cartão", "Dinheiro", "Transferência"] as const)[i % 4]
      lista.push({
        id: `pg-${aluno.id}-${anoAtual}-${mes}`,
        alunoId: aluno.id,
        mes,
        ano: anoAtual,
        valor: situacao === "isento" ? 0 : valor,
        vencimento,
        situacao,
        dataPagamento: pago ? iso(anoAtual, mes, ((i + m) % 9) + 1) : undefined,
        valorRecebido: pago ? valor : undefined,
        formaPagamento: pago ? forma : undefined,
        responsavelRegistro: pago ? usuarioLogado : undefined,
        observacoes: situacao === "isento" ? "Bolsa integral (isento)" : undefined,
      })
    })
  })
  return lista
}

export const pagamentos: Pagamento[] = gerarPagamentos()

/** Retorna o aluno de um pagamento. */
export function alunoDoPagamento(pg: Pagamento): Aluno | undefined {
  return alunos.find((a) => a.id === pg.alunoId)
}

/** Cores/rotulos por situacao, no estilo tags do jogo. */
export const situacaoInfo: Record<
  SituacaoPagamento,
  { label: string; tag: string; variant: "green" | "gold" | "danger" | "blue" }
> = {
  pago: { label: "Pago", tag: "PG", variant: "green" },
  pendente: { label: "Pendente", tag: "PEN", variant: "gold" },
  atrasado: { label: "Atrasado", tag: "ATR", variant: "danger" },
  isento: { label: "Isento", tag: "ISE", variant: "blue" },
}

/** Formata valor em Reais. */
export function formatarValor(valor: number): string {
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
}

/** Formata data ISO no padrao brasileiro. */
export function formatarDataBR(iso?: string): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR")
}

/**
 * Monta o link do WhatsApp de cobranca com mensagem pre-preenchida (req. 6.3).
 * A mensagem pode ser editada antes do envio na interface.
 */
export function linkCobranca(telefone: string, mensagem: string): string {
  const digitos = telefone.replace(/\D/g, "")
  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}

/** Mensagem padrao de cobranca (editavel). */
export function mensagemCobrancaPadrao(nomeAluno: string, mes: string): string {
  return `Olá, tudo bem? Identificamos que a mensalidade de ${mes} do aluno ${nomeAluno} ainda aparece como pendente. Poderia verificar, por favor?`
}
