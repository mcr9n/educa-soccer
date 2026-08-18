"use client"

import { useMemo, useState } from "react"
import { Check, X } from "lucide-react"
import { alunos } from "@/lib/alunos-data"
import {
  tamanhosUniforme,
  valorPadraoUniforme,
  turmaDoPedido,
  numeroEmUsoNaTurma,
  type PedidoUniforme,
  type TamanhoUniforme,
} from "@/lib/uniformes-data"

/** Fundo escuro + painel centralizado, no mesmo estilo dos demais modais do sistema. */
function ModalShell({
  titulo,
  tag,
  onClose,
  children,
}: {
  titulo: string
  tag: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={onClose}
    >
      <div
        className="panel-bevel w-full max-w-md overflow-hidden rounded-md bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
              {tag}
            </span>
            <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
              {titulo}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-sm border border-panel-edge bg-panel-shade/50 p-1 text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            <X className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
        </header>
        <div className="p-3">{children}</div>
      </div>
    </div>
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

const inputCls =
  "w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground inset-bevel focus:border-gold focus:outline-none"

/** Formulario de criacao/edicao de pedido de uniforme (req. 11). */
export function PedidoUniformeForm({
  pedidoEditando,
  pedidosExistentes,
  onClose,
  onSalvar,
}: {
  pedidoEditando?: PedidoUniforme
  pedidosExistentes: PedidoUniforme[]
  onClose: () => void
  onSalvar: (dados: Omit<PedidoUniforme, "id" | "pago" | "entregue" | "repassadoJP">) => void
}) {
  const alunosAtivos = useMemo(
    () => [...alunos].filter((a) => a.ativo).sort((a, b) => a.nome.localeCompare(b.nome)),
    [],
  )

  const [alunoId, setAlunoId] = useState(pedidoEditando?.alunoId ?? alunosAtivos[0]?.id ?? "")
  const [tamanho, setTamanho] = useState<TamanhoUniforme>(pedidoEditando?.tamanho ?? "10")
  const [numero, setNumero] = useState(pedidoEditando ? String(pedidoEditando.numero) : "")
  const [valor, setValor] = useState(String(pedidoEditando?.valor ?? valorPadraoUniforme))
  const [observacoes, setObservacoes] = useState(pedidoEditando?.observacoes ?? "")
  const [erro, setErro] = useState<string | null>(null)

  const alunoSelecionado = alunos.find((a) => a.id === alunoId)

  function confirmar() {
    const numeroValido = Number(numero)
    if (!alunoId) {
      setErro("Selecione o aluno.")
      return
    }
    if (!numeroValido || numeroValido <= 0) {
      setErro("Informe um número de uniforme válido.")
      return
    }
    if (!alunoSelecionado) {
      setErro("Aluno não encontrado.")
      return
    }
    // Validacao de duplicidade (req. 11): mesmo numero na mesma turma.
    const conflito = numeroEmUsoNaTurma(
      pedidosExistentes,
      alunoSelecionado.turma,
      numeroValido,
      pedidoEditando?.id,
    )
    if (conflito) {
      const alunoConflito = alunos.find((a) => a.id === conflito.alunoId)
      setErro(
        `O número ${numeroValido} já está em uso por ${alunoConflito?.nome ?? "outro aluno"} nesta turma.`,
      )
      return
    }
    setErro(null)
    onSalvar({
      alunoId,
      tamanho,
      numero: numeroValido,
      valor: Number(valor) || valorPadraoUniforme,
      observacoes: observacoes.trim() || undefined,
    })
    onClose()
  }

  return (
    <ModalShell titulo={pedidoEditando ? "Editar pedido" : "Novo pedido de uniforme"} tag="UNI" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Campo label="Aluno">
          <select
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
            className={`${inputCls} font-semibold`}
          >
            {alunosAtivos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </Campo>

        {alunoSelecionado && (
          <div className="rounded-sm border border-panel-shade bg-panel-shade/30 p-2">
            <p className="font-sans text-xs text-muted-foreground">
              Responsável: <span className="font-semibold text-foreground">{alunoSelecionado.responsavel}</span>
            </p>
            <p className="mt-0.5 font-sans text-xs text-muted-foreground">
              Turma: <span className="font-semibold text-foreground">{alunoSelecionado.turma}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Campo label="Tamanho">
            <select
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value as TamanhoUniforme)}
              className={`${inputCls} font-semibold`}
            >
              {tamanhosUniforme.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Número do uniforme">
            <input
              type="number"
              min={1}
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ex.: 10"
              className={inputCls}
            />
          </Campo>
        </div>

        <Campo label="Valor (R$)">
          <input
            type="number"
            min={0}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className={inputCls}
          />
        </Campo>

        <Campo label="Observações (opcional)">
          <input
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex.: combinado pagamento em dinheiro..."
            className={`${inputCls} placeholder:text-muted-foreground`}
          />
        </Campo>

        {erro && (
          <p className="rounded-sm border border-danger bg-danger/10 px-2 py-1.5 font-sans text-xs font-semibold text-danger">
            {erro}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirmar}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {pedidoEditando ? "Salvar alterações" : "Criar pedido"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
