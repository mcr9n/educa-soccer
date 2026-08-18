import { PositionTag } from "@/components/dashboard/position-tag"
import type { TipoFigurinha, VarianteTipoFigurinha } from "@/lib/album-data"

/** Selo do tipo de figurinha (personagem) com a quantidade recebida daquele tipo. */
export function TipoFigurinhaBadge({
  tipo,
  quantidade,
  variant,
}: {
  tipo: TipoFigurinha
  quantidade: number
  variant: VarianteTipoFigurinha
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-panel-shade px-1.5 py-1 ${
        quantidade === 0 ? "opacity-40" : ""
      }`}
      title={tipo.comportamento}
    >
      <PositionTag label={tipo.personagem} variant={variant} />
      <span className="font-pixel text-[13px] leading-none text-foreground">×{quantidade}</span>
    </span>
  )
}
