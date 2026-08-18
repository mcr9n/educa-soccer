"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Contador +/- de 0 a `max` usado para os criterios lancados manualmente
 * (Comportamento, Participacao, Uniforme, Testes, Eventos, Boletim, Amigo
 * matriculado). Mesmo padrao visual do stepper de gols da Chamada, para
 * manter consistencia entre as telas.
 */
export function StepperNota({
  label,
  value,
  max = 5,
  disabled = false,
  onChange,
  ariaLabel,
}: {
  label: string
  value: number
  max?: number
  disabled?: boolean
  onChange: (value: number) => void
  ariaLabel: string
}) {
  return (
    <div className="flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/40 py-1 pl-1.5 pr-1 inset-bevel">
      <span className="font-pixel text-[10px] uppercase leading-none text-muted-foreground">{label}</span>
      <button
        type="button"
        disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label={`Diminuir ${ariaLabel}`}
        className="flex h-5 w-5 items-center justify-center rounded-sm border border-panel-edge bg-secondary text-secondary-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-3 w-3" strokeWidth={3} />
      </button>
      <span aria-label={ariaLabel} className="w-4 text-center font-sans text-sm font-bold tabular-nums text-foreground">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`Aumentar ${ariaLabel}`}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-sm border border-panel-edge bg-secondary text-secondary-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <Plus className="h-3 w-3" strokeWidth={3} />
      </button>
    </div>
  )
}
