"use client"

import { useState } from "react"
import {
  ChevronDown,
  Phone,
  Mail,
  Clock,
  Users,
  Wallet,
  Pencil,
  ArrowLeftRight,
  UserMinus,
  MessageCircle,
  Check,
  X,
  TextInitial
} from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import {
  type Aluno,
  calcularIdade,
  faixaEtaria,
  formatarData,
  linkWhatsApp,
  turmasDisponiveis,
} from "@/lib/alunos-data"
import { getTurma } from "@/lib/turmas-data"

function turmaVariant(modalidade: Aluno["modalidade"]) {
  return modalidade === "particular" ? "gold" : "blue"
}

/** Rotulo curto para o cabecalho: o local da turma (ex.: SUDOESTE). */
function localCurto(aluno: Aluno) {
  return (getTurma(aluno.turma)?.local ?? aluno.turma).toUpperCase()
}

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

export function AlunoCard({
  aluno,
  expandido,
  onToggle,
  onEditar,
  onTransferir,
  onMarcarExAluno,
}: {
  aluno: Aluno
  expandido: boolean
  onToggle: () => void
  onEditar: (id: string, dados: Partial<Aluno>) => void
  onTransferir: (id: string, turma: string) => void
  onMarcarExAluno: (id: string) => void
}) {
  const [modo, setModo] = useState<"none" | "editar" | "transferir">("none")
  const [telefone, setTelefone] = useState(aluno.telefone)
  const [email, setEmail] = useState(aluno.email)
  const [mensalidade, setMensalidade] = useState(String(aluno.mensalidade))
  const [novaTurma, setNovaTurma] = useState(aluno.turma)

  const idade = calcularIdade(aluno.dataNascimento)

  function salvarEdicao() {
    onEditar(aluno.id, { telefone, email, mensalidade: Number(mensalidade) || aluno.mensalidade })
    setModo("none")
  }

  function confirmarTransferencia() {
    onTransferir(aluno.id, novaTurma)
    setModo("none")
  }

  return (
    <li className="panel-bevel overflow-hidden rounded-md bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandido}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 focus:outline-none"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-scoreboard font-pixel text-[10px] text-primary-foreground inset-bevel">
          {aluno.numero}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">{aluno.nome}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[14px] text-muted-foreground">
            <span>{idade} anos</span>
            <span aria-hidden>•</span>
            <span>Resp.: {aluno.responsavel}</span>
          </span>
        </span>
        <PositionTag label={localCurto(aluno)} variant={turmaVariant(aluno.modalidade)} className="shrink-0" />
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>

      {expandido && (
        <div className="border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoLinha icon={Users} label="Turma" value={aluno.turma} />
            <InfoLinha icon={Wallet} label="Modalidade" value={aluno.modalidade === "particular" ? "Atendimento particular" : "Turma coletiva"} />
            <InfoLinha icon={Phone} label="Telefone do responsável" value={aluno.telefone} />
            <InfoLinha icon={Mail} label="E-mail" value={aluno.email || "—"} />
            <InfoLinha icon={Wallet} label="Mensalidade" value={`R$ ${aluno.mensalidade}`} />
            <InfoLinha icon={Clock} label="Nascimento / Faixa etária" value={`${formatarData(aluno.dataNascimento)} • ${faixaEtaria(idade)}`} />
            {aluno.observacoes && aluno.observacoes.trim() !== "" ? (
            <InfoLinha icon={TextInitial} label="Observações" value={aluno.observacoes}/>
            ) : null}
          </div>

          {modo === "editar" && (
            <div className="mt-3 grid gap-2 rounded-sm border border-panel-shade bg-card p-2 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[7px] uppercase text-muted-foreground">Telefone</span>
                <input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm text-foreground focus:border-gold focus:outline-none" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[7px] uppercase text-muted-foreground">E-mail</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm text-foreground focus:border-gold focus:outline-none" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[7px] uppercase text-muted-foreground">Mensalidade (R$)</span>
                <input type="number" value={mensalidade} onChange={(e) => setMensalidade(e.target.value)} className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm text-foreground focus:border-gold focus:outline-none" />
              </label>
            </div>
          )}

          {modo === "transferir" && (
            <div className="mt-3 flex flex-wrap items-end gap-2 rounded-sm border border-panel-shade bg-card p-2">
              <label className="flex flex-col gap-1">
                <span className="font-pixel text-[7px] uppercase text-muted-foreground">Nova turma</span>
                <select value={novaTurma} onChange={(e) => setNovaTurma(e.target.value)} className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1 font-sans text-sm font-semibold text-foreground focus:border-gold focus:outline-none">
                  {turmasDisponiveis.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {modo === "none" && (
              <>
                <ActionButton icon={Pencil} onClick={() => setModo("editar")}>Editar</ActionButton>
                <ActionButton icon={ArrowLeftRight} onClick={() => setModo("transferir")}>Transferir turma</ActionButton>                
                <ActionButton
                  icon={MessageCircle}
                  href={linkWhatsApp(aluno.telefone, aluno.nome)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </ActionButton>
                <ActionButton icon={UserMinus} tone="danger" onClick={() => onMarcarExAluno(aluno.id)}>Marcar ex-aluno</ActionButton>
              </>
            )}

            {modo === "editar" && (
              <>
                <ActionButton icon={Check} tone="confirm" onClick={salvarEdicao}>Salvar</ActionButton>
                <ActionButton icon={X} onClick={() => setModo("none")}>Cancelar</ActionButton>
              </>
            )}

            {modo === "transferir" && (
              <>
                <ActionButton icon={Check} tone="confirm" onClick={confirmarTransferencia}>Confirmar</ActionButton>
                <ActionButton icon={X} onClick={() => setModo("none")}>Cancelar</ActionButton>
              </>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function ActionButton({
  icon: Icon,
  children,
  onClick,
  href,
  target,
  rel,
  tone = "default",
}: {
  icon: typeof Pencil
  children: React.ReactNode
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  tone?: "default" | "danger" | "confirm"
}) {
  const tones = {
    default: "border-panel-edge bg-panel-shade/50 text-foreground hover:border-gold hover:bg-gold hover:text-gold-foreground",
    danger: "border-danger bg-danger/15 text-danger hover:bg-danger hover:text-white",
    confirm: "border-primary bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground",
  }

  const classes = `inline-flex items-center gap-1.5 rounded-sm border-2 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none ${tones[tone]}`

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {children}
    </button>
  )
}