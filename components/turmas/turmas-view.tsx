"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, UsersRound, Plus } from "lucide-react"
import { alunos } from "@/lib/alunos-data"
import { turmas as turmasIniciais, locaisDisponiveis, type Turma } from "@/lib/turmas-data"
import { TurmaCard } from "./turma-card"

type SituacaoFiltro = "todas" | "ativa" | "inativa"
type ModalidadeFiltro = "todas" | "coletiva" | "particular"

export function TurmasView() {
  const [busca, setBusca] = useState("")
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoFiltro>("todas")
  const [modalidadeFiltro, setModalidadeFiltro] = useState<ModalidadeFiltro>("todas")
  const [expandidoId, setExpandidoId] = useState<string | null>(null)

  // Matriculas ativas por turma (nome da turma == chave).
  const matriculasPorTurma = useMemo(() => {
    const mapa = new Map<string, typeof alunos>()
    for (const a of alunos) {
      if (!a.ativo) continue
      const arr = mapa.get(a.turma) ?? []
      arr.push(a)
      mapa.set(a.turma, arr)
    }
    return mapa
  }, [])

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return turmasIniciais.filter((t: Turma) => {
      if (termo && !t.nome.toLowerCase().includes(termo) && !t.professor.toLowerCase().includes(termo)) return false
      if (situacaoFiltro !== "todas" && t.situacao !== situacaoFiltro) return false
      if (modalidadeFiltro !== "todas" && t.modalidade !== modalidadeFiltro) return false
      return true
    })
  }, [busca, situacaoFiltro, modalidadeFiltro])

  const contadores = useMemo(() => {
    const ativas = turmasIniciais.filter((t) => t.situacao === "ativa").length
    const inativas = turmasIniciais.length - ativas
    const matriculados = alunos.filter((a) => a.ativo).length
    return { total: turmasIniciais.length, ativas, inativas, matriculados }
  }, [])

  const temFiltro =
    busca !== "" || situacaoFiltro !== "todas" || modalidadeFiltro !== "todas"

  const principais = [
    { label: "Turmas", value: contadores.total, cls: "text-primary-foreground" },
    { label: "Ativas", value: contadores.ativas, cls: "text-primary-foreground" },
    { label: "Inativas", value: contadores.inativas, cls: "text-primary-foreground" },
    { label: "Matriculados", value: contadores.matriculados, cls: "text-primary-foreground" },
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
            className="size-8 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-primary-foreground pixel-shadow sm:text-base">
              Gestão de Turmas
            </h1>
            <p className="font-sans text-[13px] font-semibold uppercase tracking-widest text-danger">Elencos & Horários</p>
          </div>
          <Link
            href="/cadastro-turma"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2.5 py-1.5 font-pixel text-[13px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            Nova turma
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-4">
          {principais.map((c) => (
            <div key={c.label} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className={`mt-1 font-pixel text-xl leading-none text-outline ${c.cls}`}>{c.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Filtros */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[14px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[14px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Turma ou professor</span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </span>
          </label>
          <FiltroSelect
            label="Situação"
            value={situacaoFiltro}
            onChange={(v) => setSituacaoFiltro(v as SituacaoFiltro)}
            options={[
              { value: "todas", label: "Todas" },
              { value: "ativa", label: "Ativas" },
              { value: "inativa", label: "Inativas" },
            ]}
          />
          <FiltroSelect
            label="Modalidade"
            value={modalidadeFiltro}
            onChange={(v) => setModalidadeFiltro(v as ModalidadeFiltro)}
            options={[
              { value: "todas", label: "Todas" },
              { value: "coletiva", label: "Coletiva" },
              { value: "particular", label: "Particular" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <UsersRound className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {filtradas.length} de {contadores.total} turma(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusca("")
                setSituacaoFiltro("todas")
                setModalidadeFiltro("todas")
              }}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista */}
      {filtradas.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filtradas.map((turma) => (
            <TurmaCard
              key={turma.id}
              turma={turma}
              matriculados={matriculasPorTurma.get(turma.nome) ?? []}
              expandido={expandidoId === turma.id}
              onToggle={() => setExpandidoId((atual) => (atual === turma.id ? null : turma.id))}
            />
          ))}
        </ul>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-[10px] uppercase text-muted-foreground">Nenhuma turma encontrada</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">Ajuste a busca ou os filtros.</p>
        </div>
      )}
    </>
  )
}

function FiltroSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
