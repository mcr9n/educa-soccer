"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { CalendarRange, Info, Medal, Goal, CalendarCheck, Clock } from "lucide-react"
import { chamadasIniciais, dataAtualPadrao, formatarDataBR } from "@/lib/chamada-data"
import {
  calcularIntervaloPeriodo,
  calcularRanking,
  periodosDisponiveis,
  tiposRanking,
  turmasComChamadas,
  type PeriodoTipo,
  type TipoRanking,
} from "@/lib/rankings-data"
import { RankingRow } from "./ranking-row"

const iconePorTipo: Record<TipoRanking, typeof Goal> = {
  artilharia: Goal,
  frequencia: CalendarCheck,
  pontualidade: Clock,
}

export function RankingsView() {
  const turmas = useMemo(() => turmasComChamadas(chamadasIniciais), [])
  const [turma, setTurma] = useState(turmas[0] ?? "")
  const [tipo, setTipo] = useState<TipoRanking>("artilharia")
  const [periodoTipo, setPeriodoTipo] = useState<PeriodoTipo>("mes")
  const [personalizado, setPersonalizado] = useState({ inicio: dataAtualPadrao, fim: dataAtualPadrao })

  const intervalo = useMemo(
    () => calcularIntervaloPeriodo(periodoTipo, dataAtualPadrao, personalizado),
    [periodoTipo, personalizado],
  )

  const ranking = useMemo(
    () => (turma ? calcularRanking(chamadasIniciais, turma, tipo, intervalo) : []),
    [turma, tipo, intervalo],
  )

  const comDados = ranking.filter((r) => r.temDados)
  const tipoInfo = tiposRanking.find((t) => t.tipo === tipo)!

  return (
    <>
      {/* Cabeçalho placar */}
      <header className="panel-bevel overflow-hidden rounded-md bg-card">
        <div className="flex items-center gap-3 bg-scoreboard px-3 py-2">
          <Image
            src="/educa-soccer-crest.png"
            alt="Brasão do Educa Soccer"
            width={32}
            height={32}
            className="size-8 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-primary-foreground pixel-shadow sm:text-base">
              Rankings
            </h1>
            <p className="truncate font-sans text-[13px] font-semibold uppercase tracking-widest text-danger">
              {turma || "Selecione uma turma"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-panel-shade sm:grid-cols-3">
          {tiposRanking.map((t) => {
            const Icon = iconePorTipo[t.tipo]
            const ativo = tipo === t.tipo
            return (
              <button
                key={t.tipo}
                type="button"
                onClick={() => setTipo(t.tipo)}
                className={`inset-bevel flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  ativo ? "bg-gold text-gold-foreground" : "bg-card text-foreground hover:bg-panel-shade/30"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                <span>
                  <span className="block font-pixel text-[13px] uppercase leading-none tracking-wide">{t.label}</span>
                  <span
                    className={`block font-sans text-[11px] font-semibold uppercase tracking-wide ${
                      ativo ? "text-gold-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {t.unidade}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Filtros: turma e periodo (req. 12, req. 12.4) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Turma & Período
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              Turma (coletiva)
            </span>
            {turmas.length > 0 ? (
              <select
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
              >
                {turmas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            ) : (
              <span className="rounded-sm border border-panel-edge bg-panel-shade/20 px-2 py-1.5 font-sans text-sm text-muted-foreground">
                Nenhuma turma coletiva com chamadas registradas
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Período</span>
            <select
              value={periodoTipo}
              onChange={(e) => setPeriodoTipo(e.target.value as PeriodoTipo)}
              className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
            >
              {periodosDisponiveis.map((p) => (
                <option key={p.tipo} value={p.tipo}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          {periodoTipo === "personalizado" ? (
            <>
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">De</span>
                <input
                  type="date"
                  value={personalizado.inicio}
                  max={personalizado.fim}
                  onChange={(e) => setPersonalizado((p) => ({ ...p, inicio: e.target.value }))}
                  className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground inset-bevel focus:border-gold focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Até</span>
                <input
                  type="date"
                  value={personalizado.fim}
                  min={personalizado.inicio}
                  onChange={(e) => setPersonalizado((p) => ({ ...p, fim: e.target.value }))}
                  className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground inset-bevel focus:border-gold focus:outline-none"
                />
              </label>
            </>
          ) : (
            <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
              <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
                Intervalo considerado
              </span>
              <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/20 px-2 py-1.5">
                <CalendarRange className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
                <span className="font-sans text-sm font-semibold text-foreground">
                  {formatarDataBR(intervalo.inicio)} até {formatarDataBR(intervalo.fim)}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
          <p className="font-sans text-xs text-muted-foreground">
            {tipo === "artilharia" &&
              "Soma dos gols registrados na chamada durante as aulas do período. Faltas justificadas e aulas canceladas não entram no cálculo."}
            {tipo === "frequencia" &&
              "Percentual de presenças em relação ao total de aulas válidas do período. Faltas justificadas e aulas canceladas são desconsideradas."}
            {tipo === "pontualidade" &&
              "Média de pontos por aula válida: 1 ponto ao chegar no horário, 0 ponto ao chegar atrasado ou faltar sem justificativa. Faltas justificadas e aulas canceladas são desconsideradas."}
          </p>
        </div>
      </section>

      {/* Lista de ranking */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Ranking de {tipoInfo.label}
          </h2>
          <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-primary-foreground">
            {comDados.length}
          </span>
        </header>

        {ranking.length > 0 ? (
          <ul className="divide-y divide-panel-shade/60">
            {ranking.map((item) => (
              <RankingRow key={item.aluno.id} item={item} tipo={tipo} />
            ))}
          </ul>
        ) : (
          <div className="px-4 py-10 text-center">
            <Medal className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={2.5} />
            <p className="mt-2 font-pixel text-[13px] uppercase text-muted-foreground">
              Nenhum aluno para exibir
            </p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Selecione uma turma coletiva com chamadas registradas para gerar o ranking.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
