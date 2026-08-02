import Image from "next/image"
import { resumo } from "@/lib/dashboard-data"

export function ScoreboardHeader() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  })

  return (
    <header className="panel-bevel rounded-md bg-card overflow-hidden">
      <div className="flex items-center gap-3 bg-scoreboard px-3 py-2">
        <Image
          src="/educa-soccer-crest.png"
          alt="Logotipo do EducaSoccer"
          width={44}
          height={44}
          className="shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
          priority
        />
        <div className="min-w-0">
          <h1 className="font-pixel text-xl sm:text-2xl font-extrabold uppercase leading-none tracking-tight truncate">
            <span className="text-primary-foreground">EDUCA</span>
            <span className="text-danger">SOCCER</span>
          </h1>
          <p className="mt-0.5 font-sans text-[11px] font-semibold uppercase tracking-widest text-danger">
            Painel do Técnico
          </p>
        </div>
        <div className="ml-auto hidden sm:block text-right">
          <p className="font-pixel text-[14px] uppercase text-danger">Temporada</p>
          <p className="font-sans text-sm font-bold text-primary-foreground capitalize">{hoje}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-panel-shade">
        <StatCell label="Alunos Ativos" value={resumo.alunosAtivos} />
        <StatCell label="Turmas" value={resumo.totalTurmas} />
        <StatCell label="Particulares" value={resumo.alunosParticulares} />
        <StatCell label="Coletivos" value={resumo.alunosColetivos} />
      </div>
    </header>
  )
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: "green"
}) {
  return (
    <div className="bg-card px-3 py-2 inset-bevel">
      <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={
          "font-pixel text-xl leading-none mt-1 text-outline " +
          (accent === "green" ? "text-primary" : "text-foreground")
        }
      >
        {value}
      </p>
    </div>
  )
}
