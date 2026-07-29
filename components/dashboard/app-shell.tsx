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

      {/* Barra de status estilo game */}
      <footer className="fixed inset-x-0 bottom-0 z-10 border-t-2 border-panel-edge bg-scoreboard/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">
            OK
          </span>
          <p className="font-sans text-sm font-semibold text-primary-foreground">
            Seção atual: <span className="text-gold">{secao}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
