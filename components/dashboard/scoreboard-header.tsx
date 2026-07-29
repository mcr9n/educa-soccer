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
        <span className="shrink-0 rounded-sm bg-gold px-1.5 py-1 font-pixel text-[9px] leading-none text-gold-foreground">
          EDU
        </span>
        <Image
          src="/educa-soccer-crest.png"
          alt="Brasão do Educa Soccer"
          width={40}
          height={40}
          className="shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
          priority
        />
        <div className="min-w-0">
          <h1 className="font-pixel text-sm sm:text-base uppercase tracking-wide text-primary-foreground pixel-shadow truncate">
            Educa Soccer
          </h1>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold">
            Painel do Técnico
          </p>
        </div>
        <div className="ml-auto hidden sm:block text-right">
          <p className="font-pixel text-[9px] uppercase text-gold">Temporada</p>
          <p className="font-sans text-sm font-bold text-primary-foreground capitalize">{hoje}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-panel-shade">
        <StatCell label="Alunos Ativos" value={resumo.alunosAtivos} accent="green" />
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
      <p className="font-pixel text-[8px] uppercase tracking-wide text-muted-foreground">{label}</p>
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
