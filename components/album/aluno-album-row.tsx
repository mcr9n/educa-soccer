"use client"

import { useState } from "react"
import { ChevronDown, Sticker as StickerIcon } from "lucide-react"
import type { Aluno } from "@/lib/alunos-data"
import {
  albumDoAluno,
  formatarDataAlbum,
  varianteDoTipo,
  totalFigurinhasAluno,
  type FigurinhaConcedida,
  type TipoFigurinha,
} from "@/lib/album-data"
import { TipoFigurinhaBadge } from "./tipo-badge"

export type LinhaAlbum = { aluno: Aluno }

/** Grupo de alunos de uma turma, no mesmo padrão visual das demais telas do sistema. */
export function TurmaAlbum({
  turma,
  linhas,
  ano,
  concedidas,
  tipos,
  onConceder,
}: {
  turma: string
  linhas: LinhaAlbum[]
  ano: number
  concedidas: FigurinhaConcedida[]
  tipos: TipoFigurinha[]
  onConceder: (alunoId: string) => void
}) {
  const [aberto, setAberto] = useState(true)
  const totalTurma = linhas.reduce((s, l) => s + totalFigurinhasAluno(l.aluno.id, ano, concedidas), 0)

  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="flex w-full items-center gap-3 border-b-2 border-panel-shade bg-scoreboard px-3 py-2 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-pixel text-[14px] uppercase tracking-wide text-white pixel-shadow">
            {turma}
          </span>
          <span className="mt-1 block font-sans text-[13px] font-semibold text-white">
            {totalTurma} figurinha(s) entregue(s) em {ano}
          </span>
        </span>
        <span className="shrink-0 rounded-sm bg-panel-shade px-1.5 py-0.5 font-pixel text-[13px] text-white">
          {linhas.length}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white transition-transform ${aberto ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {aberto && (
        <ul className="divide-y divide-panel-shade/60">
          {linhas.map((linha) => (
            <AlunoAlbumRow
              key={linha.aluno.id}
              aluno={linha.aluno}
              ano={ano}
              concedidas={concedidas}
              tipos={tipos}
              onConceder={() => onConceder(linha.aluno.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function AlunoAlbumRow({
  aluno,
  ano,
  concedidas,
  tipos,
  onConceder,
}: {
  aluno: Aluno
  ano: number
  concedidas: FigurinhaConcedida[]
  tipos: TipoFigurinha[]
  onConceder: () => void
}) {
  const [expandido, setExpandido] = useState(false)
  const album = albumDoAluno(aluno.id, ano, concedidas, tipos)
  const total = album.reduce((s, r) => s + r.quantidade, 0)
  const historico = album
    .flatMap((r) => r.entregas.map((e) => ({ entrega: e, tipo: r.tipo })))
    .sort((a, b) => b.entrega.data.localeCompare(a.entrega.data))

  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setExpandido((e) => !e)}
          aria-expanded={expandido}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`}
            strokeWidth={2.5}
          />
          <span className="min-w-0">
            <span className="block truncate font-sans text-sm font-bold leading-tight text-foreground text-pretty">
              {aluno.nome}
            </span>
            <span className="mt-0.5 block font-sans text-[13px] text-muted-foreground">
              {total} figurinha(s) recebida(s) em {ano}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          {album.map((r) => (
            <TipoFigurinhaBadge key={r.tipo.id} tipo={r.tipo} quantidade={r.quantidade} variant={varianteDoTipo(r.tipo.id, tipos)} />
          ))}
        </div>

        <button
          type="button"
          onClick={onConceder}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2.5 py-1.5 font-pixel text-[13px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <StickerIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          Conceder
        </button>
      </div>

      {expandido && (
        <div className="mt-2 rounded-sm border border-panel-shade bg-panel-shade/20 p-2">
          {historico.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {historico.map(({ entrega, tipo }) => (
                <li
                  key={entrega.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-0.5 border-b border-panel-shade/60 pb-1.5 font-sans text-[11px] text-muted-foreground last:border-0 last:pb-0"
                >
                  <span className="font-bold text-foreground">{tipo.personagem}</span>
                  <span>{formatarDataAlbum(entrega.data)}</span>
                  <span className="text-pretty">Motivo: {entrega.motivo}</span>
                  <span>Prof.: {entrega.professor}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-[11px] text-muted-foreground">
              Nenhuma figurinha recebida em {ano} ainda.
            </p>
          )}
        </div>
      )}
    </li>
  )
}
