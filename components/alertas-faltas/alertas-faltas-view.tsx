"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { AlarmClock, Search, Settings2, UsersRound } from "lucide-react"
import { chamadasIniciais } from "@/lib/chamada-data"
import { calcularAlertasFaltas, limiteFaltasPadrao, opcoesLimiteFaltas } from "@/lib/alertas-faltas-data"
import { AlertaFaltaCard } from "./alerta-falta-card"

export function AlertasFaltasView() {
  const [limite, setLimite] = useState(limiteFaltasPadrao)
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState("todas")

  // req. 10.2: quantidade de faltas consecutivas configuravel pelo usuario.
  const alertas = useMemo(() => calcularAlertasFaltas(chamadasIniciais, limite), [limite])

  const turmasComAlerta = useMemo(
    () => Array.from(new Set(alertas.map((a) => a.turma))).sort(),
    [alertas],
  )

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return alertas.filter((a) => {
      if (termo && !a.aluno.nome.toLowerCase().includes(termo) && !a.aluno.responsavel.toLowerCase().includes(termo))
        return false
      if (turmaFiltro !== "todas" && a.turma !== turmaFiltro) return false
      return true
    })
  }, [alertas, busca, turmaFiltro])

  const totalFaltas = alertas.reduce((soma, a) => soma + a.quantidadeFaltas, 0)
  const temFiltro = busca !== "" || turmaFiltro !== "todas"

  const cards = [
    { label: "Alunos em alerta", value: alertas.length, cls: "text-danger" },
    { label: "Turmas afetadas", value: turmasComAlerta.length, cls: "text-scoreboard" },
    { label: "Faltas somadas", value: totalFaltas, cls: "text-gold" },
    { label: "Em exibição", value: filtrados.length, cls: "text-primary" },
  ]

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
            className="shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-primary-foreground pixel-shadow sm:text-base">
              Alertas de Faltas
            </h1>
            <p className="truncate font-sans text-[13px] font-semibold uppercase tracking-widest text-danger">
              Faltas consecutivas por aluno
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className={`mt-1 font-pixel text-base leading-none text-outline text-primary-foreground ${c.cls}`}>
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* Configuracao do limite e filtros (req. 10.2: quantidade configuravel) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Configuração & Busca
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              <Settings2 className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
              Faltas consecutivas para alertar
            </span>
            <select
              value={limite}
              onChange={(e) => setLimite(Number(e.target.value))}
              className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
            >
              {opcoesLimiteFaltas.map((n) => (
                <option key={n} value={n}>
                  {n} faltas consecutivas ou mais
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              Nome ou responsável
            </span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar alunos..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Turma</span>
            <select
              value={turmaFiltro}
              onChange={(e) => setTurmaFiltro(e.target.value)}
              className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
            >
              <option value="todas">Todas as turmas</option>
              {turmasComAlerta.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <AlarmClock className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {filtrados.length} de {alertas.length} alerta(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusca("")
                setTurmaFiltro("todas")
              }}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista de alertas */}
      {filtrados.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filtrados.map((alerta) => (
            <AlertaFaltaCard key={`${alerta.turma}-${alerta.aluno.id}`} alerta={alerta} />
          ))}
        </ul>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <UsersRound className="mx-auto h-8 w-8 text-success" strokeWidth={2.5} />
          <p className="mt-2 font-pixel text-[13px] uppercase text-muted-foreground">
            {alertas.length === 0 ? "Nenhum aluno em alerta" : "Nenhum alerta encontrado"}
          </p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            {alertas.length === 0
              ? `Nenhum aluno atingiu ${limite} ou mais faltas consecutivas.`
              : "Ajuste a busca ou os filtros para ver mais resultados."}
          </p>
        </div>
      )}
    </>
  )
}
