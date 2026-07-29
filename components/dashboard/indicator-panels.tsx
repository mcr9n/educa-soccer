"use client"

import type { ReactNode } from "react"
import {
  pagamentosPendentes,
  faltasConsecutivas,
  aulasExperimentais,
  uniformesPendentes,
  torneios,
} from "@/lib/dashboard-data"
import { RetroPanel } from "./retro-panel"
import { PositionTag } from "./position-tag"

type SelectFn = (area: string) => void
const noop: SelectFn = () => {}

function Row({
  tag,
  tagVariant,
  name,
  meta,
  right,
  onClick,
}: {
  tag: string
  tagVariant?: "default" | "gold" | "green" | "danger" | "blue"
  name: string
  meta?: string
  right?: ReactNode
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-2 rounded-sm border border-transparent px-2 py-1.5 text-left transition-colors hover:border-gold hover:bg-gold/15 focus-visible:border-gold focus-visible:bg-gold/15 focus:outline-none"
      >
        <PositionTag label={tag} variant={tagVariant} className="w-11 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">{name}</span>
          {meta && <span className="mt-0.5 block truncate font-sans text-[11px] text-muted-foreground">{meta}</span>}
        </span>
        {right}
      </button>
    </li>
  )
}

function CountBadge({ n, tone }: { n: number; tone: "danger" | "gold" | "green" | "blue" }) {
  const map = {
    danger: "text-danger",
    gold: "text-gold",
    green: "text-primary",
    blue: "text-scoreboard",
  }
  return <span className={`font-pixel text-sm text-outline ${map[tone]}`}>{n}</span>
}

export function PagamentosPanel({ onSelect = noop }: { onSelect?: SelectFn }) {
  const total = pagamentosPendentes.reduce((s, p) => s + p.valor, 0)
  return (
    <RetroPanel
      title="Pagamentos Pendentes"
      tag="R$"
      right={<span className="font-pixel text-[9px] text-gold">R$ {total.toLocaleString("pt-BR")}</span>}
      className="h-full"
      maxBodyHeight={340}
    >
      <ul className="flex flex-col gap-0.5">
        {pagamentosPendentes.map((p) => (
          <Row
            key={p.id}
            tag={p.situacao === "atrasado" ? "ATR" : "PEND"}
            tagVariant={p.situacao === "atrasado" ? "danger" : "gold"}
            name={p.aluno}
            meta={`${p.turma} • ${p.mesReferencia} • ${p.diasAtraso}d`}
            right={<span className="font-pixel text-[11px] text-foreground">R${p.valor}</span>}
            onClick={() => onSelect(`Cobrança de ${p.aluno}`)}
          />
        ))}
      </ul>
    </RetroPanel>
  )
}

export function FaltasPanel({ onSelect = noop }: { onSelect?: SelectFn }) {
  return (
    <RetroPanel
      title="Faltas Consecutivas"
      tag="!"
      right={<span className="font-pixel text-[9px] text-danger">{faltasConsecutivas.length} alerta(s)</span>}
      className="h-full"
      maxBodyHeight={340}
    >
      <ul className="flex flex-col gap-0.5">
        {faltasConsecutivas.map((f) => (
          <Row
            key={f.id}
            tag="FALT"
            tagVariant="danger"
            name={f.aluno}
            meta={`${f.turma} • última ${f.ultimaAusencia}`}
            right={<CountBadge n={f.faltas} tone="danger" />}
            onClick={() => onSelect(`Contatar responsável de ${f.aluno}`)}
          />
        ))}
      </ul>
    </RetroPanel>
  )
}

export function ExperimentaisPanel({ onSelect = noop }: { onSelect?: SelectFn }) {
  const tagFor = (s: string) => (s === "agendada" ? "AGD" : s === "aguardando" ? "AGU" : "OK")
  const variantFor = (s: string) => (s === "agendada" ? "green" : s === "aguardando" ? "gold" : "blue")
  return (
    <RetroPanel
      title="Aulas Experimentais"
      tag="EXP"
      right={<span className="font-pixel text-[9px] text-gold">{aulasExperimentais.length}</span>}
      className="h-full"
      maxBodyHeight={300}
    >
      <ul className="flex flex-col gap-0.5">
        {aulasExperimentais.map((e) => (
          <Row
            key={e.id}
            tag={tagFor(e.situacao)}
            tagVariant={variantFor(e.situacao) as "green" | "gold" | "blue"}
            name={e.crianca}
            meta={`${e.idade} anos • ${e.turmaInteresse} • ${e.data}`}
            onClick={() => onSelect(`Aula experimental de ${e.crianca}`)}
          />
        ))}
      </ul>
    </RetroPanel>
  )
}

export function UniformesPanel({ onSelect = noop }: { onSelect?: SelectFn }) {
  const tagFor = (s: string) => (s.includes("pagamento") ? "$" : s.includes("produção") ? "PROD" : "ENTR")
  const variantFor = (s: string) => (s.includes("pagamento") ? "danger" : s.includes("produção") ? "gold" : "green")
  return (
    <RetroPanel
      title="Uniformes Pendentes"
      tag="#"
      right={<span className="font-pixel text-[9px] text-gold">{uniformesPendentes.length}</span>}
      className="h-full"
      maxBodyHeight={300}
    >
      <ul className="flex flex-col gap-0.5">
        {uniformesPendentes.map((u) => (
          <Row
            key={u.id}
            tag={tagFor(u.situacao)}
            tagVariant={variantFor(u.situacao) as "danger" | "gold" | "green"}
            name={u.aluno}
            meta={`${u.turma} • ${u.situacao}`}
            right={<span className="font-pixel text-sm text-outline text-foreground">{u.numero}</span>}
            onClick={() => onSelect(`Uniforme de ${u.aluno}`)}
          />
        ))}
      </ul>
    </RetroPanel>
  )
}

export function TorneiosPanel({ onSelect = noop }: { onSelect?: SelectFn }) {
  const variantFor = (s: string) => (s === "confirmado" ? "green" : s === "em andamento" ? "blue" : "gold")
  return (
    <RetroPanel
      title="Próximos Torneios"
      tag="CUP"
      right={<span className="font-pixel text-[9px] text-gold">{torneios.length}</span>}
      className="h-full"
      maxBodyHeight={300}
    >
      <ul className="flex flex-col gap-0.5">
        {torneios.map((t) => (
          <Row
            key={t.id}
            tag={t.data}
            tagVariant={variantFor(t.situacao) as "green" | "blue" | "gold"}
            name={t.nome}
            meta={`${t.categoria} • ${t.local}`}
            right={
              <span className="font-pixel text-[8px] uppercase text-muted-foreground">{t.situacao}</span>
            }
            onClick={() => onSelect(`Torneio ${t.nome}`)}
          />
        ))}
      </ul>
    </RetroPanel>
  )
}
