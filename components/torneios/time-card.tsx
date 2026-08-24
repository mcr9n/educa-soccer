"use client"

import { AlertTriangle, ChevronDown, Pencil, Trash2, UserRound } from "lucide-react"
import {
  atendeFaixaEtaria,
  idadeNaData,
  jogadoresDoTime,
  parseFaixaEtaria,
  type TimeTorneio,
  type Torneio,
} from "@/lib/torneios-data"

/** Time de um torneio (req. 8.2): resumo do elenco com destaque para alunos fora da faixa etaria. */
export function TimeCard({
  time,
  torneio,
  expandido,
  onToggle,
  onEditar,
  onExcluir,
}: {
  time: TimeTorneio
  torneio: Torneio
  expandido: boolean
  onToggle: () => void
  onEditar: () => void
  onExcluir: () => void
}) {
  const jogadores = jogadoresDoTime(time)
  const faixaTorneio = parseFaixaEtaria(torneio.categoria)
  const foraDaFaixa = jogadores.filter((a) => !atendeFaixaEtaria(idadeNaData(a.dataNascimento, torneio.dataInicio), faixaTorneio))

  return (
    <li className="rounded-sm border border-panel-shade bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandido}
        className="flex w-full items-center gap-3 px-2.5 py-2 text-left transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 focus:outline-none"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-scoreboard font-pixel text-[9px] text-white inset-bevel">
          {time.nome.slice(0, 3).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
            {time.nome}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
            <span>{time.faixaEtaria}</span>
            <span aria-hidden>•</span>
            <span>Treinador: {time.treinador}</span>
          </span>
        </span>

        {foraDaFaixa.length > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-danger/15 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-danger">
            <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
            {foraDaFaixa.length} fora da faixa
          </span>
        )}

        <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
          <UserRound className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
          <span className="font-pixel text-[15px] text-gold">
            {jogadores.length}/{torneio.maxJogadoresPorTime}
          </span>
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {expandido && (
        <div className="border-t border-panel-shade bg-panel-shade/20 px-2.5 py-2.5">
          {jogadores.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {jogadores.map((a) => {
                const idade = idadeNaData(a.dataNascimento, torneio.dataInicio)
                const dentroDaFaixa = atendeFaixaEtaria(idade, faixaTorneio)
                return (
                  <li
                    key={a.id}
                    className={`inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 ${
                      dentroDaFaixa ? "border-panel-shade bg-card" : "border-danger bg-danger/10"
                    }`}
                  >
                    {!dentroDaFaixa && <AlertTriangle className="h-3 w-3 shrink-0 text-danger" strokeWidth={2.5} />}
                    <span className="font-sans text-[12px] font-semibold text-foreground">{a.nome}</span>
                    <span className="font-sans text-[11px] text-muted-foreground">{idade}a</span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="font-sans text-[12px] text-muted-foreground">Nenhum jogador cadastrado neste time.</p>
          )}

          {time.observacoes && (
            <p className="mt-2 font-sans text-[12px] text-muted-foreground">
              <span className="font-bold text-foreground">Observações:</span> {time.observacoes}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEditar}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus:outline-none"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
              Editar time
            </button>
            <button
              type="button"
              onClick={onExcluir}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-danger bg-danger/15 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-danger transition-colors hover:bg-danger hover:text-white focus:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              Excluir time
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
