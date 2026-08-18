"use client"

import { Clock, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Aluno } from "@/lib/alunos-data"
import { ordemStatusChamada, statusChamadaInfo, type StatusChamada, type Pontualidade } from "@/lib/chamada-data"

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
  gols,
  pontualidade,
  onChange,
  onChangeGols,
  onChangePontualidade,
}: {
  aluno: Aluno
  status: StatusChamada
  gols: number
  pontualidade: Pontualidade
  onChange: (status: StatusChamada) => void
  onChangeGols: (gols: number) => void
  onChangePontualidade: (pontualidade: Pontualidade) => void
}) {
  const presente = status === "presente"

  return (
    <li className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
        <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">Responsável: {aluno.responsavel}</p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {/* Gols e pontualidade (req. 12.1 e 12.3): opcionais, so fazem sentido com presenca. */}
        <div
          className={cn(
            "flex items-center gap-1.5 transition-opacity",
            presente ? "opacity-100" : "pointer-events-none opacity-30",
          )}
        >
          <label className="flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/40 px-1.5 py-1 inset-bevel focus-within:border-gold">
            <span className="font-pixel text-[10px] uppercase leading-none text-muted-foreground">Gols</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={20}
              disabled={!presente}
              value={gols}
              onChange={(e) => onChangeGols(Math.max(0, Number(e.target.value) || 0))}
              aria-label={`Gols de ${aluno.nome}`}
              className="w-9 bg-transparent font-sans text-xs font-bold text-foreground focus:outline-none"
            />
          </label>

          <button
            type="button"
            disabled={!presente}
            onClick={() => onChangePontualidade(pontualidade === "atrasado" ? "no_horario" : "atrasado")}
            title={pontualidade === "atrasado" ? "Chegou atrasado" : "Chegou no horário"}
            aria-pressed={pontualidade === "atrasado"}
            className={cn(
              "inline-flex items-center gap-1 rounded-sm border-2 px-1.5 py-1 font-sans text-[11px] font-bold uppercase leading-none transition-colors focus:outline-none",
              pontualidade === "atrasado"
                ? "border-gold bg-gold text-gold-foreground"
                : "border-panel-edge bg-panel-shade/40 text-muted-foreground hover:border-success hover:text-success",
            )}
          >
            {pontualidade === "atrasado" ? (
              <Timer className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <Clock className="h-3 w-3" strokeWidth={2.5} />
            )}
            {pontualidade === "atrasado" ? "Atrasado" : "No horário"}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Situação de ${aluno.nome}`}>
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
      </div>
    </li>
  )
}
