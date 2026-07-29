"use client"

import { Users, Wallet, ClipboardCheck, Trophy, Shirt, UserPlus } from "lucide-react"

const itens = [
  { label: "Alunos", icon: Users },
  { label: "Pagamentos", icon: Wallet },
  { label: "Chamada", icon: ClipboardCheck },
  { label: "Experimentais", icon: UserPlus },
  { label: "Uniformes", icon: Shirt },
  { label: "Torneios", icon: Trophy },
]

export function QuickMenu({ onSelect }: { onSelect: (area: string) => void }) {
  return (
    <nav
      aria-label="Acesso rápido"
      className="panel-bevel rounded-md bg-card overflow-hidden"
    >
      <header className="bg-scoreboard px-3 py-2 border-b-2 border-panel-shade text-center">
        <h2 className="font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">
          Menu Rápido
        </h2>
      </header>
      <ul className="p-2 flex flex-col gap-1">
        {itens.map(({ label, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onSelect(label)}
              className="group flex w-full items-center gap-2 rounded-sm border-2 border-transparent bg-panel-shade/40 px-2.5 py-2 text-left transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus-visible:border-gold focus-visible:bg-gold focus-visible:text-gold-foreground focus:outline-none"
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              <span className="font-pixel text-[10px] uppercase tracking-wide">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
