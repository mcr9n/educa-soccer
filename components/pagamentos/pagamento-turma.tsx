"use client"

import { useState } from "react"
import { ChevronDown, Wallet, RotateCcw, History } from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import type { Aluno } from "@/lib/alunos-data"
import {
  type Pagamento,
  type FormaPagamento,
  situacaoInfo,
  formatarValor,
  formatarDataBR,
  meses,
} from "@/lib/pagamentos-data"
import { BotaoCobranca, CobrancaDialog, RegistroDialog } from "./pagamento-dialogs"

export type LinhaPagamento = { aluno: Aluno; pagamento: Pagamento }

export function TurmaPagamentos({
  turma,
  modalidade,
  linhas,
  onRegistrar,
  onReabrir,
}: {
  turma: string
  modalidade: Aluno["modalidade"]
  linhas: LinhaPagamento[]
  onRegistrar: (
    pagamentoId: string,
    dados: {
      dataPagamento: string
      valorRecebido: number
      formaPagamento: FormaPagamento
      responsavelRegistro: string
      observacoes?: string
    },
  ) => void
  onReabrir: (pagamentoId: string) => void
}) {
  const [aberto, setAberto] = useState(true)

  const recebido = linhas
    .filter((l) => l.pagamento.situacao === "pago")
    .reduce((s, l) => s + (l.pagamento.valorRecebido ?? l.pagamento.valor), 0)
  const emAberto = linhas
    .filter((l) => l.pagamento.situacao === "pendente" || l.pagamento.situacao === "atrasado")
    .reduce((s, l) => s + l.pagamento.valor, 0)

  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="flex w-full items-center gap-3 border-b-2 border-panel-shade bg-scoreboard px-3 py-2 text-left"
      >
        <PositionTag
          label={modalidade === "particular" ? "PART" : "COL"}
          variant={modalidade === "particular" ? "gold" : "blue"}
          className="shrink-0"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            {turma}
          </span>
          <span className="mt-1 flex flex-wrap gap-x-3 font-sans text-[11px] font-semibold">
            <span className="text-primary-foreground">Recebido: {formatarValor(recebido)}</span>
            <span className="text-primary-foreground">Em aberto: {formatarValor(emAberto)}</span>
          </span>
        </span>
        <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-primary-foreground">
          {linhas.length}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary-foreground transition-transform ${aberto ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {aberto && (
        <ul className="divide-y divide-panel-shade/60">
          {linhas.map((linha) => (
            <PagamentoRow
              key={linha.pagamento.id}
              linha={linha}
              onRegistrar={onRegistrar}
              onReabrir={onReabrir}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function PagamentoRow({
  linha,
  onRegistrar,
  onReabrir,
}: {
  linha: LinhaPagamento
  onRegistrar: TurmaPagamentosProps["onRegistrar"]
  onReabrir: (pagamentoId: string) => void
}) {
  const { aluno, pagamento } = linha
  const [dialog, setDialog] = useState<"none" | "cobranca" | "registro">("none")
  const [verHistorico, setVerHistorico] = useState(false)
  const info = situacaoInfo[pagamento.situacao]
  const emAberto = pagamento.situacao === "pendente" || pagamento.situacao === "atrasado"

  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <PositionTag label={info.tag} variant={info.variant} className="shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
          <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">
            {meses[pagamento.mes - 1]}/{pagamento.ano} • {formatarValor(pagamento.valor)} • Venc.{" "}
            {formatarDataBR(pagamento.vencimento)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {emAberto && (
            <>
              <BotaoCobranca onClick={() => setDialog("cobranca")} />
              <button
                type="button"
                onClick={() => setDialog("registro")}
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
              >
                <Wallet className="h-3.5 w-3.5" strokeWidth={2.5} />
                Registrar
              </button>
            </>
          )}
          {pagamento.situacao === "pago" && (
            <>
              <button
                type="button"
                onClick={() => setVerHistorico((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
              >
                <History className="h-3.5 w-3.5" strokeWidth={2.5} />
                Detalhes
              </button>
              <button
                type="button"
                onClick={() => onReabrir(pagamento.id)}
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
                Reabrir
              </button>
            </>
          )}
          {pagamento.situacao === "isento" && (
            <span className="font-sans text-xs font-semibold italic text-muted-foreground">Sem cobrança</span>
          )}
        </div>
      </div>

      {/* Detalhes do pagamento registrado (histórico do mês) */}
      {verHistorico && pagamento.situacao === "pago" && (
        <div className="mt-2 grid gap-2 rounded-sm border border-panel-shade bg-panel-shade/20 p-2 sm:grid-cols-2 lg:grid-cols-4">
          <Detalhe label="Data do pagamento" value={formatarDataBR(pagamento.dataPagamento)} />
          <Detalhe label="Valor recebido" value={formatarValor(pagamento.valorRecebido ?? pagamento.valor)} />
          <Detalhe label="Forma" value={pagamento.formaPagamento ?? "—"} />
          <Detalhe label="Registrado por" value={pagamento.responsavelRegistro ?? "—"} />
          {pagamento.observacoes && (
            <div className="sm:col-span-2 lg:col-span-4">
              <Detalhe label="Observações" value={pagamento.observacoes} />
            </div>
          )}
        </div>
      )}

      {dialog === "cobranca" && (
        <CobrancaDialog aluno={aluno} pagamento={pagamento} onClose={() => setDialog("none")} />
      )}
      {dialog === "registro" && (
        <RegistroDialog
          aluno={aluno}
          pagamento={pagamento}
          onClose={() => setDialog("none")}
          onConfirmar={(dados) => onRegistrar(pagamento.id, dados)}
        />
      )}
    </li>
  )
}

function Detalhe({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-sans text-sm font-semibold text-foreground text-pretty">{value}</p>
    </div>
  )
}

type TurmaPagamentosProps = React.ComponentProps<typeof TurmaPagamentos>
