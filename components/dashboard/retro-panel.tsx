import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type RetroPanelProps = {
  title: string
  tag?: string
  right?: ReactNode
  children: ReactNode
  className?: string
  /** Altura máxima da área de conteúdo (com rolagem) */
  maxBodyHeight?: number
}

export function RetroPanel({ title, tag, right, children, className, maxBodyHeight }: RetroPanelProps) {
  return (
    <section className={cn("panel-bevel rounded-md bg-card overflow-hidden flex flex-col", className)}>
      <header className="flex items-center justify-between gap-2 bg-scoreboard px-3 py-2 border-b-2 border-panel-shade">
        <div className="flex items-center gap-2 min-w-0">
          {tag && (
            <span className="shrink-0 rounded-sm bg-gold px-2 py-0.5 font-pixel text-sm font-bold leading-none text-gold-foreground">
              {tag}
            </span>
          )}
          <h2 className="font-pixel text-lg font-bold uppercase tracking-wide text-primary-foreground pixel-shadow truncate">
            {title}
          </h2>
        </div>
        {right}
      </header>
      <div
        className={cn("flex-1 p-2.5", maxBodyHeight && "overflow-y-auto")}
        style={maxBodyHeight ? { maxHeight: maxBodyHeight } : undefined}
      >
        {children}
      </div>
    </section>
  )
}
