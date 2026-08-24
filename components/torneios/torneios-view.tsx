"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Plus, Search, Trophy } from "lucide-react"
import {
  proximoIdTime,
  proximoIdTorneio,
  situacaoTorneioInfo,
  situacoesTorneio,
  torneios as torneiosIniciais,
  timesTorneios as timesIniciais,
  type SituacaoTorneio,
  type TimeTorneio,
  type Torneio,
} from "@/lib/torneios-data"
import { TorneioCard } from "./torneio-card"
import { TorneioForm } from "./torneio-form"
import { TimeForm } from "./time-form"

type ModalTorneio = { modo: "novo" } | { modo: "editar"; torneio: Torneio } | null
type ModalTime = { torneio: Torneio; time?: TimeTorneio } | null

export function TorneiosView() {
  const [torneios, setTorneios] = useState<Torneio[]>(torneiosIniciais)
  const [times, setTimes] = useState<TimeTorneio[]>(timesIniciais)
  const [busca, setBusca] = useState("")
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoTorneio | "todas">("todas")
  const [expandidoId, setExpandidoId] = useState<string | null>(torneiosIniciais[0]?.id ?? null)

  const [modalTorneio, setModalTorneio] = useState<ModalTorneio>(null)
  const [modalTime, setModalTime] = useState<ModalTime>(null)
  const [confirmarExclusaoTorneio, setConfirmarExclusaoTorneio] = useState<Torneio | null>(null)
  const [confirmarExclusaoTime, setConfirmarExclusaoTime] = useState<TimeTorneio | null>(null)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return torneios.filter((t) => {
      if (termo && !t.nome.toLowerCase().includes(termo) && !t.local.toLowerCase().includes(termo)) return false
      if (situacaoFiltro !== "todas" && t.situacao !== situacaoFiltro) return false
      return true
    })
  }, [torneios, busca, situacaoFiltro])

  const contadores = useMemo(() => {
    const porSituacao: Record<SituacaoTorneio, number> = {
      planejamento: 0,
      confirmado: 0,
      em_andamento: 0,
      finalizado: 0,
    }
    for (const t of torneios) porSituacao[t.situacao]++
    return porSituacao
  }, [torneios])

  const temFiltro = busca !== "" || situacaoFiltro !== "todas"

  function salvarTorneio(dados: Omit<Torneio, "id">) {
    if (modalTorneio?.modo === "editar") {
      const idAlvo = modalTorneio.torneio.id
      setTorneios((prev) => prev.map((t) => (t.id === idAlvo ? { ...t, ...dados } : t)))
    } else {
      const novo: Torneio = { ...dados, id: proximoIdTorneio(torneios) }
      setTorneios((prev) => [...prev, novo])
      setExpandidoId(novo.id)
    }
    setModalTorneio(null)
  }

  function excluirTorneio(torneio: Torneio) {
    setTorneios((prev) => prev.filter((t) => t.id !== torneio.id))
    setTimes((prev) => prev.filter((t) => t.torneioId !== torneio.id))
    setConfirmarExclusaoTorneio(null)
  }

  function salvarTime(dados: Omit<TimeTorneio, "id" | "torneioId">) {
    if (!modalTime) return
    if (modalTime.time) {
      const idAlvo = modalTime.time.id
      setTimes((prev) => prev.map((t) => (t.id === idAlvo ? { ...t, ...dados } : t)))
    } else {
      const novo: TimeTorneio = { ...dados, id: proximoIdTime(times), torneioId: modalTime.torneio.id }
      setTimes((prev) => [...prev, novo])
    }
    setModalTime(null)
  }

  function excluirTime(time: TimeTorneio) {
    setTimes((prev) => prev.filter((t) => t.id !== time.id))
    setConfirmarExclusaoTime(null)
  }

  const cards = situacoesTorneio.map((s) => ({
    situacao: s,
    label: situacaoTorneioInfo[s].label,
    value: contadores[s],
  }))

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
              Gestão de Torneios
            </h1>
            <p className="truncate font-sans text-[13px] font-semibold uppercase tracking-widest text-danger">
              Copas & Campeonatos
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalTorneio({ modo: "novo" })}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2.5 py-1.5 font-pixel text-[13px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            Novo torneio
          </button>
        </div>

        <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-4">
          {cards.map((c) => (
            <div key={c.situacao} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 font-pixel text-xl leading-none text-outline text-white">{c.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Filtros */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-white pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Nome ou local</span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar torneios..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Situação</span>
            <select
              value={situacaoFiltro}
              onChange={(e) => setSituacaoFiltro(e.target.value as SituacaoTorneio | "todas")}
              className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
            >
              <option value="todas">Todas</option>
              {situacoesTorneio.map((s) => (
                <option key={s} value={s}>
                  {situacaoTorneioInfo[s].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {filtrados.length} de {torneios.length} torneio(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusca("")
                setSituacaoFiltro("todas")
              }}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista de torneios */}
      {filtrados.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filtrados.map((torneio) => (
            <TorneioCard
              key={torneio.id}
              torneio={torneio}
              times={times}
              expandido={expandidoId === torneio.id}
              onToggle={() => setExpandidoId((atual) => (atual === torneio.id ? null : torneio.id))}
              onEditarTorneio={() => setModalTorneio({ modo: "editar", torneio })}
              onExcluirTorneio={() => setConfirmarExclusaoTorneio(torneio)}
              onNovoTime={() => setModalTime({ torneio })}
              onEditarTime={(time) => setModalTime({ torneio, time })}
              onExcluirTime={(time) => setConfirmarExclusaoTime(time)}
            />
          ))}
        </ul>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <Trophy className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={2.5} />
          <p className="mt-2 font-pixel text-[13px] uppercase text-muted-foreground">
            {torneios.length === 0 ? "Nenhum torneio cadastrado" : "Nenhum torneio encontrado"}
          </p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            {torneios.length === 0
              ? "Clique em \u201cNovo torneio\u201d para cadastrar a primeira copa."
              : "Ajuste a busca ou os filtros para ver mais resultados."}
          </p>
        </div>
      )}

      {modalTorneio && (
        <TorneioForm
          torneio={modalTorneio.modo === "editar" ? modalTorneio.torneio : undefined}
          onSalvar={salvarTorneio}
          onCancelar={() => setModalTorneio(null)}
        />
      )}

      {modalTime && (
        <TimeForm
          torneio={modalTime.torneio}
          timesDoTorneio={times}
          time={modalTime.time}
          onSalvar={salvarTime}
          onCancelar={() => setModalTime(null)}
        />
      )}

      {confirmarExclusaoTorneio && (
        <ConfirmarExclusao
          titulo="Excluir torneio"
          mensagem={`Tem certeza que deseja excluir o torneio "${confirmarExclusaoTorneio.nome}"? Todos os times cadastrados nele também serão removidos.`}
          onConfirmar={() => excluirTorneio(confirmarExclusaoTorneio)}
          onCancelar={() => setConfirmarExclusaoTorneio(null)}
        />
      )}

      {confirmarExclusaoTime && (
        <ConfirmarExclusao
          titulo="Excluir time"
          mensagem={`Tem certeza que deseja excluir o time "${confirmarExclusaoTime.nome}"?`}
          onConfirmar={() => excluirTime(confirmarExclusaoTime)}
          onCancelar={() => setConfirmarExclusaoTime(null)}
        />
      )}
    </>
  )
}

function ConfirmarExclusao({
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
}: {
  titulo: string
  mensagem: string
  onConfirmar: () => void
  onCancelar: () => void
}) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancelar}
    >
      <div
        className="panel-bevel w-full max-w-md overflow-hidden rounded-md bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-b-2 border-panel-shade bg-danger px-3 py-2">
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-white pixel-shadow">{titulo}</h2>
        </header>
        <div className="p-4">
          <p className="font-sans text-sm text-foreground text-pretty">{mensagem}</p>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmar}
              className="rounded-sm border-2 border-danger bg-danger px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-danger/80 focus:outline-none"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
