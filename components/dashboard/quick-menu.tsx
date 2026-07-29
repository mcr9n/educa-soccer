"use client"

import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UsersRound,
  Wallet,
  ClipboardCheck,
  AlarmClock,
  FlaskConical,
  UserMinus,
  Trophy,
  Shirt,
  Medal,
  StickyNote,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Item = { label: string; icon: LucideIcon }

// Abas do levantamento de requisitos (exceto Login, que é uma tela à parte).
const itens: Item[] = [
  { label: "Painel Inicial", icon: LayoutDashboard },
  { label: "Alunos", icon: Users },
  { label: "Cadastro de Aluno", icon: UserPlus },
  { label: "Turmas", icon: UsersRound },
  { label: "Pagamentos", icon: Wallet },
  { label: "Chamada", icon: ClipboardCheck },
  { label: "Alertas de Faltas", icon: AlarmClock },
  { label: "Aulas Experimentais", icon: FlaskConical },
  { label: "Ex-Alunos", icon: UserMinus },
  { label: "Torneios", icon: Trophy },
  { label: "Uniformes", icon: Shirt },
  { label: "Rankings", icon: Medal },
  { label: "Álbum de Figurinhas", icon: StickyNote },
]

export function QuickMenu({
  onSelect,
  active,
}: {
  onSelect: (area: string) => void
  active?: string
}) {
  return (
    <nav
      aria-label="Navegação principal"
      className="panel-bevel flex flex-col overflow-hidden rounded-md bg-card"
    >
      <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-3">
        <Image
          src="/educa-soccer-crest.png"
          alt="Brasão do Educa Soccer"
          width={28}
          height={28}
          className="shrink-0 drop-shadow"
        />
        <div className="min-w-0">
          <p className="font-pixel text-[10px] uppercase leading-none tracking-wide text-primary-foreground pixel-shadow">
            Educa Soccer
          </p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-gold">Menu Principal</p>
        </div>
      </header>

      <ul className="flex flex-col gap-1 p-2">
        {itens.map(({ label, icon: Icon }) => {
          const isActive = active === label
          return (
            <li key={label}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(label)}
                className={[
                  "group flex w-full items-center gap-2.5 rounded-sm border-2 px-2.5 py-2 text-left transition-colors focus:outline-none",
                  isActive
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-transparent bg-panel-shade/40 text-foreground hover:border-gold hover:bg-gold hover:text-gold-foreground focus-visible:border-gold focus-visible:bg-gold focus-visible:text-gold-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                <span className="font-sans text-xs font-bold uppercase tracking-wide">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
