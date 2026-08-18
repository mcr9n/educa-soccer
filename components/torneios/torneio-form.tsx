"use client"

import { useState } from "react"
import { Check, Trophy, X } from "lucide-react"
import { locaisTorneioSugeridos, situacaoTorneioInfo, situacoesTorneio, type SituacaoTorneio, type Torneio } from "@/lib/torneios-data"
import { faixasEtarias } from "@/lib/alunos-data"

type FormState = {
  nome: string
  categoria: string
  dataInicio: string
  dataTermino: string
  local: string
  maxJogadoresPorTime: string
  observacoes: string
  situacao: SituacaoTorneio
}

type Erros = Partial<Record<keyof FormState, string>>

const hoje = new Date().toISOString().slice(0, 10)

const inputClasses =
  "w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2.5 py-1.5 font-sans text-sm font-medium text-foreground inset-bevel placeholder:text-muted-foreground focus:border-gold focus:outline-none"

function Campo({
  label,
  obrigatorio,
  erro,
  className,
  children,
}: {
  label: string
  obrigatorio?: boolean
  erro?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
        {label}
        {obrigatorio && <span className="ml-1 text-danger">*</span>}
      </span>
      {children}
      {erro && (
        <span className="flex items-center gap-1 font-sans text-[11px] font-semibold text-danger">
          <X className="h-3 w-3" strokeWidth={3} />
          {erro}
        </span>
      )}
    </label>
  )
}

/** Modal de cadastro/edicao de torneio (req. 8.1). */
export function TorneioForm({
  torneio,
  onSalvar,
  onCancelar,
}: {
  torneio?: Torneio
  onSalvar: (dados: Omit<Torneio, "id">) => void
  onCancelar: () => void
}) {
  const [form, setForm] = useState<FormState>({
    nome: torneio?.nome ?? "",
    categoria: torneio?.categoria ?? "",
    dataInicio: torneio?.dataInicio ?? hoje,
    dataTermino: torneio?.dataTermino ?? hoje,
    local: torneio?.local ?? "",
    maxJogadoresPorTime: torneio ? String(torneio.maxJogadoresPorTime) : "8",
    observacoes: torneio?.observacoes ?? "",
    situacao: torneio?.situacao ?? "planejamento",
  })
  const [erros, setErros] = useState<Erros>({})

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function validar(): boolean {
    const e: Erros = {}
    if (!form.nome.trim()) e.nome = "Informe o nome do torneio."
    if (!form.categoria.trim()) e.categoria = "Informe a categoria ou faixa etária."
    if (!form.dataInicio) e.dataInicio = "Informe a data de início."
    if (!form.dataTermino) e.dataTermino = "Informe a data de término."
    if (form.dataInicio && form.dataTermino && form.dataTermino < form.dataInicio) {
      e.dataTermino = "A data de término não pode ser antes da data de início."
    }
    if (!form.local.trim()) e.local = "Informe o local do torneio."
    const max = Number(form.maxJogadoresPorTime)
    if (!max || max <= 0) e.maxJogadoresPorTime = "Informe uma quantidade válida."
    setErros(e)
    return Object.keys(e).length === 0
  }

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!validar()) return
    onSalvar({
      nome: form.nome.trim(),
      categoria: form.categoria.trim(),
      dataInicio: form.dataInicio,
      dataTermino: form.dataTermino,
      local: form.local.trim(),
      maxJogadoresPorTime: Number(form.maxJogadoresPorTime),
      observacoes: form.observacoes.trim() || undefined,
      situacao: form.situacao,
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="torneio-form-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancelar}
    >
      <div
        className="panel-bevel flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-md bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            {torneio ? "EDITAR" : "NOVO"}
          </span>
          <h2
            id="torneio-form-titulo"
            className="flex items-center gap-2 font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow"
          >
            <Trophy className="h-4 w-4" strokeWidth={2.5} />
            {torneio ? "Editar torneio" : "Novo torneio"}
          </h2>
        </header>

        <form onSubmit={aoEnviar} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Nome do torneio" obrigatorio erro={erros.nome} className="sm:col-span-2">
              <input
                autoFocus
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Ex.: 1ª Copa Educa Soccer"
                className={inputClasses}
              />
            </Campo>

            <Campo label="Categoria ou faixa etária" obrigatorio erro={erros.categoria}>
              <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)} className={inputClasses}>
                {faixasEtarias.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Quantidade máxima de jogadores por time" obrigatorio erro={erros.maxJogadoresPorTime}>
              <input
                type="number"
                min="1"
                value={form.maxJogadoresPorTime}
                onChange={(e) => set("maxJogadoresPorTime", e.target.value)}
                className={inputClasses}
              />
            </Campo>

            <Campo label="Data de início" obrigatorio erro={erros.dataInicio}>
              <input
                type="date"
                value={form.dataInicio}
                onChange={(e) => set("dataInicio", e.target.value)}
                className={inputClasses}
              />
            </Campo>

            <Campo label="Data de término" obrigatorio erro={erros.dataTermino}>
              <input
                type="date"
                min={form.dataInicio}
                value={form.dataTermino}
                onChange={(e) => set("dataTermino", e.target.value)}
                className={inputClasses}
              />
            </Campo>

            <Campo label="Local" obrigatorio erro={erros.local} className="sm:col-span-2">
              <input
                value={form.local}
                onChange={(e) => set("local", e.target.value)}
                placeholder="Ex.: Quadra Sudoeste"
                list="locais-torneio-sugeridos"
                className={inputClasses}
              />
              <datalist id="locais-torneio-sugeridos">
                {locaisTorneioSugeridos.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </Campo>

            <Campo label="Situação" className="sm:col-span-2">
              <select
                value={form.situacao}
                onChange={(e) => set("situacao", e.target.value as SituacaoTorneio)}
                className={inputClasses}
              >
                {situacoesTorneio.map((s) => (
                  <option key={s} value={s}>
                    {situacaoTorneioInfo[s].label}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Observações (opcional)" className="sm:col-span-2">
              <textarea
                value={form.observacoes}
                onChange={(e) => set("observacoes", e.target.value)}
                rows={3}
                placeholder="Regulamento, premiação, informações gerais..."
                className={`${inputClasses} resize-y`}
              />
            </Campo>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t-2 border-panel-shade pt-3">
            <button
              type="button"
              onClick={onCancelar}
              className="flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-5 py-2 font-pixel text-[14px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
            >
              <Check className="h-4 w-4" strokeWidth={3} />
              {torneio ? "Salvar alterações" : "Criar torneio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
