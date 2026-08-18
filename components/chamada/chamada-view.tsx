"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { CalendarDays, Save, CheckCircle2, XCircle, RotateCcw, History, Lock, LockOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTurma } from "@/lib/turmas-data"
import {
  type Chamada,
  type PresencaAluno,
  type StatusChamada,
  type Pontualidade,
  chamadasIniciais,
  turmasParaChamada,
  dataAtualPadrao,
  alunosDaTurma,
  chamadaExistente,
  novaChamadaEmBranco,
  resumoChamada,
  marcarTodosComo,
  registrarChamada,
  formatarDataBR,
  statusChamadaInfo,
  ordemStatusChamada,
} from "@/lib/chamada-data"
import { AlunoChamadaRow } from "./aluno-chamada-row"

type Rascunho = { turma: string; data: string; presencas: PresencaAluno[] }

function carregarRascunho(turma: string, data: string, lista: Chamada[]): Rascunho {
  const existente = chamadaExistente(lista, turma, data)
  return {
    turma,
    data,
    presencas: existente ? existente.presencas : novaChamadaEmBranco(alunosDaTurma(turma)),
  }
}

const resumoCls: Record<StatusChamada, string> = {
  presente: "text-success",
  ausente: "text-danger",
  ausencia_justificada: "text-gold",
  aula_cancelada: "text-primary-foreground",
  nao_se_aplica: "text-muted-foreground",
}

