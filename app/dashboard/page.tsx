"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppShell } from "@/components/dashboard/app-shell"
import { ScoreboardHeader } from "@/components/dashboard/scoreboard-header"

import {
  PagamentosPanel,
  FaltasPanel,
  ExperimentaisPanel,
  UniformesPanel,
  TorneiosPanel,
} from "@/components/dashboard/indicator-panels"

export default function Page() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ScoreboardHeader />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          <PagamentosPanel />
          <FaltasPanel />
          <ExperimentaisPanel />
          <UniformesPanel />

          <div className="sm:col-span-2">
            <TorneiosPanel />
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}