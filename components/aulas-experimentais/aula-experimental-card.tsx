"use client"

import { useState } from "react"
import {
  Baby,
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  MessageCircle,
  Phone,
  Radio,
  StickyNote,
  Users,
} from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import {
  type AulaExperimental,
  type SituacaoContato,
  formatarDataBR,
  linkWhatsApp,
  situacaoTag,
  situacaoVariant,
  situacoesContato,
} from "@/lib/aulas-experimentais-data"

function InfoLinha({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-sans text-sm font-semibold text-foreground text-pretty">{value}</p>
      </div>
    </div>
  )
}

export function AulaExperimentalCard({
  item,
  expandido,
  onToggle,
  onEditar,
  onMudarSituacao,
}: {
  item: AulaExperimental
  expandido: boolean
  onToggle: () => void
  onEditar: (id: string, dados: Partial<AulaExperimental>) => void
  onMudarSituacao: (id: string, situacao: SituacaoContato) => void
}) {
  const [observacoes, setObservacoes] = useState(item.observacoes)
  const [dataAula, setDataAula] = useState(item.dataAulaExperimental ?? "")

  function salvarObservacoes() {
    if (observacoes !== item.observacoes) onEditar(item.id, { observacoes })
  }

  function salvarDataAula(valor: string) {
    setDataAula(valor)
    onEditar(item.id, { dataAulaExperimental: valor || null })
  }

  return (
    <li className="panel-bevel overflow-hidden rounded-md bg-card">
      {/* Cabeçalho da linha */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandido}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 focus:outline-none"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-panel-shade text-muted-foreground inset-bevel">
          <Baby className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
            {item.nomeCrianca} <span className="font-normal text-muted-foreground">• {item.idade}</span>
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[13px] text-muted-foreground">
            <span>Resp.: {item.nomeResponsavel}</span>
            <span aria-hidden>•</span>
            <span>{item.turmaInteresse}</span>
          </span>
        </span>
        <PositionTag label={situacaoTag(item.situacao)} variant={situacaoVariant(item.situacao)} className="hidden shrink-0 sm:inline-flex" />
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {/* Detalhes expandidos */}
      {expandido && (
        <div className="border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoLinha icon={Phone} label="Telefone do responsável" value={item.telefone} />
            <InfoLinha icon={CalendarPlus} label="Data do primeiro contato" value={formatarDataBR(item.dataPrimeiroContato)} />
            <InfoLinha icon={Radio} label="Origem do contato" value={item.origemContato} />
            <InfoLinha icon={Users} label="Turma de interesse" value={item.turmaInteresse} />
          </div>

          {/* Situacao do atendimento */}
          <div className="mt-3 flex flex-wrap items-end gap-2 rounded-sm border border-panel-shade bg-card p-2">
            <label className="flex flex-col gap-1">
              <span className="font-pixel text-[9px] uppercase text-muted-foreground">Situação do atendimento</span>
              <select
                value={item.situacao}
                onChange={(e) => onMudarSituacao(item.id, e.target.value as SituacaoContato)}
                className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm font-semibold text-foreground focus:border-gold focus:outline-none"
              >
                {situacoesContato.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-pixel text-[9px] uppercase text-muted-foreground">
                <CalendarClock className="mr-1 inline h-3 w-3" strokeWidth={2.5} />
                Data da aula experimental
              </span>
              <input
                type="date"
                value={dataAula}
                onChange={(e) => salvarDataAula(e.target.value)}
                className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm font-semibold text-foreground focus:border-gold focus:outline-none"
              />
            </label>
          </div>

          {/* Observacoes */}
          <label className="mt-3 flex flex-col gap-1">
            <span className="flex items-center gap-1.5 font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              <StickyNote className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
              Observações
            </span>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              onBlur={salvarObservacoes}
              rows={2}
              placeholder="Registre detalhes da conversa, preferências de horário, etc."
              className="w-full resize-y rounded-sm border border-panel-edge bg-panel-shade/60 px-2.5 py-1.5 font-sans text-sm font-medium text-foreground inset-bevel placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </label>

          {/* Acoes */}
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={linkWhatsApp(item.telefone, item.nomeCrianca)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-sm border-2 border-primary bg-primary/15 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </li>
  )
}
