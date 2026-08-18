"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { CalendarDays, Save, CheckCircle2, ClipboardList, CalendarClock, Trophy, Pencil } from "lucide-react"
import { chamadasIniciais, dataAtualPadrao, turmasParaChamada, formatarDataBR, chamadaExistente } from "@/lib/chamada-data"
import {
  notasDiariasIniciais,
  notasMensaisIniciais,
  alunosDaTurmaNotas,
  presencaDoAluno,
  notaDiariaExistente,
  registrarNotaDiaria,
  totalNotaDiaria,
  notaMensalExistente,
  registrarNotaMensal,
  totalNotaMensal,
  mesesDoAnoLetivo,
  mesReferencia,
  formatarMesReferencia,
  calcularPontuacaoAnual,
  classificarAlunoDestaque,
  ordemCriteriosMensais,
  criterioMensalInfo,
  type NotaDiaria,
  type NotaMensal,
} from "@/lib/notas-data"
import { AlunoNotaRow } from "./aluno-nota-row"
import { LancamentosMesForm } from "./lancamentos-mes-form"
import { DestaqueRanking } from "./destaque-ranking"

type Secao = "diario" | "mensal" | "destaque"

const anoAtual = 2026

const secoes: { id: Secao; label: string; icon: typeof ClipboardList }[] = [
  { id: "diario", label: "Lançamento diário", icon: ClipboardList },
  { id: "mensal", label: "Lançamentos do mês", icon: CalendarClock },
  { id: "destaque", label: "Aluno destaque", icon: Trophy },
]

