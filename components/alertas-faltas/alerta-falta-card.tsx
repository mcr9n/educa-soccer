"use client"

import { CalendarX2, MessageCircle, Phone, UsersRound } from "lucide-react"
import { formatarDataBR } from "@/lib/chamada-data"
import { linkContatoFaltas, type AlertaFalta } from "@/lib/alertas-faltas-data"

export function AlertaFaltaCard({ alerta }: { alerta: AlertaFalta }) {
  const { aluno, turma, quantidadeFaltas, datasFaltas } = alerta

  return (
    <li className="panel-bevel overflow-hidden rounded-md bg-card">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-sans text-base font-bold leading-tight text-foreground text-pretty">{aluno.nome}</h3>
            <span className="shrink-0 rounded-sm border-2 border-danger bg-danger px-1.5 py-0.5 font-pixel text-[13px] leading-none text-white">
              {quantidadeFaltas} FALTAS
            </span>
          </div>

          <p className="mt-1.5 flex items-center gap-1.5 font-sans text-[13px] font-semibold text-muted-foreground">
            <UsersRound className="h-3.5 w-3.5 shrink-0 text-scoreboard" strokeWidth={2.5} />
            {turma}
          </p>

          <p className="mt-1 flex items-start gap-1.5 font-sans text-[13px] text-muted-foreground">
            <CalendarX2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" strokeWidth={2.5} />
            <span>
              <span className="font-semibold text-foreground">Datas das ausências: </span>
              {datasFaltas.map(formatarDataBR).join(" • ")}
            </span>
          </p>

          <p className="mt-1 flex items-center gap-1.5 font-sans text-[13px] text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
            <span className="font-semibold text-foreground">{aluno.responsavel}</span> • {aluno.telefone}
          </p>
        </div>

        <a
          href={linkContatoFaltas(alerta)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm border-2 border-success bg-success px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wide text-success-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
          Entrar em contato
        </a>
      </div>
    </li>
  )
}
