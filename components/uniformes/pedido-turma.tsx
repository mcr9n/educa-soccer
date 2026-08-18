"use client"

import { useState } from "react"
import { ChevronDown, Wallet, Truck, Banknote, Pencil, Trash2 } from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import type { Aluno } from "@/lib/alunos-data"
import { formatarValor, formatarDataBR } from "@/lib/pagamentos-data"
import type { PedidoUniforme } from "@/lib/uniformes-data"

export type LinhaPedido = { aluno: Aluno; pedido: PedidoUniforme }

export function TurmaPedidos({
  turma,
  linhas,
  onTogglePago,
  onToggleEntregue,
  onToggleRepasse,
  onEditar,
  onExcluir,
}: {
  turma: string
  linhas: LinhaPedido[]
  onTogglePago: (pedidoId: string) => void
  onToggleEntregue: (pedidoId: string) => void
  onToggleRepasse: (pedidoId: string) => void
  onEditar: (pedido: PedidoUniforme) => void
  onExcluir: (pedidoId: string) => void
}) {
  const [aberto, setAberto] = useState(true)
  const pendentesPagamento = linhas.filter((l) => !l.pedido.pago).length
  const pendentesEntrega = linhas.filter((l) => !l.pedido.entregue).length

  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="flex w-full items-center gap-3 border-b-2 border-panel-shade bg-scoreboard px-3 py-2 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            {turma}
          </span>
          <span className="mt-1 flex flex-wrap gap-x-3 font-sans text-[11px] font-semibold">
            <span className="text-primary-foreground">
              {pendentesPagamento > 0 ? `${pendentesPagamento} pagamento(s) pendente(s)` : "Pagamentos em dia"}
            </span>
            <span className="text-primary-foreground">
              {pendentesEntrega > 0 ? `${pendentesEntrega} entrega(s) pendente(s)` : "Todos entregues"}
            </span>
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
            <PedidoRow
              key={linha.pedido.id}
              linha={linha}
              onTogglePago={onTogglePago}
              onToggleEntregue={onToggleEntregue}
              onToggleRepasse={onToggleRepasse}
              onEditar={onEditar}
              onExcluir={onExcluir}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function ToggleSituacao({
  ativo,
  labelAtivo,
  labelInativo,
  icon: Icon,
  onClick,
}: {
  ativo: boolean
  labelAtivo: string
  labelInativo: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm border-2 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none ${
        ativo
          ? "border-success bg-success text-success-foreground hover:border-danger hover:bg-danger hover:text-white"
          : "border-gold bg-gold text-gold-foreground hover:-translate-y-0.5"
      }`}
      title={ativo ? `Marcar como ${labelInativo.toLowerCase()}` : `Marcar como ${labelAtivo.toLowerCase()}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {ativo ? labelAtivo : labelInativo}
    </button>
  )
}

function PedidoRow({
  linha,
  onTogglePago,
  onToggleEntregue,
  onToggleRepasse,
  onEditar,
  onExcluir,
}: {
  linha: LinhaPedido
  onTogglePago: (pedidoId: string) => void
  onToggleEntregue: (pedidoId: string) => void
  onToggleRepasse: (pedidoId: string) => void
  onEditar: (pedido: PedidoUniforme) => void
  onExcluir: (pedidoId: string) => void
}) {
  const { aluno, pedido } = linha

  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <PositionTag label={`Nº ${pedido.numero}`} variant="blue" className="shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
          <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">
            {aluno.responsavel} • Tam. {pedido.tamanho} • {formatarValor(pedido.valor)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <ToggleSituacao
            ativo={pedido.pago}
            labelAtivo="Pago"
            labelInativo="Pendente"
            icon={Wallet}
            onClick={() => onTogglePago(pedido.id)}
          />
          <ToggleSituacao
            ativo={pedido.entregue}
            labelAtivo="Entregue"
            labelInativo="A entregar"
            icon={Truck}
            onClick={() => onToggleEntregue(pedido.id)}
          />
          <ToggleSituacao
            ativo={pedido.repassadoJP}
            labelAtivo="Repasse OK"
            labelInativo="Repasse pend."
            icon={Banknote}
            onClick={() => onToggleRepasse(pedido.id)}
          />
          <button
            type="button"
            onClick={() => onEditar(pedido)}
            aria-label="Editar pedido"
            className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 p-1.5 text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => onExcluir(pedido.id)}
            aria-label="Excluir pedido"
            className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 p-1.5 text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {(pedido.dataPagamento || pedido.dataEntrega || pedido.dataRepasse || pedido.observacoes) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 rounded-sm border border-panel-shade bg-panel-shade/20 px-2 py-1.5 font-sans text-[11px] text-muted-foreground">
          {pedido.dataPagamento && <span>Pago em {formatarDataBR(pedido.dataPagamento)}</span>}
          {pedido.dataEntrega && <span>Entregue em {formatarDataBR(pedido.dataEntrega)}</span>}
          {pedido.dataRepasse && <span>Repassado em {formatarDataBR(pedido.dataRepasse)}</span>}
          {pedido.observacoes && <span className="text-pretty">Obs.: {pedido.observacoes}</span>}
        </div>
      )}
    </li>
  )
}
