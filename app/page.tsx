"use client"

import { useState } from "react"
import { ScoreboardHeader } from "@/components/dashboard/scoreboard-header"
import { PitchTurmas } from "@/components/dashboard/pitch-turmas"
import { QuickMenu } from "@/components/dashboard/quick-menu"
import {
  PagamentosPanel,
  FaltasPanel,
  ExperimentaisPanel,
  UniformesPanel,
  TorneiosPanel,
} from "@/components/dashboard/indicator-panels"

export default function Page() {
  const [area, setArea] = useState<string | null>(null)

  return (
    <div className="min-h-dvh bg-stadium">
      <main className="mx-auto w-full max-w-6xl p-3 sm:p-4 pb-16 flex flex-col gap-3">
        <ScoreboardHeader />

        <div className="grid gap-3 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-5">
            <PitchTurmas onSelect={setArea} />
            <QuickMenu onSelect={setArea} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            <PagamentosPanel onSelect={setArea} />
            <FaltasPanel onSelect={setArea} />
            <ExperimentaisPanel onSelect={setArea} />
            <UniformesPanel onSelect={setArea} />
            <div className="sm:col-span-2">
              <TorneiosPanel onSelect={setArea} />
            </div>
          </div>
        </div>
      </main>

      {/* Barra de status estilo game */}
      <footer className="fixed inset-x-0 bottom-0 z-10 border-t-2 border-panel-edge bg-scoreboard/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">
            OK
          </span>
          <p className="font-sans text-sm font-semibold text-primary-foreground">
            {area ? (
              <>
                Abrindo área: <span className="text-gold">{area}</span>
              </>
            ) : (
              "Selecione um indicador para o acesso rápido."
            )}
          </p>
        </div>
      </footer>
    </div>
  )
}
