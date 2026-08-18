"use client"

import { useState } from "react"
import { Check, Shield, X } from "lucide-react"
import type { TimeTorneio, Torneio } from "@/lib/torneios-data"
import { SeletorJogadores } from "./seletor-jogadores"
import { faixasEtarias } from "@/lib/alunos-data"

type FormState = {
  nome: string
  faixaEtaria: string
  treinador: string
  observacoes: string
}

type Erros = Partial<Record<keyof FormState, string>>

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

/**
 * Modal de cadastro/edicao de um time dentro de um torneio (req. 8.2):
 * nome, faixa etaria, treinador responsavel, lista de jogadores e
 * observacoes. A selecao de jogadores usa o SeletorJogadores.
 */
export function TimeForm({
  torneio,
  timesDoTorneio,
  time,
  onSalvar,
  onCancelar,
}: {
  torneio: Torneio
  timesDoTorneio: TimeTorneio[]
  time?: TimeTorneio
  onSalvar: (dados: Omit<TimeTorneio, "id" | "torneioId">) => void
  onCancelar: () => void
}) {
  const [form, setForm] = useState<FormState>({
    nome: time?.nome ?? "",
    faixaEtaria: time?.faixaEtaria ?? torneio.categoria,
    treinador: time?.treinador ?? "",
    observacoes: time?.observacoes ?? "",
  })
  const [jogadoresIds, setJogadoresIds] = useState<string[]>(time?.jogadoresIds ?? [])
  const [erros, setErros] = useState<Erros>({})

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function alternarJogador(id: string) {
    setJogadoresIds((atual) => (atual.includes(id) ? atual.filter((j) => j !== id) : [...atual, id]))
  }

  function validar(): boolean {
    const e: Erros = {}
    if (!form.nome.trim()) e.nome = "Informe o nome do time."
    if (!form.treinador.trim()) e.treinador = "Informe o treinador responsável."
    setErros(e)
    return Object.keys(e).length === 0
  }

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!validar()) return
    onSalvar({
      nome: form.nome.trim(),
      faixaEtaria: form.faixaEtaria.trim() || torneio.categoria,
      treinador: form.treinador.trim(),
      observacoes: form.observacoes.trim() || undefined,
      jogadoresIds,
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-form-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancelar}
    >
      <div
        className="panel-bevel flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-md bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            {time ? "EDITAR" : "NOVO"}
          </span>
          <h2
            id="time-form-titulo"
            className="flex items-center gap-2 font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow"
          >
            <Shield className="h-4 w-4" strokeWidth={2.5} />
            {time ? "Editar time" : "Novo time"} — {torneio.nome}
          </h2>
        </header>

        <form onSubmit={aoEnviar} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Nome do time" obrigatorio erro={erros.nome}>
              <input
                autoFocus
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Ex.: Amarelo"
                className={inputClasses}
              />
            </Campo>

            <Campo label="Categoria ou faixa etária" obrigatorio erro={erros.faixaEtaria}>
              <select value={form.faixaEtaria} onChange={(e) => set("faixaEtaria", e.target.value)} className={inputClasses}>
                {faixasEtarias.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Treinador responsável" obrigatorio erro={erros.treinador}>
              <input
                value={form.treinador}
                onChange={(e) => set("treinador", e.target.value)}
                placeholder="Ex.: Prof. Rafael Duarte"
                className={inputClasses}
              />
            </Campo>

            <Campo label="Observações (opcional)">
              <input
                value={form.observacoes}
                onChange={(e) => set("observacoes", e.target.value)}
                placeholder="Ex.: uniforme reserva, capitão..."
                className={inputClasses}
              />
            </Campo>
          </div>

          <div className="mt-4">
            <p className="mb-1.5 font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              Jogadores do time
            </p>
            <SeletorJogadores
              torneio={torneio}
              jogadoresSelecionados={jogadoresIds}
              onToggleJogador={alternarJogador}
              timeAtualId={time?.id}
              timesDoTorneio={timesDoTorneio}
              limite={torneio.maxJogadoresPorTime}
            />
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
              {time ? "Salvar alterações" : "Criar time"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
