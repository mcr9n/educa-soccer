"use client"

import { useState } from "react"
import { MessageCircle, Check, Send } from "lucide-react"
import {
  type Pagamento,
  type FormaPagamento,
  formasPagamento,
  formatarValor,
  linkCobranca,
  mensagemCobrancaPadrao,
  meses,
  usuarioLogado,
} from "@/lib/pagamentos-data"
import type { Aluno } from "@/lib/alunos-data"
import { ModalShell } from "@/components/shared/modal-shell"

/** Diálogo de cobrança via WhatsApp com mensagem editável (req. 6.3). */
export function CobrancaDialog({
  aluno,
  pagamento,
  onClose,
}: {
  aluno: Aluno
  pagamento: Pagamento
  onClose: () => void
}) {
  const [mensagem, setMensagem] = useState(mensagemCobrancaPadrao(aluno.nome, meses[pagamento.mes - 1]))

  return (
    <ModalShell titulo="Cobrança via WhatsApp" tag="ZAP" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="rounded-sm border border-panel-shade bg-panel-shade/30 p-2">
          <p className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">Responsável</p>
          <p className="font-sans text-sm font-bold text-foreground">{aluno.responsavel}</p>
          <p className="mt-1 font-sans text-xs text-muted-foreground">
            {aluno.telefone} • {meses[pagamento.mes - 1]}/{pagamento.ano} • {formatarValor(pagamento.valor)}
          </p>
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">
            Mensagem (edite antes de enviar)
          </span>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={5}
            className="resize-none rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm leading-relaxed text-foreground inset-bevel focus:border-gold focus:outline-none"
          />
        </label>

        <a
          href={linkCobranca(aluno.telefone, mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-3 py-2 font-pixel text-[9px] uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
          Abrir no WhatsApp
        </a>
      </div>
    </ModalShell>
  )
}

/** Diálogo de registro de pagamento (req. 6.2). */
export function RegistroDialog({
  aluno,
  pagamento,
  onClose,
  onConfirmar,
}: {
  aluno: Aluno
  pagamento: Pagamento
  onClose: () => void
  onConfirmar: (dados: {
    dataPagamento: string
    valorRecebido: number
    formaPagamento: FormaPagamento
    responsavelRegistro: string
    observacoes?: string
  }) => void
}) {
  const hoje = new Date().toISOString().slice(0, 10)
  const [dataPagamento, setDataPagamento] = useState(hoje)
  const [valorRecebido, setValorRecebido] = useState(String(pagamento.valor))
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("PIX")
  const [responsavel, setResponsavel] = useState(usuarioLogado)
  const [observacoes, setObservacoes] = useState("")

  function confirmar() {
    onConfirmar({
      dataPagamento,
      valorRecebido: Number(valorRecebido) || pagamento.valor,
      formaPagamento,
      responsavelRegistro: responsavel.trim() || usuarioLogado,
      observacoes: observacoes.trim() || undefined,
    })
    onClose()
  }

  return (
    <ModalShell titulo="Registrar pagamento" tag="PG" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="rounded-sm border border-panel-shade bg-panel-shade/30 p-2">
          <p className="font-sans text-sm font-bold text-foreground">{aluno.nome}</p>
          <p className="mt-1 font-sans text-xs text-muted-foreground">
            {meses[pagamento.mes - 1]}/{pagamento.ano} • Venc. dia 10 • {formatarValor(pagamento.valor)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Campo label="Data do pagamento">
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              className="w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground focus:border-gold focus:outline-none"
            />
          </Campo>
          <Campo label="Valor recebido (R$)">
            <input
              type="number"
              value={valorRecebido}
              onChange={(e) => setValorRecebido(e.target.value)}
              className="w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground focus:border-gold focus:outline-none"
            />
          </Campo>
          <Campo label="Forma de pagamento">
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
              className="w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground focus:border-gold focus:outline-none"
            >
              {formasPagamento.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Responsável pelo registro">
            <input
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground focus:border-gold focus:outline-none"
            />
          </Campo>
        </div>

        <Campo label="Observações (opcional)">
          <input
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex.: pagamento parcial, desconto..."
            className="w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
        </Campo>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirmar}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-3 py-2 font-pixel text-[9px] uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            Confirmar pagamento
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-pixel text-[9px] uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

/** Botão reutilizável de cobrança (abre o CobrancaDialog). */
export function BotaoCobranca({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
    >
      <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
      Cobrar
    </button>
  )
}
