"use client"

import { X } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Fundo escuro + painel centralizado, no estilo dos demais modais do sistema.
 * Compartilhado por todos os formulários em modal do app (era duplicado em
 * cada arquivo). Responsivo: no mobile ocupa a largura da viewport com
 * margens pequenas e permite rolagem interna quando o conteúdo é maior que a
 * tela; no desktop mantém o comportamento centralizado original.
 */
export function ModalShell({
  titulo,
  tag,
  onClose,
  children,
  maxWidthClassName = "max-w-md",
}: {
  titulo: string
  tag: string
  onClose: () => void
  children: ReactNode
  /** Largura máxima do painel em telas maiores (ex.: "max-w-sm", "max-w-lg"). */
  maxWidthClassName?: string
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={onClose}
    >
      <div
        className={cn(
          "panel-bevel flex max-h-dvh w-full flex-col overflow-hidden bg-card sm:max-h-[calc(100dvh-2rem)] sm:rounded-md",
          maxWidthClassName,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
              {tag}
            </span>
            <h2 className="truncate font-pixel text-[13px] uppercase tracking-wide text-white pixel-shadow">
              {titulo}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-panel-edge bg-panel-shade/50 text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        </header>
        <div className="overflow-y-auto p-3">{children}</div>
      </div>
    </div>
  )
}
