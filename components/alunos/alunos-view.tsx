"use client"

import { useMemo, useState } from "react"
import { Search, Users } from "lucide-react"
import {
  type Aluno,
  alunos as alunosIniciais,
  calcularIdade,
  faixaEtaria,
  faixasEtarias,
  modalidadeDaTurma,
  turmasDisponiveis,
  totalExAlunos,
} from "@/lib/alunos-data"
import { AlunosCounters } from "./alunos-counters"
import { AlunoCard } from "./aluno-card"

type ModalidadeFiltro = "todas" | "coletiva" | "particular"

export function AlunosView() {
  const [lista, setLista] = useState<Aluno[]>(alunosIniciais)
  const [exAlunos, setExAlunos] = useState(totalExAlunos)
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState<string>("todas")
  const [faixaFiltro, setFaixaFiltro] = useState<string>("todas")
  const [modalidadeFiltro, setModalidadeFiltro] = useState<ModalidadeFiltro>("todas")
  const [expandidoId, setExpandidoId] = useState<string | null>(null)

  // Apenas alunos ativos participam da listagem (requisito 4.2).
  const ativos = useMemo(() => lista.filter((a) => a.ativo), [lista])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return ativos.filter((a) => {
      if (termo && !a.nome.toLowerCase().includes(termo)) return false
      if (turmaFiltro !== "todas" && a.turma !== turmaFiltro) return false
      if (modalidadeFiltro !== "todas" && a.modalidade !== modalidadeFiltro) return false
      if (faixaFiltro !== "todas" && faixaEtaria(calcularIdade(a.dataNascimento)) !== faixaFiltro) return false
      return true
    })
  }, [ativos, busca, turmaFiltro, faixaFiltro, modalidadeFiltro])

  // Contadores (requisito 4.3)
  const contadores = useMemo(() => {
    const particulares = ativos.filter((a) => a.modalidade === "particular").length
    const coletivos = ativos.filter((a) => a.modalidade === "coletiva").length
    const porTurma = turmasDisponiveis
      .map((t) => ({ turma: t, total: ativos.filter((a) => a.turma === t).length }))
      .filter((t) => t.total > 0)
    return { ativos: ativos.length, particulares, coletivos, porTurma }
  }, [ativos])

  function editarAluno(id: string, dados: Partial<Aluno>) {
    setLista((prev) => prev.map((a) => (a.id === id ? { ...a, ...dados } : a)))
  }

  function transferirAluno(id: string, turma: string) {
    const modalidade: Aluno["modalidade"] = modalidadeDaTurma(turma)
    setLista((prev) => prev.map((a) => (a.id === id ? { ...a, turma, modalidade } : a)))
  }

  function marcarExAluno(id: string) {
    setLista((prev) => prev.map((a) => (a.id === id ? { ...a, ativo: false } : a)))
    setExAlunos((n) => n + 1)
    setExpandidoId((atual) => (atual === id ? null : atual))
  }

  function limparFiltros() {
    setBusca("")
    setTurmaFiltro("todas")
    setFaixaFiltro("todas")
    setModalidadeFiltro("todas")
  }

  const temFiltro =
    busca !== "" || turmaFiltro !== "todas" || faixaFiltro !== "todas" || modalidadeFiltro !== "todas"

  return (
    <>
      <AlunosCounters
        ativos={contadores.ativos}
        particulares={contadores.particulares}
        coletivos={contadores.coletivos}
        exAlunos={exAlunos}
        porTurma={contadores.porTurma}
      />

      {/* Barra de busca e filtros */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Busca por nome */}
          <label className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
            <span className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">Nome do aluno</span>
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
            label="Turma"
            value={turmaFiltro}
            onChange={setTurmaFiltro}
            options={[{ value: "todas", label: "Todas as turmas" }, ...turmasDisponiveis.map((t) => ({ value: t, label: t }))]}
          />

          <FiltroSelect
            label="Faixa etária"
            value={faixaFiltro}
            onChange={setFaixaFiltro}
            options={[
              { value: "todas", label: "Todas as idades" },
              ...faixasEtarias.map((f) => ({ value: f, label: `${f} anos` })),
            ]}
          />

          <FiltroSelect
            label="Atendimento"
            value={modalidadeFiltro}
            onChange={(v) => setModalidadeFiltro(v as ModalidadeFiltro)}
            options={[
              { value: "todas", label: "Todos" },
              { value: "coletiva", label: "Coletivo" },
              { value: "particular", label: "Particular" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {filtrados.length} de {contadores.ativos} aluno(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista de alunos */}
      {filtrados.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filtrados.map((aluno) => (
            <AlunoCard
              key={aluno.id}
              aluno={aluno}
              expandido={expandidoId === aluno.id}
              onToggle={() => setExpandidoId((atual) => (atual === aluno.id ? null : aluno.id))}
              onEditar={editarAluno}
              onTransferir={transferirAluno}
              onMarcarExAluno={marcarExAluno}
            />
          ))}
        </ul>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-[10px] uppercase text-muted-foreground">Nenhum aluno encontrado</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            Ajuste a busca ou os filtros para ver mais resultados.
          </p>
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
      <span className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{label}</span>
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
