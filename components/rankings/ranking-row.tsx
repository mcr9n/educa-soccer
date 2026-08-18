import { PositionTag } from "@/components/dashboard/position-tag"
import { cn } from "@/lib/utils"
import type { ItemRanking, TipoRanking } from "@/lib/rankings-data"

const corPorTipo: Record<TipoRanking, string> = {
  artilharia: "text-danger",
  frequencia: "text-success",
  pontualidade: "text-scoreboard",
}

function variantePosicao(posicao: number): "gold" | "green" | "blue" | "default" {
  if (posicao === 1) return "gold"
  if (posicao === 2) return "green"
  if (posicao === 3) return "blue"
  return "default"
}

export function RankingRow({ item, tipo }: { item: ItemRanking; tipo: TipoRanking }) {
  return (
    <li
      className={cn(
        "flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between",
        !item.temDados && "opacity-50",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <PositionTag label={`${item.posicao}º`} variant={variantePosicao(item.posicao)} className="shrink-0" />
        <div className="min-w-0">
          <p className="font-sans text-sm font-bold leading-tight text-foreground text-pretty">{item.aluno.nome}</p>
          <p className="mt-0.5 truncate font-sans text-[15px] text-muted-foreground">{item.detalhe}</p>
        </div>
      </div>

      <span
        className={cn(
          "shrink-0 self-start rounded-sm border border-panel-shade bg-panel-shade/30 px-2 py-1 text-right font-pixel text-sm leading-none text-outline sm:self-center text-[20px]",
          corPorTipo[tipo],
        )}
      >
        {item.pontuacaoLabel}
      </span>
    </li>
  )
}