export function ChamadaView() {
  const [chamadas, setChamadas] = useState<Chamada[]>(chamadasIniciais)
  const [rascunho, setRascunho] = useState<Rascunho>(() =>
    carregarRascunho(turmasParaChamada[0] ?? "", dataAtualPadrao, chamadasIniciais),
  )
  const [salvoAgora, setSalvoAgora] = useState(false)
  // Uma ficha ja salva abre bloqueada, para evitar edicao acidental; o
  // professor precisa reabri-la explicitamente para poder alterar (pedido
  // do usuario: "possibilidade de mudar a situacao da ficha mesmo depois
  // de salvar, para ficar em edicao novamente").
  const [edicaoForcada, setEdicaoForcada] = useState(false)

  const alunosTurma = useMemo(() => alunosDaTurma(rascunho.turma), [rascunho.turma])
  const resumo = useMemo(() => resumoChamada(rascunho.presencas), [rascunho.presencas])
  const jaSalva = useMemo(
    () => Boolean(chamadaExistente(chamadas, rascunho.turma, rascunho.data)),
    [chamadas, rascunho.turma, rascunho.data],
  )
  const bloqueada = jaSalva && !edicaoForcada
  const professor = getTurma(rascunho.turma)?.professor ?? "Coordenação"

  const historicoTurma = useMemo(
    () =>
      chamadas
        .filter((c) => c.turma === rascunho.turma)
        .sort((a, b) => b.data.localeCompare(a.data)),
    [chamadas, rascunho.turma],
  )

  function selecionarTurma(turma: string) {
    setSalvoAgora(false)
    setEdicaoForcada(false)
    setRascunho(carregarRascunho(turma, rascunho.data, chamadas))
  }

  function selecionarData(data: string) {
    setSalvoAgora(false)
    setEdicaoForcada(false)
    setRascunho(carregarRascunho(rascunho.turma, data, chamadas))
  }

  function reabrirParaEdicao() {
    setSalvoAgora(false)
    setEdicaoForcada(true)
  }

  function alterarStatus(alunoId: string, status: StatusChamada) {
    setSalvoAgora(false)
    setRascunho((r) => ({
      ...r,
      presencas: r.presencas.map((p) => (p.alunoId === alunoId ? { ...p, status } : p)),
    }))
  }

  // Gols e pontualidade (req. 12.1 e 12.3): usados no calculo dos rankings.
  function alterarGols(alunoId: string, gols: number) {
    setSalvoAgora(false)
    setRascunho((r) => ({
      ...r,
      presencas: r.presencas.map((p) => (p.alunoId === alunoId ? { ...p, gols } : p)),
    }))
  }

  function alterarPontualidade(alunoId: string, pontualidade: Pontualidade) {
    setSalvoAgora(false)
    setRascunho((r) => ({
      ...r,
      presencas: r.presencas.map((p) => (p.alunoId === alunoId ? { ...p, pontualidade } : p)),
    }))
  }

  function aplicarAtodos(status: StatusChamada) {
    setSalvoAgora(false)
    setRascunho((r) => ({ ...r, presencas: marcarTodosComo(r.presencas, status) }))
  }

  function salvar() {
    setChamadas((prev) => registrarChamada(prev, rascunho.turma, rascunho.data, rascunho.presencas, professor))
    setSalvoAgora(true)
    setEdicaoForcada(false)
  }

  const cards: { status: StatusChamada; value: number }[] = ordemStatusChamada.map((s) => ({
    status: s,
    value: resumo[s],
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
            className="size-8 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-primary-foreground pixel-shadow sm:text-base">
              Controle de Chamada
            </h1>
            <p className="truncate font-sans text-[13px] font-semibold uppercase tracking-widest text-danger">
              {rascunho.turma || "Selecione uma turma"} • {formatarDataBR(rascunho.data)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.status} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
                {statusChamadaInfo[c.status].label}
              </p>
              <p className={`mt-1 font-pixel text-base leading-none text-outline text-primary-foreground ${resumoCls[c.status]}`}>
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* Selecao de turma e data (req. 10.1) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            CHAMADA
          </span>
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Turma & Data da Aula
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 sm:col-span-1 lg:col-span-2">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Turma</span>
            <select
              value={rascunho.turma}
              onChange={(e) => selecionarTurma(e.target.value)}
              className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
            >
              {turmasParaChamada.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Data da aula</span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                type="date"
                value={rascunho.data}
                onChange={(e) => selecionarData(e.target.value)}
                className="w-full bg-transparent font-sans text-sm text-foreground focus:outline-none"
              />
            </span>
          </label>

          <div className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Situação da ficha</span>
            <span className="flex flex-wrap items-center gap-1.5 rounded-sm border border-panel-edge bg-panel-shade/20 px-2 py-1.5">
              {bloqueada ? (
                <>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={2.5} />
                  <span className="font-sans text-xs font-bold uppercase tracking-wide text-success">Salva</span>
                  <button
                    type="button"
                    onClick={reabrirParaEdicao}
                    className="ml-auto inline-flex items-center gap-1 rounded-sm border border-gold bg-gold/10 px-1.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-gold-foreground focus:outline-none"
                  >
                    <LockOpen className="h-3 w-3" strokeWidth={2.5} />
                    Reabrir para edição
                  </button>
                </>
              ) : jaSalva ? (
                <>
                  <LockOpen className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
                  <span className="font-sans text-xs font-bold uppercase tracking-wide text-gold">Editando ficha salva</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
                  <span className="font-sans text-xs font-bold uppercase tracking-wide text-gold">Rascunho não salvo</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2 transition-opacity",
            bloqueada && "pointer-events-none opacity-50",
          )}
        >
          <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Ações rápidas:</span>
          <button
            type="button"
            disabled={bloqueada}
            onClick={() => aplicarAtodos("presente")}
            className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-success hover:text-success focus:outline-none"
          >
            Marcar todos presentes
          </button>
          <button
            type="button"
            disabled={bloqueada}
            onClick={() => aplicarAtodos("aula_cancelada")}
            className="inline-flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-scoreboard hover:text-primary-foreground focus:outline-none"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
            Aula cancelada (todos)
          </button>
        </div>
      </section>

      {/* Lista de alunos da turma */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Lista de Presença
          </h2>
          <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-primary-foreground">
            {alunosTurma.length}
          </span>
        </header>

        {alunosTurma.length > 0 ? (
          <ul className="divide-y divide-panel-shade/60">
            {alunosTurma.map((aluno) => {
              const presenca = rascunho.presencas.find((p) => p.alunoId === aluno.id)
              return (
                <AlunoChamadaRow
                  key={aluno.id}
                  aluno={aluno}
                  status={presenca?.status ?? "presente"}
                  gols={presenca?.gols ?? 0}
                  pontualidade={presenca?.pontualidade ?? "no_horario"}
                  bloqueada={bloqueada}
                  onChange={(status) => alterarStatus(aluno.id, status)}
                  onChangeGols={(gols) => alterarGols(aluno.id, gols)}
                  onChangePontualidade={(pontualidade) => alterarPontualidade(aluno.id, pontualidade)}
                />
              )
            })}
          </ul>
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="font-pixel text-[13px] uppercase text-muted-foreground">Nenhum aluno matriculado nesta turma</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="hidden font-sans text-xs font-semibold text-muted-foreground sm:block">
            Professor(a): {professor}
          </p>
          <p className="font-sans text-xs font-semibold text-muted-foreground sm:hidden">{professor}</p>
          {bloqueada ? (
            <button
              type="button"
              onClick={reabrirParaEdicao}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold bg-transparent px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-gold transition-transform hover:-translate-y-0.5 hover:bg-gold hover:text-gold-foreground focus:outline-none"
            >
              <LockOpen className="h-3.5 w-3.5" strokeWidth={2.5} />
              Reabrir para edição
            </button>
          ) : (
            <button
              type="button"
              onClick={salvar}
              disabled={alunosTurma.length === 0}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
              {jaSalva ? "Salvar alterações" : "Salvar chamada"}
            </button>
          )}
        </div>
      </section>

      {/*
        Barra fixa no mobile: acesso rápido ao "Salvar chamada" sem precisar
        rolar até o fim da lista de alunos, pedido explicitamente para a
        experiência do professor no celular. Some no desktop (o botão da
        seção acima já é suficiente lá).
      */}
      {alunosTurma.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-panel-edge bg-card p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.35)] lg:hidden">
          {bloqueada ? (
            <button
              type="button"
              onClick={reabrirParaEdicao}
              className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-gold bg-transparent px-3 py-3 font-sans text-sm font-bold uppercase tracking-wide text-gold focus:outline-none"
            >
              <LockOpen className="h-4 w-4" strokeWidth={2.5} />
              Reabrir para edição
            </button>
          ) : (
            <button
              type="button"
              onClick={salvar}
              className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-gold bg-gold px-3 py-3 font-sans text-sm font-bold uppercase tracking-wide text-gold-foreground focus:outline-none"
            >
              <Save className="h-4 w-4" strokeWidth={2.5} />
              {jaSalva ? "Salvar alterações" : "Salvar chamada"}
            </button>
          )}
        </div>
      )}
      {/* Espaço reservado para a barra fixa não cobrir o histórico no mobile */}
      <div className="h-16 lg:hidden" aria-hidden />


      {/* Historico da turma selecionada */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <History className="h-4 w-4 shrink-0 text-primary-foreground" strokeWidth={2.5} />
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Chamadas já registradas nesta turma
          </h2>
        </header>

        {historicoTurma.length > 0 ? (
          <ul className="divide-y divide-panel-shade/60">
            {historicoTurma.map((c) => {
              const r = resumoChamada(c.presencas)
              const ativa = c.data === rascunho.data
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selecionarData(c.data)}
                    className={`flex w-full flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors ${
                      ativa ? "bg-gold/20" : "hover:bg-panel-shade/30"
                    }`}
                  >
                    <span className="font-sans text-sm font-bold text-foreground">{formatarDataBR(c.data)}</span>
                    <span className="flex flex-wrap gap-x-3 font-sans text-[13px] font-semibold text-muted-foreground">
                      <span className="text-success">{r.presente} presentes</span>
                      <span className="text-danger">{r.ausente} ausentes</span>
                      {r.ausencia_justificada > 0 && <span className="text-gold">{r.ausencia_justificada} justif.</span>}
                      {r.aula_cancelada > 0 && <span>{r.aula_cancelada} cancelada</span>}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="font-sans text-sm text-muted-foreground">Nenhuma chamada registrada ainda para esta turma.</p>
          </div>
        )}
      </section>

      {salvoAgora && (
        <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-success">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
          Chamada de {rascunho.turma} salva para {formatarDataBR(rascunho.data)}.
        </p>
      )}
    </>
  )
}
