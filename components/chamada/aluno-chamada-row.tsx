"use client"

import { cn } from "@/lib/utils"
import type { Aluno } from "@/lib/alunos-data"
import { ordemStatusChamada, statusChamadaInfo, type StatusChamada } from "@/lib/chamada-data"

const variantAtivo: Record<string, string> = {
  green: "border-success bg-success text-success-foreground",
  danger: "border-danger bg-danger text-white",
  gold: "border-gold bg-gold text-gold-foreground",
  blue: "border-scoreboard bg-scoreboard text-primary-foreground",
  default: "border-panel-edge bg-secondary text-secondary-foreground",
}

export function AlunoChamadaRow({
  aluno,
  status,
  onChange,
}: {
  aluno: Aluno
  status: StatusChamada
  onChange: (status: StatusChamada) => void
}) {
  return (
    <li className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
        <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">Responsável: {aluno.responsavel}</p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5" role="radiogroup" aria-label={`Situação de ${aluno.nome}`}>
        {ordemStatusChamada.map((s) => {
          const info = statusChamadaInfo[s]
          const ativo = status === s
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => onChange(s)}
              title={info.label}
              className={cn(
                "rounded-sm border-2 px-2 py-1 font-pixel text-[13px] font-bold uppercase leading-none transition-colors focus:outline-none",
                ativo
                  ? variantAtivo[info.variant]
                  : "border-panel-edge bg-panel-shade/40 text-muted-foreground hover:border-gold hover:text-gold",
              )}
            >
              {info.tag}
            </button>
          )
        })}
      </div>
    </li>
  )
}
