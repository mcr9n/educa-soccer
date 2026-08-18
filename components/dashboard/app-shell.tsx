"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { QuickMenu } from "./quick-menu"

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
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-3 pb-16 sm:p-4 lg:flex-row">
        {/* Barra lateral de navegação */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-4">
            <QuickMenu />
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex min-w-0 flex-1 flex-col gap-3">{children}</main>
      </div>
    </div>
  )
}
