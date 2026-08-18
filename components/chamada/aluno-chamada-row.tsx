"use client"

import { Clock, Minus, Plus, Timer } from "lucide-react"
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
  bloqueada = false,
  onChange,
  onChangeGols,
  onChangePontualidade,
}: {
  aluno: Aluno
  status: StatusChamada
  gols: number
  pontualidade: Pontualidade
  /** Ficha ja salva e ainda nao reaberta para edicao: todos os controles ficam somente leitura. */
  bloqueada?: boolean
  onChange: (status: StatusChamada) => void
  onChangeGols: (gols: number) => void
  onChangePontualidade: (pontualidade: Pontualidade) => void
}) {
  const presente = status === "presente"
  const golsEditavel = presente && !bloqueada

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
          <div className="flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/40 py-1 pl-1.5 pr-1 inset-bevel">
            <span className="font-pixel text-[10px] uppercase leading-none text-muted-foreground">Gols</span>
            <button
              type="button"
              disabled={!golsEditavel || gols <= 0}
              onClick={() => onChangeGols(Math.max(0, gols - 1))}
              aria-label={`Diminuir gols de ${aluno.nome}`}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-panel-edge bg-secondary text-secondary-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none disabled:pointer-events-none disabled:opacity-40 sm:h-5 sm:w-5"
            >
              <Minus className="h-3.5 w-3.5 sm:h-3 sm:w-3" strokeWidth={3} />
            </button>
            <span
              aria-label={`Gols de ${aluno.nome}`}
              className="w-5 text-center font-sans text-sm font-bold tabular-nums text-foreground"
            >
              {gols}
            </span>
            <button
              type="button"
              disabled={!golsEditavel}
              onClick={() => onChangeGols(Math.min(20, gols + 1))}
              aria-label={`Aumentar gols de ${aluno.nome}`}
              className="flex h-8 w-8 items-center justify-center rounded-sm border border-panel-edge bg-secondary text-secondary-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none disabled:pointer-events-none disabled:opacity-40 sm:h-5 sm:w-5"
            >
              <Plus className="h-3.5 w-3.5 sm:h-3 sm:w-3" strokeWidth={3} />
            </button>
          </div>

          <button
            type="button"
            disabled={!golsEditavel}
            onClick={() => onChangePontualidade(pontualidade === "atrasado" ? "no_horario" : "atrasado")}
            title={pontualidade === "atrasado" ? "Chegou atrasado" : "Chegou no horário"}
            aria-pressed={pontualidade === "atrasado"}
            className={cn(
              "inline-flex min-h-9 items-center gap-1 rounded-sm border-2 px-2.5 py-1.5 font-sans text-[11px] font-bold uppercase leading-none transition-colors focus:outline-none disabled:pointer-events-none sm:min-h-0 sm:px-1.5 sm:py-1",
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

        <div
          className={cn(
            "flex flex-wrap gap-1.5 transition-opacity",
            bloqueada && "pointer-events-none opacity-50",
          )}
          role="radiogroup"
          aria-label={`Situação de ${aluno.nome}`}
        >
          {ordemStatusChamada.map((s) => {
            const info = statusChamadaInfo[s]
            const ativo = status === s
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={ativo}
                disabled={bloqueada}
                onClick={() => onChange(s)}
                title={info.label}
                className={cn(
                  "min-h-10 min-w-10 rounded-sm border-2 px-2.5 py-2 font-pixel text-[13px] font-bold uppercase leading-none transition-colors focus:outline-none sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-1",
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
