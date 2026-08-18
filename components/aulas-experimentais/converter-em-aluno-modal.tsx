"use client"

import { useState } from "react"
import { Check, Trophy, X } from "lucide-react"
import type { AulaExperimental } from "@/lib/aulas-experimentais-data"
import { modalidadeDaTurma } from "@/lib/turmas-data"

const hoje = new Date().toISOString().slice(0, 10)

export function ConverterEmAlunoModal({
  item,
  onConfirmar,
  onCancelar,
}: {
  item: AulaExperimental
  onConfirmar: () => void
  onCancelar: () => void
}) {
  const [mensalidade, setMensalidade] = useState("")
  const modalidade = modalidadeDaTurma(item.turmaInteresse)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="converter-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="panel-bevel w-full max-w-lg overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-primary px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            GOAL!
          </span>
          <h2
            id="converter-titulo"
            className="flex items-center gap-2 font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow"
          >
            <Trophy className="h-4 w-4" strokeWidth={2.5} />
            Converter em aluno
          </h2>
        </header>

        <div className="flex flex-col gap-3 p-4">
          <p className="font-sans text-sm text-muted-foreground text-pretty">
            A matrícula de <span className="font-bold text-foreground">{item.nomeCrianca}</span> foi confirmada. Os
            dados já informados na aula experimental serão reaproveitados no cadastro de aluno — não é preciso
            preencher tudo de novo.
          </p>

          <dl className="w-full divide-y divide-panel-shade rounded-sm border border-panel-edge bg-panel-shade/30">
            {[
              { rotulo: "Aluno", valor: item.nomeCrianca },
              { rotulo: "Idade", valor: item.idade },
              { rotulo: "Responsável", valor: item.nomeResponsavel },
              { rotulo: "Telefone", valor: item.telefone },
              { rotulo: "Turma", valor: `${item.turmaInteresse} • ${modalidade === "particular" ? "Particular" : "Coletivo"}` },
            ].map((l) => (
              <div key={l.rotulo} className="flex items-start justify-between gap-3 px-3 py-2">
                <dt className="font-pixel text-[9px] uppercase tracking-wide text-muted-foreground">{l.rotulo}</dt>
                <dd className="text-right font-sans text-sm font-bold text-foreground text-pretty">{l.valor}</dd>
              </div>
            ))}
          </dl>

          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              Mensalidade (R$)
            </span>
            <input
              type="number"
              min="0"
              autoFocus
              value={mensalidade}
              onChange={(e) => setMensalidade(e.target.value)}
              placeholder="Ex.: 230"
              className="w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2.5 py-1.5 font-sans text-sm font-medium text-foreground inset-bevel placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </label>

          <p className="font-sans text-[11px] text-muted-foreground">
            Data de entrada: {hoje.split("-").reverse().join("/")} (hoje)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-4 py-3">
          <button
            type="button"
            onClick={onCancelar}
            className="flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-5 py-2 font-pixel text-[14px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            Confirmar matrícula
          </button>
        </div>
      </div>
    </div>
  )
}
