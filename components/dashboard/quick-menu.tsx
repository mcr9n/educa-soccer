"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UsersRound,
  FolderPlus,
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

type Item = { label: string; icon: LucideIcon; href?: string }

// Abas do levantamento de requisitos (exceto Login, que e uma tela a parte).
// Itens com `href` ja possuem tela; os demais aparecem como "em breve".
const itens: Item[] = [
  { label: "Painel Inicial", icon: LayoutDashboard, href: "/" },
  { label: "Alunos", icon: Users, href: "/alunos" },
  { label: "Cadastro de Aluno", icon: UserPlus, href: "/cadastro" },
  { label: "Turmas", icon: UsersRound, href: "/turmas" },
  { label: "Cadastro de Turma", icon: FolderPlus, href: "/cadastro-turma" },
  { label: "Pagamentos", icon: Wallet, href: "/pagamentos" },
  { label: "Chamada", icon: ClipboardCheck, href: "/chamada" },
  { label: "Alertas de Faltas", icon: AlarmClock, href: "/alertas-faltas" },
  { label: "Aulas Experimentais", icon: FlaskConical, href: "/aulas-experimentais" },
  { label: "Ex-Alunos", icon: UserMinus, href: "/ex-alunos" },
  { label: "Torneios", icon: Trophy, href: "/torneios" },
  { label: "Uniformes", icon: Shirt, href: "/uniformes" },
  { label: "Rankings", icon: Medal },
  { label: "Álbum de Figurinhas", icon: StickyNote },
]

export function QuickMenu() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal"
      className="panel-bevel flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-md bg-card"
    >
      <header className="flex shrink-0 items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-3">
        <Image
          src="/educa-soccer-crest.png"
          alt="Logotipo do EducaSoccer"
          width={32}
          height={32}
          className="shrink-0 drop-shadow"
        />
        <div className="min-w-0">
          <p className="font-pixel text-base font-extrabold uppercase leading-none tracking-tight">
            <span className="text-primary-foreground">EDUCA</span>
            <span className="text-danger">SOCCER</span>
          </p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-danger">Menu Principal</p>
        </div>
      </header>

      <ul className="flex flex-col gap-1 overflow-y-auto p-2">
        {itens.map(({ label, icon: Icon, href }) => {
          const isActive = href ? pathname === href : false
          const baseClasses =
            "group flex w-full items-center gap-2.5 rounded-sm border-2 px-2.5 py-2 text-left transition-colors focus:outline-none"

          if (!href) {
            return (
              <li key={label}>
                <span
                  aria-disabled="true"
                  className={`${baseClasses} cursor-not-allowed border-transparent bg-panel-shade/20 text-muted-foreground`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  <span className="min-w-0 flex-1 font-sans text-xs font-bold uppercase tracking-wide">{label}</span>
                  <span className="shrink-0 rounded-sm bg-panel-shade px-1 py-0.5 font-pixel text-[6px] uppercase leading-none text-muted-foreground">
                    Em breve
                  </span>
                </span>
              </li>
            )
          }

          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`${baseClasses} ${
                  isActive
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-transparent bg-panel-shade/40 text-foreground hover:border-gold hover:bg-gold hover:text-gold-foreground focus-visible:border-gold focus-visible:bg-gold focus-visible:text-gold-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                <span className="font-sans text-xs font-bold uppercase tracking-wide">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
