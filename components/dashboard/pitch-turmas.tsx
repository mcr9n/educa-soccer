"use client"

import { turmas } from "@/lib/dashboard-data"
import { RetroPanel } from "./retro-panel"

// Posicoes dos "jogadores" (turmas) no campo, no estilo formacao 4-3-1-2.
const posicoes = [
  { top: "50%", left: "10%" }, // goleiro
  { top: "26%", left: "30%" },
  { top: "74%", left: "30%" },
  { top: "40%", left: "52%" },
  { top: "60%", left: "52%" },
  { top: "50%", left: "72%" },
]

export function PitchTurmas({ onSelect }: { onSelect: (area: string) => void }) {
  return (
    <RetroPanel title="Alunos por Turma" tag="4-3-1-2" className="h-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border-2 border-field-line/40 bg-field inset-bevel">
        {/* Linhas do campo */}
        <svg
          viewBox="0 0 320 200"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" stroke="var(--field-line)" strokeWidth="1.5">
            <rect x="4" y="4" width="312" height="192" />
            <line x1="160" y1="4" x2="160" y2="196" />
            <circle cx="160" cy="100" r="26" />
            <circle cx="160" cy="100" r="2" fill="var(--field-line)" />
            <rect x="4" y="55" width="46" height="90" />
            <rect x="270" y="55" width="46" height="90" />
            <rect x="4" y="78" width="18" height="44" />
            <rect x="298" y="78" width="18" height="44" />
          </g>
          {/* Faixas de grama */}
          <g fill="oklch(1 0 0 / 5%)">
            <rect x="4" y="4" width="52" height="192" />
            <rect x="108" y="4" width="52" height="192" />
            <rect x="212" y="4" width="52" height="192" />
          </g>
        </svg>

        {/* Turmas como jogadores */}
        {turmas.map((turma, i) => {
          const pos = posicoes[i] ?? { top: "50%", left: "50%" }
          const cor = turma.modalidade === "particular" ? "bg-gold" : "bg-scoreboard"
          const corText = turma.modalidade === "particular" ? "text-gold-foreground" : "text-primary-foreground"
          return (
            <button
              key={turma.id}
              type="button"
              onClick={() => onSelect(`Turma ${turma.nome}`)}
              style={{ top: pos.top, left: pos.left }}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 focus:outline-none"
              aria-label={`Turma ${turma.nome}, ${turma.totalAlunos} alunos`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/70 ${cor} ${corText} font-pixel text-[9px] shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-gold`}
              >
                {turma.totalAlunos}
              </span>
              <span className="whitespace-nowrap rounded-sm bg-panel-shade/90 px-1.5 py-0.5 font-pixel text-[7px] uppercase leading-none text-primary-foreground">
                {turma.nome}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 font-pixel text-[8px] uppercase text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-scoreboard border border-white/60" /> Coletiva
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-gold border border-white/60" /> Particular
        </span>
        <span className="text-gold">Toque para abrir</span>
      </div>
    </RetroPanel>
  )
}
