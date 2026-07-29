"use client"

import {
  ChevronDown,
  MapPin,
  Clock,
  CalendarDays,
  UserRound,
  Users,
  ClipboardCheck,
  Wallet,
  Medal,
  Flag,
} from "lucide-react"
import type { Aluno } from "@/lib/alunos-data"
import type { Turma } from "@/lib/turmas-data"

/** Valor pseudo-aleatorio, porem estavel, a partir de uma semente textual. */
function seed(texto: string): number {
  let h = 0
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) >>> 0
  return h
}

export function TurmaCard({
  turma,
  matriculados,
  expandido,
  onToggle,
}: {
  turma: Turma
  matriculados: Aluno[]
  expandido: boolean
  onToggle: () => void
}) {
  const total = matriculados.length
  const s = seed(turma.id)
  // Painel resumido (mock) das aberturas exigidas pelo requisito 5.
  const frequencia = 78 + (s % 20) // 78% a 97%
  const pagosEmDia = Math.max(0, total - (s % Math.max(1, total + 1)) % 3)
  const pendentes = total - pagosEmDia
  const artilheiro = matriculados[s % Math.max(1, total)]?.nome ?? "—"
  const ultimoResultado = ["Vitória 3 x 1", "Empate 2 x 2", "Treino técnico", "Vitória 4 x 0"][s % 4]

  const lotacao = turma.limite ? Math.round((total / turma.limite) * 100) : null

  const ativa = turma.situacao === "ativa"

  return (
    <li className="panel-bevel overflow-hidden rounded-md bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expandido}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 focus:outline-none"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm font-pixel text-[9px] inset-bevel ${
            turma.modalidade === "particular"
              ? "bg-gold text-gold-foreground"
              : "bg-scoreboard text-primary-foreground"
          }`}
        >
          {turma.modalidade === "particular" ? "PAR" : "COL"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
            {turma.nome}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
            <span>{turma.faixaEtaria}</span>
            <span aria-hidden>•</span>
            <span>{turma.professor}</span>
          </span>
        </span>

        <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
          <Users className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
          <span className="font-pixel text-[10px] text-gold">
            {total}
            {turma.limite ? `/${turma.limite}` : ""}
          </span>
        </span>

        <span
          className={`shrink-0 rounded-sm border px-1.5 py-0.5 font-pixel text-[7px] uppercase leading-none ${
            ativa
              ? "border-primary bg-primary/15 text-primary"
              : "border-muted-foreground bg-panel-shade/40 text-muted-foreground"
          }`}
        >
          {ativa ? "Ativa" : "Inativa"}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expandido ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </button>

      {expandido && (
        <div className="border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-3">
          {/* Ficha da turma */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Info icon={MapPin} label="Local" value={turma.local} />
            <Info icon={CalendarDays} label="Dias das aulas" value={turma.dias.join(", ")} />
            <Info icon={Clock} label="Horário" value={turma.horario} />
            <Info icon={UserRound} label="Professor responsável" value={turma.professor} />
            <Info icon={Users} label="Faixa etária" value={turma.faixaEtaria} />
            <Info
              icon={Flag}
              label="Modalidade"
              value={turma.modalidade === "particular" ? "Particular" : "Coletiva"}
            />
          </div>

          {/* Alunos matriculados */}
          <Bloco tag="TIME" titulo="Alunos matriculados" contador={`${total}${turma.limite ? ` / ${turma.limite}` : ""}`}>
            {lotacao !== null && (
              <div className="mb-2">
                <div className="h-2 w-full overflow-hidden rounded-full bg-panel-shade inset-bevel">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${Math.min(100, lotacao)}%` }}
                  />
                </div>
                <p className="mt-1 font-sans text-[11px] text-muted-foreground">{lotacao}% da capacidade</p>
              </div>
            )}
            {total > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {matriculados.map((a) => (
                  <li
                    key={a.id}
                    className="inline-flex items-center gap-1 rounded-sm border border-panel-shade bg-card px-1.5 py-0.5"
                  >
                    <span className="font-pixel text-[8px] text-scoreboard">{a.numero}</span>
                    <span className="font-sans text-[11px] font-semibold text-foreground">{a.nome}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-sans text-[11px] text-muted-foreground">Nenhum aluno matriculado nesta turma.</p>
            )}
          </Bloco>

          {/* Aberturas do requisito 5: frequência, pagamentos, rankings, resultados */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Resumo icon={ClipboardCheck} label="Frequência média" valor={`${frequencia}%`} />
            <Resumo icon={Wallet} label="Pagamentos" valor={`${pagosEmDia} em dia • ${pendentes} pend.`} />
            <Resumo icon={Medal} label="Ranking (artilheiro)" valor={artilheiro} />
            <Resumo icon={Flag} label="Último resultado" valor={ultimoResultado} />
          </div>
        </div>
      )}
    </li>
  )
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-sans text-sm font-semibold text-foreground text-pretty">{value}</p>
      </div>
    </div>
  )
}

function Bloco({
  tag,
  titulo,
  contador,
  children,
}: {
  tag: string
  titulo: string
  contador?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-3 rounded-sm border border-panel-shade bg-card p-2.5">
      <header className="mb-2 flex items-center gap-2">
        <span className="rounded-sm bg-scoreboard px-1.5 py-0.5 font-pixel text-[7px] leading-none text-primary-foreground">
          {tag}
        </span>
        <h3 className="flex-1 font-pixel text-[8px] uppercase tracking-wide text-foreground">{titulo}</h3>
        {contador && <span className="font-pixel text-[9px] text-gold">{contador}</span>}
      </header>
      {children}
    </section>
  )
}

function Resumo({ icon: Icon, label, valor }: { icon: typeof MapPin; label: string; valor: string }) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-panel-shade bg-card px-2.5 py-2 inset-bevel">
      <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate font-sans text-sm font-bold text-foreground">{valor}</p>
      </div>
    </div>
  )
}
