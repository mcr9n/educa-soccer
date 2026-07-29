"use client"

import { useState } from "react"
import { ScoreboardHeader } from "@/components/dashboard/scoreboard-header"
import { QuickMenu } from "@/components/dashboard/quick-menu"
import {
  PagamentosPanel,
  FaltasPanel,
  ExperimentaisPanel,
  UniformesPanel,
  TorneiosPanel,
} from "@/components/dashboard/indicator-panels"
import { StudentsScreen } from "@/components/students/students-screen"

export default function Page() {
  const [area, setArea] = useState<string | null>(null)
  const [aba, setAba] = useState<string>("Painel Inicial")

  return (
    <div className="min-h-dvh bg-stadium">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-3 pb-16 sm:p-4 lg:flex-row">
        {/* Barra lateral de navegação */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-4">
            <QuickMenu
              active={aba}
              onSelect={(a) => {
                setAba(a)
                setArea(a)
              }}
            />
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex min-w-0 flex-1 flex-col gap-3">
          <ScoreboardHeader />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <PagamentosPanel onSelect={setArea} />
            <FaltasPanel onSelect={setArea} />
            <ExperimentaisPanel onSelect={setArea} />
            <UniformesPanel onSelect={setArea} />
            <div className="sm:col-span-2">
              <TorneiosPanel onSelect={setArea} />
            </div>
          </div>
        </main>
      </div>

      {/* Barra de status estilo game */}
      <footer className="fixed inset-x-0 bottom-0 z-10 border-t-2 border-panel-edge bg-scoreboard/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">
            OK
          </span>
          <p className="font-sans text-sm font-semibold text-primary-foreground">
            {area ? (
              <>
                Abrindo área: <span className="text-gold">{area}</span>
              </>
            ) : (
              "Selecione uma aba ou indicador para o acesso rápido."
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}
