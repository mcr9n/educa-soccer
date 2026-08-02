"use client"

import { useMemo, useState } from "react"
import { Search, UserMinus, Users, RotateCcw, MapPin, LogOut } from "lucide-react"
import { type ExAluno, exAlunos as exAlunosIniciais } from "@/lib/ex-alunos-data"
import { getTurma } from "@/lib/turmas-data"
import { ExAlunoCard } from "./ex-aluno-card"

export function ExAlunosView() {
  const [lista, setLista] = useState<ExAluno[]>(exAlunosIniciais)
  const [reativados, setReativados] = useState(0)
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState<string>("todas")
  const [motivoFiltro, setMotivoFiltro] = useState<string>("todos")
  const [expandidoId, setExpandidoId] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  // Turmas anteriores presentes na lista (para o filtro).
  const turmasAnteriores = useMemo(
    () => Array.from(new Set(lista.map((e) => e.turmaAnterior))).sort(),
    [lista],
  )
  const motivos = useMemo(() => Array.from(new Set(lista.map((e) => e.motivoSaida))).sort(), [lista])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return lista.filter((e) => {
      if (
        termo &&
        !e.nome.toLowerCase().includes(termo) &&
        !e.responsavel.toLowerCase().includes(termo)
      )
        return false
      if (turmaFiltro !== "todas" && e.turmaAnterior !== turmaFiltro) return false
      if (motivoFiltro !== "todos" && e.motivoSaida !== motivoFiltro) return false
      return true
    })
  }, [lista, busca, turmaFiltro, motivoFiltro])

  function reativar(id: string, turma: string) {
    const ex = lista.find((e) => e.id === id)
    setLista((prev) => prev.filter((e) => e.id !== id))
    setReativados((n) => n + 1)
    setExpandidoId((atual) => (atual === id ? null : atual))
    const nomeTurma = getTurma(turma)?.local ?? turma
    setAviso(ex ? `${ex.nome} foi reativado(a) na turma ${nomeTurma}.` : null)
  }

  function limparFiltros() {
    setBusca("")
    setTurmaFiltro("todas")
    setMotivoFiltro("todos")
  }

  const temFiltro = busca !== "" || turmaFiltro !== "todas" || motivoFiltro !== "todos"

  return (
    <>
      {/* Contadores */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Contador icon={LogOut} valor={lista.length} label="Ex-alunos" tone="danger" />
        <Contador icon={MapPin} valor={turmasAnteriores.length} label="Turmas de origem" tone="blue" />
        <Contador icon={RotateCcw} valor={reativados} label="Reativados" tone="primary" />
        <Contador icon={Users} valor={filtrados.length} label="Em exibição" tone="gold" />
      </section>

      {/* Aviso de reativação */}
      {aviso && (
        <div className="panel-bevel flex items-center justify-between gap-3 rounded-md border-2 border-primary bg-primary/15 px-3 py-2">
          <p className="flex items-center gap-2 font-sans text-sm font-semibold text-primary">
            <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {aviso}
          </p>
          <button
            type="button"
            onClick={() => setAviso(null)}
            className="font-pixel text-[9px] uppercase text-primary hover:underline"
          >
            OK
          </button>
        </div>
      )}

      {/* Busca e filtros */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-3 py-0.5 font-pixel text-sm font-bold leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-lg font-bold uppercase tracking-wide text-primary-foreground pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              Nome ou responsável
            </span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar ex-alunos..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </span>
          </label>

          <FiltroSelect
            label="Antiga turma"
            value={turmaFiltro}
            onChange={setTurmaFiltro}
            options={[{ value: "todas", label: "Todas as turmas" }, ...turmasAnteriores.map((t) => ({ value: t, label: t }))]}
          />

          <FiltroSelect
            label="Motivo da saída"
            value={motivoFiltro}
            onChange={setMotivoFiltro}
            options={[{ value: "todos", label: "Todos os motivos" }, ...motivos.map((m) => ({ value: m, label: m }))]}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <UserMinus className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {filtrados.length} de {lista.length} ex-aluno(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista de ex-alunos */}
      {filtrados.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filtrados.map((ex) => (
            <ExAlunoCard
              key={ex.id}
              exAluno={ex}
              expandido={expandidoId === ex.id}
              onToggle={() => setExpandidoId((atual) => (atual === ex.id ? null : ex.id))}
              onReativar={reativar}
            />
          ))}
        </ul>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-lg font-bold uppercase text-muted-foreground">Nenhum ex-aluno encontrado</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            {lista.length === 0
              ? "Todos os ex-alunos foram reativados."
              : "Ajuste a busca ou os filtros para ver mais resultados."}
          </p>
        </div>
      )}
    </>
  )
}

function Contador({
  icon: Icon,
  valor,
  label,
  tone,
}: {
  icon: typeof Users
  valor: number
  label: string
  tone: "danger" | "blue" | "primary" | "gold"
}) {
  const tones = {
    danger: "text-danger",
    blue: "text-scoreboard",
    primary: "text-primary",
    gold: "text-gold",
  }
  return (
    <div className="panel-bevel flex items-center gap-3 rounded-md bg-card px-3 py-2.5">
      <Icon className={`h-6 w-6 shrink-0 ${tones[tone]}`} strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-xl font-bold leading-none text-foreground">{valor}</p>
        <p className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
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
