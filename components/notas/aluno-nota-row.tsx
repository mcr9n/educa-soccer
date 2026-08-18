"use client"

import { Clock, HelpCircle, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Aluno } from "@/lib/alunos-data"
import type { PresencaAluno } from "@/lib/chamada-data"
import {
  pontosPresenca,
  pontosPontualidade,
  pontuacaoPresenca,
  pontuacaoPontualidade,
  statusGeraAvaliacao,
  pontuacaoMaximaDiaria,
  type NotaDiaria,
} from "@/lib/notas-data"
import { StepperNota } from "./stepper-nota"

export function AlunoNotaRow({
  aluno,
  presenca,
  notaDiaria,
  onChange,
}: {
  aluno: Aluno
  /** Presenca do aluno na chamada da mesma turma+data (fonte da Presenca/Pontualidade). */
  presenca: PresencaAluno | undefined
  notaDiaria: NotaDiaria | undefined
  onChange: (campo: "comportamento" | "participacao" | "uniforme", valor: number) => void
}) {
  const avaliavel = statusGeraAvaliacao(presenca?.status ?? "nao_se_aplica")
  const presencaPontos = pontosPresenca(presenca)
  const pontualidadePontos = pontosPontualidade(presenca)
  const comportamento = notaDiaria?.comportamento ?? 0
  const participacao = notaDiaria?.participacao ?? 0
  const uniforme = notaDiaria?.uniforme ?? 0
  const totalDia =
    presencaPontos + pontualidadePontos + comportamento + participacao + uniforme
  const totalMaximo = pontuacaoPresenca + pontuacaoPontualidade + pontuacaoMaximaDiaria * 3

  if (!avaliavel) {
    return (
      <li className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
          <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">Responsável: {aluno.responsavel}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-sm border border-panel-edge bg-panel-shade/30 px-2 py-1.5 text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Sem avaliação nesta data</span>
        </div>
      </li>
    )
  }

  return (
    <li className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
        <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">Responsável: {aluno.responsavel}</p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {/* Presenca e pontualidade vem da chamada - somente leitura aqui (req. 14). */}
        <div
          className="flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/20 px-1.5 py-1"
          title="Preenchido automaticamente pela Chamada"
        >
          <span className="font-pixel text-[10px] uppercase leading-none text-muted-foreground">Presença</span>
          <span
            className={cn(
              "font-sans text-xs font-bold tabular-nums",
              presencaPontos > 0 ? "text-success" : "text-danger",
            )}
          >
            {presencaPontos}/{pontuacaoPresenca}
          </span>
        </div>

        <div
          className="flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/20 px-1.5 py-1"
          title="Preenchido automaticamente pela Chamada"
        >
          {pontualidadePontos > 0 ? (
            <Clock className="h-3 w-3 text-success" strokeWidth={2.5} />
          ) : (
            <Timer className="h-3 w-3 text-muted-foreground" strokeWidth={2.5} />
          )}
          <span
            className={cn(
              "font-sans text-xs font-bold tabular-nums",
              pontualidadePontos > 0 ? "text-success" : "text-muted-foreground",
            )}
          >
            {pontualidadePontos}/{pontuacaoPontualidade}
          </span>
        </div>

        <StepperNota
          label="Comp"
          value={comportamento}
          onChange={(v) => onChange("comportamento", v)}
          ariaLabel={`Comportamento de ${aluno.nome}`}
        />
        <StepperNota
          label="Part"
          value={participacao}
          onChange={(v) => onChange("participacao", v)}
          ariaLabel={`Participação de ${aluno.nome}`}
        />
        <StepperNota
          label="Unif"
          value={uniforme}
          onChange={(v) => onChange("uniforme", v)}
          ariaLabel={`Uniforme de ${aluno.nome}`}
        />

        <div className="flex items-center gap-1 rounded-sm border-2 border-gold bg-gold/10 px-2 py-1">
          <span className="font-pixel text-[10px] uppercase leading-none text-gold">Total</span>
          <span className="font-sans text-sm font-bold tabular-nums text-gold">
            {totalDia}/{totalMaximo}
          </span>
        </div>
      </div>
    </li>
  )
}
