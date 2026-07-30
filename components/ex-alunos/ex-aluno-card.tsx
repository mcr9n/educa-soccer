"use client"

import { useState } from "react"
import {
  ChevronDown,
  Phone,
  Mail,
  Users,
  Wallet,
  CalendarPlus,
  CalendarX,
  LogOut,
  MessageCircle,
  RotateCcw,
  Check,
  X,
  TrendingUp,
  Target,
  StickyNote,
} from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import {
  type ExAluno,
  avaliacaoVariant,
  formatarDataBR,
  linkWhatsApp,
  pagamentoVariant,
  tempoPermanencia,
  turmasDisponiveis,
} from "@/lib/ex-alunos-data"

function InfoLinha({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-[9px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-sans text-sm font-semibold text-foreground text-pretty">{value}</p>
      </div>
    </div>
  )
}

export function ExAlunoCard({
  exAluno,
  expandido,
  onToggle,
  onReativar,
}: {
  exAluno: ExAluno
  expandido: boolean
  onToggle: () => void
  onReativar: (id: string, turma: string) => void
}) {
  const [modo, setModo] = useState<"none" | "reativar">("none")
  const [novaTurma, setNovaTurma] = useState(exAluno.turmaAnterior)

  function confirmarReativacao() {
    onReativar(exAluno.id, novaTurma)
    setModo("none")
  }

  const d = exAluno.desempenho

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
          <LogOut className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
            {exAluno.nome}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
            <span>Saída: {formatarDataBR(exAluno.dataSaida)}</span>
            <span aria-hidden>•</span>
            <span>Resp.: {exAluno.responsavel}</span>
          </span>
        </span>
        <PositionTag label={exAluno.motivoSaida.split(" ")[0]} variant="danger" className="hidden shrink-0 sm:inline-flex" />
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {/* Detalhes expandidos */}
      {expandido && (
        <div className="border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-3">
          {/* Cadastro preservado */}
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoLinha icon={Users} label="Turma anterior" value={exAluno.turmaAnterior} />
            <InfoLinha
              icon={Wallet}
              label="Modalidade anterior"
              value={exAluno.modalidadeAnterior === "particular" ? "Atendimento particular" : "Turma coletiva"}
            />
            <InfoLinha icon={Phone} label="Telefone do responsável" value={exAluno.telefone} />
            <InfoLinha icon={Mail} label="E-mail" value={exAluno.email || "—"} />
            <InfoLinha icon={CalendarPlus} label="Data de entrada" value={formatarDataBR(exAluno.dataEntrada)} />
            <InfoLinha
              icon={CalendarX}
              label="Data de saída"
              value={`${formatarDataBR(exAluno.dataSaida)} • ${tempoPermanencia(exAluno.dataEntrada, exAluno.dataSaida)}`}
            />
            <InfoLinha icon={LogOut} label="Motivo da saída" value={exAluno.motivoSaida} />
            <InfoLinha icon={StickyNote} label="Observações" value={exAluno.observacoes} />
          </div>

          {/* Histórico de frequência e desempenho */}
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <section className="rounded-sm border border-panel-shade bg-card p-3">
              <h4 className="mb-2 flex items-center gap-1.5 font-pixel text-[11px] uppercase tracking-wide text-primary-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
                Frequência & Desempenho
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <PositionTag label={d.avaliacao} variant={avaliacaoVariant(d.avaliacao)} />
                <span className="inline-flex items-center gap-1 rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-xs font-bold text-foreground">
                  <Target className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
                  {d.gols} gols
                </span>
              </div>
              {/* Barra de frequência */}
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between font-sans text-[11px] font-semibold text-muted-foreground">
                  <span>Frequência</span>
                  <span className="text-foreground">
                    {d.frequencia}% ({d.totalPresencas}/{d.totalAulas})
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-sm bg-panel-shade inset-bevel">
                  <div
                    className={`h-full ${d.frequencia >= 85 ? "bg-primary" : d.frequencia >= 75 ? "bg-gold" : "bg-danger"}`}
                    style={{ width: `${d.frequencia}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 font-sans text-xs text-muted-foreground text-pretty">{d.observacaoTecnica}</p>
            </section>

            {/* Histórico de pagamentos */}
            <section className="rounded-sm border border-panel-shade bg-card p-3">
              <h4 className="mb-2 flex items-center gap-1.5 font-pixel text-[11px] uppercase tracking-wide text-primary-foreground">
                <Wallet className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
                Histórico de Pagamentos
              </h4>
              <ul className="flex flex-col gap-1">
                {exAluno.historicoPagamentos.map((p) => (
                  <li
                    key={`${p.mes}-${p.ano}`}
                    className="flex items-center justify-between gap-2 rounded-sm bg-panel-shade/40 px-2 py-1"
                  >
                    <span className="font-sans text-xs font-semibold text-foreground">
                      {p.mes} / {p.ano}
                    </span>
                    <PositionTag
                      label={p.situacao === "pago" ? "Pago" : p.situacao === "atrasado" ? "Atrasado" : "Isento"}
                      variant={pagamentoVariant(p.situacao)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Seletor de nova turma na reativação */}
          {modo === "reativar" && (
            <div className="mt-3 flex flex-wrap items-end gap-2 rounded-sm border border-panel-shade bg-card p-2">
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[9px] uppercase text-muted-foreground">Nova turma</span>
                <select
                  value={novaTurma}
                  onChange={(e) => setNovaTurma(e.target.value)}
                  className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm font-semibold text-foreground focus:border-gold focus:outline-none"
                >
                  {turmasDisponiveis.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Ações */}
          <div className="mt-3 flex flex-wrap gap-2">
            {modo === "none" && (
              <>
                <a
                  href={linkWhatsApp(exAluno.telefone, exAluno.nome)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-primary bg-primary/15 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setModo("reativar")}
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold bg-gold/15 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-gold transition-colors hover:bg-gold hover:text-gold-foreground focus:outline-none"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Reativar matrícula
                </button>
              </>
            )}

            {modo === "reativar" && (
              <>
                <button
                  type="button"
                  onClick={confirmarReativacao}
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-primary bg-primary/15 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Confirmar reativação
                </button>
                <button
                  type="button"
                  onClick={() => setModo("none")}
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus:outline-none"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </li>
  )
}