export function NotasView() {
  const [secao, setSecao] = useState<Secao>("diario")

  const [notasDiarias, setNotasDiarias] = useState<NotaDiaria[]>(notasDiariasIniciais)
  const [notasMensais, setNotasMensais] = useState<NotaMensal[]>(notasMensaisIniciais)

  const [turma, setTurma] = useState(turmasParaChamada[0] ?? "")
  const [data, setData] = useState(dataAtualPadrao)
  const [mes, setMes] = useState("07")
  const [salvoAgora, setSalvoAgora] = useState(false)
  const [alunoEmEdicaoMensal, setAlunoEmEdicaoMensal] = useState<string | null>(null)

  const alunosTurma = useMemo(() => alunosDaTurmaNotas(turma), [turma])
  const chamadaDoDia = useMemo(() => chamadaExistente(chamadasIniciais, turma, data), [turma, data])
  const mesRef = mesReferencia(anoAtual, mes)

  function alterarNotaDiaria(alunoId: string, campo: "comportamento" | "participacao" | "uniforme", valor: number) {
    setSalvoAgora(false)
    setNotasDiarias((prev) => registrarNotaDiaria(prev, turma, data, alunoId, { [campo]: valor }))
  }

  function salvarNotasDiarias() {
    setSalvoAgora(true)
  }

  const totalTurmaDia = useMemo(
    () =>
      alunosTurma.reduce(
        (soma, aluno) => soma + totalNotaDiaria(notasDiarias, chamadasIniciais, turma, data, aluno.id),
        0,
      ),
    [alunosTurma, notasDiarias, turma, data],
  )

  const pontuacaoAnual = useMemo(
    () => calcularPontuacaoAnual(alunosTurma, chamadasIniciais, notasDiarias, notasMensais, turma, anoAtual),
    [alunosTurma, notasDiarias, notasMensais, turma],
  )
  const ranking = useMemo(() => classificarAlunoDestaque(pontuacaoAnual), [pontuacaoAnual])

  const alunoEmEdicao = alunoEmEdicaoMensal ? alunosTurma.find((a) => a.id === alunoEmEdicaoMensal) : undefined

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
              Notas
            </h1>
            <p className="truncate font-sans text-[13px] font-semibold uppercase tracking-widest text-danger">
              {turma || "Selecione uma turma"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-panel-shade sm:grid-cols-3">
          {secoes.map((s) => {
            const Icon = s.icon
            const ativo = secao === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSecao(s.id)}
                className={`inset-bevel flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                  ativo ? "bg-gold text-gold-foreground" : "bg-card text-foreground hover:bg-panel-shade/30"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                <span className="font-pixel text-[13px] uppercase leading-none tracking-wide">{s.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Seletor de turma (comum às três seções) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Turma</span>
            <select
              value={turma}
              onChange={(e) => {
                setTurma(e.target.value)
                setSalvoAgora(false)
              }}
              className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
            >
              {turmasParaChamada.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          {secao === "diario" && (
            <label className="flex flex-col gap-1">
              <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Data da aula</span>
              <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
                <input
                  type="date"
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value)
                    setSalvoAgora(false)
                  }}
                  className="w-full bg-transparent font-sans text-sm text-foreground focus:outline-none"
                />
              </span>
            </label>
          )}

          {secao === "mensal" && (
            <label className="flex flex-col gap-1">
              <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Mês</span>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
              >
                {mesesDoAnoLetivo.map((m) => (
                  <option key={m} value={m}>
                    {formatarMesReferencia(mesReferencia(anoAtual, m))}
                  </option>
                ))}
              </select>
            </label>
          )}

          {secao === "destaque" && (
            <div className="flex flex-col gap-1">
              <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Ano</span>
              <span className="flex items-center rounded-sm border border-panel-edge bg-panel-shade/20 px-2 py-1.5 font-sans text-sm font-semibold text-foreground">
                {anoAtual}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Seção: lançamento diário */}
      {secao === "diario" && (
        <section className="panel-bevel overflow-hidden rounded-md bg-card">
          <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
                NOTA
              </span>
              <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
                {formatarDataBR(data)}
              </h2>
            </div>
            <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-primary-foreground">
              {alunosTurma.length}
            </span>
          </header>

          {!chamadaDoDia && (
            <p className="border-b-2 border-panel-shade bg-gold/10 px-3 py-2 font-sans text-xs text-muted-foreground text-[13px]">
              Ainda não há chamada registrada para esta turma nesta data. Presença e pontualidade aparecerão
              automaticamente após a chamada ser feita.
            </p>
          )}

          {alunosTurma.length > 0 ? (
            <ul className="divide-y divide-panel-shade/60">
              {alunosTurma.map((aluno) => (
                <AlunoNotaRow
                  key={aluno.id}
                  aluno={aluno}
                  presenca={presencaDoAluno(chamadasIniciais, turma, data, aluno.id)}
                  notaDiaria={notaDiariaExistente(notasDiarias, turma, data, aluno.id)}
                  onChange={(campo, valor) => alterarNotaDiaria(aluno.id, campo, valor)}
                />
              ))}
            </ul>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="font-pixel text-[13px] uppercase text-muted-foreground">Nenhum aluno matriculado nesta turma</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
            <p className="font-sans text-xs font-semibold text-muted-foreground text-[13px]">
              Total da turma no dia: <span className="text-gold">{totalTurmaDia} pts</span>
            </p>
            <button
              type="button"
              onClick={salvarNotasDiarias}
              disabled={alunosTurma.length === 0}
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={2.5} />
              Salvar lançamentos
            </button>
          </div>
        </section>
      )}

      {/* Seção: lançamentos do mês */}
      {secao === "mensal" && (
        <section className="panel-bevel overflow-hidden rounded-md bg-card">
          <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
            <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
              {formatarMesReferencia(mesRef)}
            </h2>
            <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-primary-foreground">
              {alunosTurma.length}
            </span>
          </header>

          <p className="border-b-2 border-panel-shade bg-panel-shade/20 px-3 py-2 font-sans text-xs text-muted-foreground">
            Testes, Eventos, Boletim e Amigo matriculado são lançamentos pontuais: um único valor por aluno neste mês.
          </p>

          {alunosTurma.length > 0 ? (
            <ul className="divide-y divide-panel-shade/60">
              {alunosTurma.map((aluno) => {
                const lancamento = notaMensalExistente(notasMensais, aluno.id, mesRef)
                const total = totalNotaMensal(notasMensais, aluno.id, mesRef)
                const totalMaximo = ordemCriteriosMensais.reduce(
                  (soma, c) => soma + criterioMensalInfo[c].pontuacaoMaxima,
                  0,
                )
                return (
                  <li key={aluno.id} className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</p>
                      <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">
                        {ordemCriteriosMensais
                          .map((c) => `${criterioMensalInfo[c].abrev} ${lancamento?.[c] ?? 0}`)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-sm border border-panel-shade bg-panel-shade/30 px-2 py-1 font-pixel text-sm leading-none text-gold">
                        {total}/{totalMaximo}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAlunoEmEdicaoMensal(aluno.id)}
                        className="inline-flex items-center gap-1 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
                      >
                        <Pencil className="h-3 w-3" strokeWidth={2.5} />
                        Lançar
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="font-pixel text-[13px] uppercase text-muted-foreground">Nenhum aluno matriculado nesta turma</p>
            </div>
          )}
        </section>
      )}

      {/* Seção: aluno destaque */}
      {secao === "destaque" && (
        <section className="panel-bevel overflow-hidden rounded-md bg-card">
          <header className="flex items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
            <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
              Classificação de {anoAtual}
            </h2>
            <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-primary-foreground">
              {ranking.length}
            </span>
          </header>
          <DestaqueRanking ranking={ranking} />
        </section>
      )}

      {salvoAgora && (
        <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-success">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
          Lançamentos de {turma} salvos para {formatarDataBR(data)}.
        </p>
      )}

      {alunoEmEdicao && (
        <LancamentosMesForm
          aluno={alunoEmEdicao}
          mes={mesRef}
          notaMensal={notaMensalExistente(notasMensais, alunoEmEdicao.id, mesRef)}
          onClose={() => setAlunoEmEdicaoMensal(null)}
          onSalvar={(valores) => setNotasMensais((prev) => registrarNotaMensal(prev, alunoEmEdicao.id, mesRef, valores))}
        />
      )}
    </>
  )
}
