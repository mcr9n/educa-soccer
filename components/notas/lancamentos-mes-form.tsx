"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { Aluno } from "@/lib/alunos-data"
import {
  ordemCriteriosMensais,
  criterioMensalInfo,
  formatarMesReferencia,
  type NotaMensal,
  type CriterioMensal,
} from "@/lib/notas-data"
import { StepperNota } from "./stepper-nota"
import { ModalShell } from "@/components/shared/modal-shell"

/**
 * Formulário de lançamentos pontuais do mês (req. 14): Testes, Eventos,
 * Boletim e Amigo matriculado não são preenchidos por aula, mas uma única
 * vez por mês para cada aluno - exatamente como na planilha "ALUNOS
 * DESTAQUES", que traz um valor único por critério em cada coluna de mês.
 */
export function LancamentosMesForm({
  aluno,
  mes,
  notaMensal,
  onClose,
  onSalvar,
}: {
  aluno: Aluno
  mes: string // ISO (YYYY-MM)
  notaMensal: NotaMensal | undefined
  onClose: () => void
  onSalvar: (valores: Partial<Pick<NotaMensal, CriterioMensal>>) => void
}) {
  const [valores, setValores] = useState<Record<CriterioMensal, number>>({
    testes: notaMensal?.testes ?? 0,
    eventos: notaMensal?.eventos ?? 0,
    boletim: notaMensal?.boletim ?? 0,
    amigoMatriculado: notaMensal?.amigoMatriculado ?? 0,
  })

  const total = ordemCriteriosMensais.reduce((soma, c) => soma + valores[c], 0)
  const totalMaximo = ordemCriteriosMensais.reduce((soma, c) => soma + criterioMensalInfo[c].pontuacaoMaxima, 0)

  function confirmar() {
    onSalvar(valores)
    onClose()
  }

  return (
    <ModalShell titulo={`Lançamentos de ${formatarMesReferencia(mes)}`} tag="NOTA" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="rounded-sm border border-panel-shade bg-panel-shade/30 p-2">
          <p className="font-sans text-sm font-bold text-foreground">{aluno.nome}</p>
          <p className="font-sans text-[11px] text-muted-foreground">{aluno.turma}</p>
        </div>

        <p className="font-sans text-[11px] text-muted-foreground">
          Lançamentos pontuais do mês: no máximo um valor por critério, editável a qualquer momento.
        </p>

        <div className="flex flex-col gap-2">
          {ordemCriteriosMensais.map((criterio) => {
            const info = criterioMensalInfo[criterio]
            return (
              <div
                key={criterio}
                className="flex items-center justify-between gap-2 rounded-sm border border-panel-edge bg-panel-shade/20 px-2 py-2"
              >
                <div className="min-w-0">
                  <p className="font-pixel text-[12px] uppercase tracking-wide text-foreground">{info.label}</p>
                  <p className="mt-0.5 font-sans text-[11px] text-muted-foreground text-pretty">{info.descricao}</p>
                </div>
                <StepperNota
                  label=""
                  value={valores[criterio]}
                  max={info.pontuacaoMaxima}
                  onChange={(v) => setValores((prev) => ({ ...prev, [criterio]: v }))}
                  ariaLabel={`${info.label} de ${aluno.nome}`}
                />
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between rounded-sm border-2 border-gold bg-gold/10 px-2 py-1.5">
          <span className="font-pixel text-[12px] uppercase tracking-wide text-gold">Total do mês</span>
          <span className="font-sans text-sm font-bold tabular-nums text-gold">
            {total}/{totalMaximo}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirmar}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            Salvar lançamentos
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
