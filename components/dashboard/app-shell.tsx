"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { QuickMenu } from "./quick-menu"
import { MobileNav } from "./mobile-nav"

const secaoPorRota: Record<string, string> = {
  "/": "Painel Inicial",
  "/alunos": "Consulta de Alunos",
  "/cadastro": "Cadastro de Aluno",
  "/turmas": "Gestão de Turmas",
  "/cadastro-turma": "Cadastro de Turma",
  "/pagamentos": "Gestão de Pagamentos",
  "/chamada": "Controle de Chamada",
  "/notas": "Notas / Aluno Destaque",
  "/alertas-faltas": "Alertas de Faltas",
  "/ex-alunos": "Gestão de Ex-Alunos",
  "/aulas-experimentais": "Gestão de Aulas Experimentais",
  "/torneios": "Gestão de Torneios",
  "/uniformes": "Gestão de Uniformes",
  "/rankings": "Rankings",
  "/album": "Álbum de Figurinhas",
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const secao = secaoPorRota[pathname] ?? "Educa Soccer"

  return (
    <div className="min-h-dvh bg-stadium">
      {/* Cabeçalho compacto + gaveta de navegação, apenas no mobile (< lg) */}
      <div className="mx-auto w-full max-w-[1600px] px-3 pt-3 sm:px-4 sm:pt-4">
        <MobileNav secao={secao} />
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-3 pb-16 sm:p-4 lg:flex-row">
        {/* Barra lateral de navegação: somente em telas lg+ */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-4">
            <QuickMenu />
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex min-w-0 flex-1 flex-col gap-3 pt-3 lg:pt-0">{children}</main>
      </div>
    </div>
  )
}
