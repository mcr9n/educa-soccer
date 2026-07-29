import Image from "next/image"

type Counter = { label: string; value: number; accent?: "green" | "gold" | "blue" | "danger" }

export function AlunosCounters({
  ativos,
  particulares,
  coletivos,
  exAlunos,
  porTurma,
}: {
  ativos: number
  particulares: number
  coletivos: number
  exAlunos: number
  porTurma: { turma: string; total: number }[]
}) {
  const principais: Counter[] = [
    { label: "Alunos Ativos", value: ativos, accent: "green" },
    { label: "Particulares", value: particulares, accent: "gold" },
    { label: "Coletivos", value: coletivos, accent: "blue" },
    { label: "Ex-Alunos", value: exAlunos, accent: "danger" },
  ]

  const accentClass: Record<NonNullable<Counter["accent"]>, string> = {
    green: "text-primary",
    gold: "text-gold",
    blue: "text-scoreboard",
    danger: "text-danger",
  }

  return (
    <header className="panel-bevel overflow-hidden rounded-md bg-card">
      <div className="flex items-center gap-3 bg-scoreboard px-3 py-2">
        <Image
          src="/educa-soccer-crest.png"
          alt="Brasão do Educa Soccer"
          width={32}
          height={32}
          className="shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
          priority
        />
        <div className="min-w-0">
          <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-primary-foreground pixel-shadow sm:text-base">
            Consulta de Alunos
          </h1>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-gold">
            Elenco Ativo
          </p>
        </div>
      </div>

      {/* Contadores principais */}
      <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-4">
        {principais.map((c) => (
          <div key={c.label} className="inset-bevel bg-card px-3 py-2">
            <p className="font-pixel text-[8px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className={`mt-1 font-pixel text-xl leading-none text-outline ${accentClass[c.accent ?? "green"]}`}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Total por turma */}
      <div className="flex flex-wrap items-center gap-2 border-t-2 border-panel-shade bg-card px-3 py-2">
        <span className="font-pixel text-[8px] uppercase tracking-wide text-muted-foreground">Por turma:</span>
        {porTurma.map((t) => (
          <span
            key={t.turma}
            className="inline-flex items-center gap-1 rounded-sm border border-panel-shade bg-panel-shade/40 px-1.5 py-0.5 inset-bevel"
          >
            <span className="font-sans text-[11px] font-bold uppercase text-foreground">{t.turma}</span>
            <span className="font-pixel text-[10px] text-gold">{t.total}</span>
          </span>
        ))}
      </div>
    </header>
  )
}
