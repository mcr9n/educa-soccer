"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import {
  type AulaExperimental,
  type OrigemContato,
  formatarTelefone,
  origensContato,
  situacoesContato,
  turmasDisponiveis,
} from "@/lib/aulas-experimentais-data"

type FormState = {
  nomeCrianca: string
  idade: string
  nomeResponsavel: string
  telefone: string
  dataPrimeiroContato: string
  turmaInteresse: string
  origemContato: OrigemContato
  dataAulaExperimental: string
  situacao: AulaExperimental["situacao"]
  observacoes: string
}

type Erros = Partial<Record<keyof FormState, string>>

const hoje = new Date().toISOString().slice(0, 10)

const estadoInicial: FormState = {
  nomeCrianca: "",
  idade: "",
  nomeResponsavel: "",
  telefone: "",
  dataPrimeiroContato: hoje,
  turmaInteresse: "",
  origemContato: "Indicação",
  dataAulaExperimental: "",
  situacao: "Novo contato",
  observacoes: "",
}

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

export function NovoContatoForm({
  onSalvar,
  onCancelar,
}: {
  onSalvar: (dados: Omit<AulaExperimental, "id">) => void
  onCancelar: () => void
}) {
  const [form, setForm] = useState<FormState>(estadoInicial)
  const [erros, setErros] = useState<Erros>({})

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function validar(): boolean {
    const e: Erros = {}
    if (!form.nomeCrianca.trim()) e.nomeCrianca = "Informe o nome da criança."
    if (!form.idade.trim()) e.idade = "Informe a idade da criança."
    if (!form.nomeResponsavel.trim()) e.nomeResponsavel = "Informe o nome do responsável."
    if (form.telefone.replace(/\D/g, "").length < 10) e.telefone = "Telefone incompleto."
    if (!form.dataPrimeiroContato) e.dataPrimeiroContato = "Informe a data do primeiro contato."
    if (!form.turmaInteresse) e.turmaInteresse = "Selecione a turma de interesse."
    setErros(e)
    return Object.keys(e).length === 0
  }

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!validar()) return
    onSalvar({
      nomeCrianca: form.nomeCrianca.trim(),
      idade: form.idade.trim(),
      nomeResponsavel: form.nomeResponsavel.trim(),
      telefone: form.telefone,
      dataPrimeiroContato: form.dataPrimeiroContato,
      turmaInteresse: form.turmaInteresse,
      origemContato: form.origemContato,
      dataAulaExperimental: form.dataAulaExperimental || null,
      situacao: form.situacao,
      observacoes: form.observacoes.trim(),
    })
    setForm(estadoInicial)
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo label="Nome da criança" obrigatorio erro={erros.nomeCrianca}>
          <input
            value={form.nomeCrianca}
            onChange={(e) => set("nomeCrianca", e.target.value)}
            placeholder="Ex.: João Pedro"
            className={inputClasses}
          />
        </Campo>

        <Campo label="Idade" obrigatorio erro={erros.idade}>
          <input
            value={form.idade}
            onChange={(e) => set("idade", e.target.value)}
            placeholder="Ex.: 7 anos"
            className={inputClasses}
          />
        </Campo>

        <Campo label="Nome do responsável" obrigatorio erro={erros.nomeResponsavel}>
          <input
            value={form.nomeResponsavel}
            onChange={(e) => set("nomeResponsavel", e.target.value)}
            placeholder="Ex.: Maria da Silva"
            className={inputClasses}
          />
        </Campo>

        <Campo label="Telefone do responsável" obrigatorio erro={erros.telefone}>
          <input
            inputMode="tel"
            value={form.telefone}
            onChange={(e) => set("telefone", formatarTelefone(e.target.value))}
            placeholder="(61) 99999-9999"
            className={inputClasses}
          />
        </Campo>

        <Campo label="Data do primeiro contato" obrigatorio erro={erros.dataPrimeiroContato}>
          <input
            type="date"
            max={hoje}
            value={form.dataPrimeiroContato}
            onChange={(e) => set("dataPrimeiroContato", e.target.value)}
            className={inputClasses}
          />
        </Campo>

        <Campo label="Origem do contato">
          <select
            value={form.origemContato}
            onChange={(e) => set("origemContato", e.target.value as OrigemContato)}
            className={inputClasses}
          >
            {origensContato.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Turma de interesse" obrigatorio erro={erros.turmaInteresse}>
          <select
            value={form.turmaInteresse}
            onChange={(e) => set("turmaInteresse", e.target.value)}
            className={inputClasses}
          >
            <option value="">Selecione...</option>
            {turmasDisponiveis.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Data da aula experimental (opcional)">
          <input
            type="date"
            value={form.dataAulaExperimental}
            onChange={(e) => set("dataAulaExperimental", e.target.value)}
            className={inputClasses}
          />
        </Campo>

        <Campo label="Situação do atendimento" className="sm:col-span-2">
          <select
            value={form.situacao}
            onChange={(e) => set("situacao", e.target.value as AulaExperimental["situacao"])}
            className={inputClasses}
          >
            {situacoesContato.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Observações (opcional)" className="sm:col-span-2">
          <textarea
            value={form.observacoes}
            onChange={(e) => set("observacoes", e.target.value)}
            rows={3}
            placeholder="Preferências de horário, detalhes da conversa, etc."
            className={`${inputClasses} resize-y`}
          />
        </Campo>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
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
          Registrar contato
        </button>
      </div>
    </form>
  )
}
