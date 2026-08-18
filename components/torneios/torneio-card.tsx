"use client"

import { useState } from "react"
import { CalendarDays, ChevronDown, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import {
  formatarPeriodoTorneio,
  situacaoTorneioInfo,
  timesDoTorneio as timesDoTorneioFn,
  totalJogadoresTorneio,
  type TimeTorneio,
  type Torneio,
} from "@/lib/torneios-data"
import { TimeCard } from "./time-card"

/** Torneio (req. 8.1) com a lista de times formados dentro dele (req. 8.2). */
export function TorneioCard({
  torneio,
  times,
  expandido,
  onToggle,
  onEditarTorneio,
  onExcluirTorneio,
  onNovoTime,
  onEditarTime,
  onExcluirTime,
}: {
  torneio: Torneio
  times: TimeTorneio[]
  expandido: boolean
  onToggle: () => void
  onEditarTorneio: () => void
  onExcluirTorneio: () => void
  onNovoTime: () => void
  onEditarTime: (time: TimeTorneio) => void
  onExcluirTime: (time: TimeTorneio) => void
}) {
  const [timeExpandidoId, setTimeExpandidoId] = useState<string | null>(null)

  const timesDoTorneio = timesDoTorneioFn(times, torneio.id)
  const totalJogadores = totalJogadoresTorneio(times, torneio.id)
  const info = situacaoTorneioInfo[torneio.situacao]

  return (
    <li className="panel-bevel overflow-hidden rounded-md bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandido}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 focus:outline-none"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-scoreboard font-pixel text-[13px] text-primary-foreground inset-bevel">
          <Users className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
            {torneio.nome}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[13px] text-muted-foreground">
            <span>{torneio.categoria}</span>
            <span aria-hidden>•</span>
            <span>{formatarPeriodoTorneio(torneio.dataInicio, torneio.dataTermino)}</span>
          </span>
        </span>

        <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
          <Users className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
          <span className="font-pixel text-[16px] text-gold">
            {timesDoTorneio.length} {timesDoTorneio.length === 1 ? "time" : "times"}
          </span>
        </span>

        <PositionTag label={info.label} variant={info.variant} className="shrink-0" />

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {expandido && (
        <div className="border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Info icon={MapPin} label="Local" value={torneio.local} />
            <Info icon={CalendarDays} label="Período" value={formatarPeriodoTorneio(torneio.dataInicio, torneio.dataTermino)} />
            <Info icon={Users} label="Jogadores cadastrados" value={`${totalJogadores} • máx. ${torneio.maxJogadoresPorTime} por time`} />
          </div>

          {torneio.observacoes && (
            <p className="mt-2 font-sans text-[14px] text-muted-foreground">
              <span className="font-bold text-foreground">Observações:</span> {torneio.observacoes}
            </p>
          )}

          {/* Times do torneio (req. 8.2) */}
          <section className="mt-3 rounded-sm border border-panel-shade bg-card p-2.5">
            <header className="mb-2 flex items-center gap-2">
              <span className="rounded-sm bg-scoreboard px-1.5 py-0.5 font-pixel text-[13px] leading-none text-primary-foreground">
                TIMES
              </span>
              <h3 className="flex-1 font-pixel text-[13px] uppercase tracking-wide text-foreground">
                Times participantes
              </h3>
              <button
                type="button"
                onClick={onNovoTime}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2 py-1 font-pixel text-[11px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                Novo time
              </button>
            </header>

            {timesDoTorneio.length > 0 ? (
              <ul className="flex flex-col gap-1.5">
                {timesDoTorneio.map((time) => (
                  <TimeCard
                    key={time.id}
                    time={time}
                    torneio={torneio}
                    expandido={timeExpandidoId === time.id}
                    onToggle={() => setTimeExpandidoId((atual) => (atual === time.id ? null : time.id))}
                    onEditar={() => onEditarTime(time)}
                    onExcluir={() => onExcluirTime(time)}
                  />
                ))}
              </ul>
            ) : (
              <p className="font-sans text-[12px] text-muted-foreground">
                Nenhum time cadastrado ainda. Clique em &quot;Novo time&quot; para começar a formar os times.
              </p>
            )}
          </section>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEditarTorneio}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus:outline-none"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
              Editar torneio
            </button>
            <button
              type="button"
              onClick={onExcluirTorneio}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-danger bg-danger/15 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-danger transition-colors hover:bg-danger hover:text-white focus:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              Excluir torneio
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-sans text-sm font-semibold text-foreground text-pretty">{value}</p>
      </div>
    </div>
  )
}
