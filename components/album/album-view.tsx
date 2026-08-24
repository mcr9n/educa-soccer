"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Search, StickyNote, Plus, Settings2, Pencil, Trash2 } from "lucide-react"
import { alunos } from "@/lib/alunos-data"
import { turmasDisponiveis } from "@/lib/turmas-data"
import {
  tiposFigurinhaIniciais,
  figurinhasConcedidasIniciais,
  anoAtual,
  anosDoAlbum,
  resumoAlbum,
  varianteDoTipo,
  proximoIdFigurinha,
  proximoIdTipoFigurinha,
  type TipoFigurinha,
  type FigurinhaConcedida,
} from "@/lib/album-data"
import { TurmaAlbum, type LinhaAlbum } from "./aluno-album-row"
import { EntregaFigurinhaForm } from "./entrega-form"
import { TipoFigurinhaForm } from "./tipo-form"
import { TipoFigurinhaBadge } from "./tipo-badge"

export function AlbumView() {
  const [tipos, setTipos] = useState<TipoFigurinha[]>(tiposFigurinhaIniciais)
  const [concedidas, setConcedidas] = useState<FigurinhaConcedida[]>(figurinhasConcedidasIniciais)

  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState("todas")
  const [ano, setAno] = useState(anoAtual)

  const [entregaAberta, setEntregaAberta] = useState<"fechado" | { alunoId?: string }>("fechado")
  const [tipoFormAberto, setTipoFormAberto] = useState<"fechado" | "novo" | TipoFigurinha>("fechado")
  const [exclusaoPendente, setExclusaoPendente] = useState<TipoFigurinha | null>(null)

  function concederFigurinha(dados: Omit<FigurinhaConcedida, "id" | "data">) {
    setConcedidas((prev) => [
      ...prev,
      { ...dados, id: proximoIdFigurinha(prev), data: new Date().toISOString().slice(0, 10) },
    ])
  }

  function criarTipo(dados: Omit<TipoFigurinha, "id">) {
    setTipos((prev) => [...prev, { ...dados, id: proximoIdTipoFigurinha(prev) }])
  }

  function editarTipo(id: string, dados: Omit<TipoFigurinha, "id">) {
    setTipos((prev) => prev.map((t) => (t.id === id ? { ...t, ...dados } : t)))
  }

  function excluirTipo(id: string) {
    setTipos((prev) => prev.filter((t) => t.id !== id))
    setExclusaoPendente(null)
  }

  const anosDisponiveis = useMemo(() => anosDoAlbum(concedidas), [concedidas])

  // Filtra e agrupa alunos ativos por turma (req. 13).
  const linhasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const resultado: LinhaAlbum[] = []
    for (const aluno of alunos) {
      if (!aluno.ativo) continue
      if (turmaFiltro !== "todas" && aluno.turma !== turmaFiltro) continue
      if (termo && !aluno.nome.toLowerCase().includes(termo)) continue
      resultado.push({ aluno })
    }
    return resultado
  }, [busca, turmaFiltro])

  const grupos = useMemo(() => {
    const mapa = new Map<string, LinhaAlbum[]>()
    for (const linha of linhasFiltradas) {
      const arr = mapa.get(linha.aluno.turma) ?? []
      arr.push(linha)
      mapa.set(linha.aluno.turma, arr)
    }
    return Array.from(mapa.entries())
      .map(([turma, linhas]) => ({ turma, linhas: linhas.sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome)) }))
      .sort((a, b) => a.turma.localeCompare(b.turma))
  }, [linhasFiltradas])

  const resumo = resumoAlbum(concedidas, tipos, ano)
  const temFiltro = busca !== "" || turmaFiltro !== "todas"

  const cards = [
    { label: `Figurinhas em ${ano}`, value: String(resumo.total), cls: "text-primary" },
    { label: "Alunos com álbum", value: String(resumo.alunosComAlbum), cls: "text-primary" },
    { label: "Tipos ativos", value: String(resumo.tiposAtivos), cls: "text-gold" },
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
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-white pixel-shadow sm:text-base">
              Álbum de Figurinhas
            </h1>
            <p className="font-sans text-[14px] font-semibold uppercase tracking-widest text-danger">
              Figurinhas por aluno, ano e comportamento
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEntregaAberta({})}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2.5 py-1.5 font-pixel text-[13px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            Conceder figurinha
          </button>
        </div>

        <div className="grid grid-cols-1 gap-px bg-panel-shade sm:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className={`mt-1 font-pixel text-base leading-none text-outline text-white ${c.cls}`}>{c.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Catalogo de tipos de figurinha (req. 13.2) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[14px] leading-none text-gold-foreground">
              TIPO
            </span>
            <h2 className="font-pixel text-[14px] uppercase tracking-wide text-white pixel-shadow">
              Tipos de figurinha
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setTipoFormAberto("novo")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:border-gold hover:text-gold focus:outline-none"
          >
            <Settings2 className="h-3.5 w-3.5" strokeWidth={2.5} />
            Novo tipo
          </button>
        </header>
        <ul className="flex flex-wrap gap-2 p-3">
          {tipos.map((tipo) => (
            <li
              key={tipo.id}
              className="flex items-center gap-2 rounded-sm border border-panel-shade bg-panel-shade/20 px-2 py-1.5"
            >
              <TipoFigurinhaBadge tipo={tipo} quantidade={concedidas.filter((f) => f.tipoId === tipo.id).length} variant={varianteDoTipo(tipo.id, tipos)} />
              <span className="max-w-[10rem] truncate font-sans text-[14px] text-muted-foreground" title={tipo.comportamento}>
                {tipo.comportamento}
              </span>
              {!tipo.ativo && (
                <span className="rounded-sm bg-panel-shade px-1 py-0.5 font-pixel text-[10px] uppercase text-muted-foreground">
                  Inativo
                </span>
              )}
              <button
                type="button"
                onClick={() => setTipoFormAberto(tipo)}
                aria-label={`Editar tipo ${tipo.personagem}`}
                className="rounded-sm border border-panel-edge bg-panel-shade/50 p-1 text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
              >
                <Pencil className="h-3 w-3" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setExclusaoPendente(tipo)}
                aria-label={`Excluir tipo ${tipo.personagem}`}
                className="rounded-sm border border-panel-edge bg-panel-shade/50 p-1 text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
              >
                <Trash2 className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Filtros */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[14px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[14px] uppercase tracking-wide text-white pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Aluno</span>
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
            label="Ano do álbum"
            value={String(ano)}
            onChange={(v) => setAno(Number(v))}
            options={anosDisponiveis.map((a) => ({ value: String(a), label: String(a) }))}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <StickyNote className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {linhasFiltradas.length} aluno(s) • {grupos.length} turma(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusca("")
                setTurmaFiltro("todas")
              }}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista agrupada por turma */}
      {grupos.length > 0 ? (
        <div className="flex flex-col gap-2">
          {grupos.map((g) => (
            <TurmaAlbum
              key={g.turma}
              turma={g.turma}
              linhas={g.linhas}
              ano={ano}
              concedidas={concedidas}
              tipos={tipos}
              onConceder={(alunoId) => setEntregaAberta({ alunoId })}
            />
          ))}
        </div>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-[13px] uppercase text-muted-foreground">Nenhum aluno encontrado</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">Ajuste os filtros para ver o álbum dos alunos.</p>
        </div>
      )}

      {entregaAberta !== "fechado" && (
        <EntregaFigurinhaForm
          alunoFixo={entregaAberta.alunoId}
          tipos={tipos}
          concedidas={concedidas}
          onClose={() => setEntregaAberta("fechado")}
          onSalvar={concederFigurinha}
        />
      )}

      {tipoFormAberto !== "fechado" && (
        <TipoFigurinhaForm
          tipoEditando={tipoFormAberto === "novo" ? undefined : tipoFormAberto}
          tiposExistentes={tipos}
          onClose={() => setTipoFormAberto("fechado")}
          onSalvar={(dados) => {
            if (tipoFormAberto === "novo") criarTipo(dados)
            else editarTipo(tipoFormAberto.id, dados)
          }}
        />
      )}

      {exclusaoPendente && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          onClick={() => setExclusaoPendente(null)}
        >
          <div className="panel-bevel w-full max-w-sm overflow-hidden rounded-md bg-card" onClick={(e) => e.stopPropagation()}>
            <header className="border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
              <h2 className="font-pixel text-[13px] uppercase tracking-wide text-white pixel-shadow">
                Excluir tipo de figurinha
              </h2>
            </header>
            <div className="p-3">
              <p className="font-sans text-sm text-foreground text-pretty">
                Tem certeza que deseja excluir o tipo <span className="font-bold">{exclusaoPendente.personagem}</span>?
                As entregas já registradas para esse tipo continuarão no histórico, mas ele deixará de aparecer no
                catálogo para novas entregas.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => excluirTipo(exclusaoPendente.id)}
                  className="inline-flex flex-1 items-center justify-center rounded-sm border-2 border-danger bg-danger px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 focus:outline-none"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  onClick={() => setExclusaoPendente(null)}
                  className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
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
