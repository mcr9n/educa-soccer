"use client"

import { useMemo, useState } from "react"
import { AlertTriangle, Search, ShieldAlert, Users } from "lucide-react"
import { alunos, calcularIdade, faixaEtaria, faixasEtarias, turmasDisponiveis, type Aluno } from "@/lib/alunos-data"
import {
  atendeFaixaEtaria,
  idadeNaData,
  parseFaixaEtaria,
  timeDoAlunoNoTorneio,
  type TimeTorneio,
  type Torneio,
} from "@/lib/torneios-data"

type SituacaoFiltro = "ativos" | "todos"

const inputClasses =
  "w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2.5 py-1.5 font-sans text-sm font-medium text-foreground inset-bevel placeholder:text-muted-foreground focus:border-gold focus:outline-none"

/**
 * Lista de alunos com filtros (idade, faixa etaria, turma, modalidade e
 * situacao ativa) para montar o elenco de um time dentro de um torneio
 * (req. 8.2). Destaca alunos fora da faixa etaria do torneio e avisa
 * quando o aluno ja esta alocado em outro time do mesmo torneio.
 */
export function SeletorJogadores({
  torneio,
  jogadoresSelecionados,
  onToggleJogador,
  timeAtualId,
  timesDoTorneio,
  limite,
}: {
  torneio: Torneio
  jogadoresSelecionados: string[]
  onToggleJogador: (id: string) => void
  timeAtualId?: string
  timesDoTorneio: TimeTorneio[]
  limite: number
}) {
  const [busca, setBusca] = useState("")
  const [idadeFiltro, setIdadeFiltro] = useState("todas")
  const [faixaFiltro, setFaixaFiltro] = useState("todas")
  const [turmaFiltro, setTurmaFiltro] = useState("todas")
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas")
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoFiltro>("ativos")

  const faixaTorneio = useMemo(() => parseFaixaEtaria(torneio.categoria), [torneio.categoria])

  const idadesDisponiveis = useMemo(() => {
    const idades = new Set(alunos.map((a) => idadeNaData(a.dataNascimento, torneio.dataInicio)))
    return Array.from(idades).sort((a, b) => a - b)
  }, [torneio.dataInicio])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return alunos.filter((a) => {
      if (situacaoFiltro === "ativos" && !a.ativo) return false
      if (termo && !a.nome.toLowerCase().includes(termo)) return false
      if (turmaFiltro !== "todas" && a.turma !== turmaFiltro) return false
      if (modalidadeFiltro !== "todas" && a.modalidade !== modalidadeFiltro) return false

      const idade = idadeNaData(a.dataNascimento, torneio.dataInicio)
      if (idadeFiltro !== "todas" && idade !== Number(idadeFiltro)) return false
      if (faixaFiltro !== "todas" && faixaEtaria(idade) !== faixaFiltro) return false

      return true
    })
  }, [busca, turmaFiltro, modalidadeFiltro, idadeFiltro, faixaFiltro, situacaoFiltro, torneio.dataInicio])

  const cheio = jogadoresSelecionados.length >= limite

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
          <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Nome</span>
          <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
            <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar aluno..."
              className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Idade</span>
          <select value={idadeFiltro} onChange={(e) => setIdadeFiltro(e.target.value)} className={inputClasses}>
            <option value="todas">Todas</option>
            {idadesDisponiveis.map((idade) => (
              <option key={idade} value={idade}>
                {idade} anos
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Faixa etária</span>
          <select value={faixaFiltro} onChange={(e) => setFaixaFiltro(e.target.value)} className={inputClasses}>
            <option value="todas">Todas</option>
            {faixasEtarias.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Turma</span>
          <select value={turmaFiltro} onChange={(e) => setTurmaFiltro(e.target.value)} className={inputClasses}>
            <option value="todas">Todas</option>
            {turmasDisponiveis.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Modalidade</span>
          <select
            value={modalidadeFiltro}
            onChange={(e) => setModalidadeFiltro(e.target.value)}
            className={inputClasses}
          >
            <option value="todas">Todas</option>
            <option value="coletiva">Coletivo</option>
            <option value="particular">Particular</option>
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={situacaoFiltro === "ativos"}
            onChange={(e) => setSituacaoFiltro(e.target.checked ? "ativos" : "todos")}
            className="h-3.5 w-3.5 accent-gold"
          />
          <span className="font-sans text-xs font-semibold text-muted-foreground">Somente alunos ativos</span>
        </label>
        <span className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wide text-foreground">
          <Users className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
          <span className={cheio ? "text-danger" : "text-gold"}>
            {jogadoresSelecionados.length} / {limite}
          </span>
        </span>
      </div>

      <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto rounded-sm border border-panel-shade bg-panel-shade/20 p-1.5">
        {filtrados.length === 0 && (
          <li className="px-2 py-4 text-center font-sans text-sm text-muted-foreground">
            Nenhum aluno encontrado com estes filtros.
          </li>
        )}
        {filtrados.map((aluno) => {
          const idade = idadeNaData(aluno.dataNascimento, torneio.dataInicio)
          const dentroDaFaixa = atendeFaixaEtaria(idade, faixaTorneio)
          const outroTime = timeDoAlunoNoTorneio(timesDoTorneio, torneio.id, aluno.id, timeAtualId)
          const selecionado = jogadoresSelecionados.includes(aluno.id)
          const desabilitado = !selecionado && cheio

          return (
            <li key={aluno.id}>
              <label
                className={`flex items-center gap-2.5 rounded-sm border px-2 py-1.5 transition-colors ${
                  selecionado
                    ? "border-gold bg-gold/15"
                    : desabilitado
                      ? "cursor-not-allowed border-transparent opacity-50"
                      : "border-transparent hover:bg-card"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selecionado}
                  disabled={desabilitado}
                  onChange={() => onToggleJogador(aluno.id)}
                  className="h-4 w-4 shrink-0 accent-gold"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
                    {aluno.nome}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[12px] text-muted-foreground">
                    <span>{idade} anos</span>
                    <span aria-hidden>•</span>
                    <span className="truncate">{aluno.turma}</span>
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  {!dentroDaFaixa && (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-danger/15 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-danger">
                      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                      Fora da faixa
                    </span>
                  )}
                  {outroTime && (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-gold/20 px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-gold">
                      <ShieldAlert className="h-3 w-3" strokeWidth={2.5} />
                      Já no time {outroTime.nome}
                    </span>
                  )}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
