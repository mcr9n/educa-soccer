import { AlertTriangle, Trophy } from "lucide-react"
import { PositionTag } from "@/components/dashboard/position-tag"
import { cn } from "@/lib/utils"
import type { PosicaoRanking } from "@/lib/notas-data"

function variantePosicao(posicao: number): "gold" | "green" | "blue" | "default" {
  if (posicao === 1) return "gold"
  if (posicao === 2) return "green"
  if (posicao === 3) return "blue"
  return "default"
}

/**
 * Lista de classificacao do Aluno Destaque (req. 14.4): soma dos pontos
 * diarios (Presenca, Pontualidade, Comportamento, Participacao, Uniforme)
 * mais os pontos mensais (Testes, Eventos, Boletim, Amigo matriculado) do
 * ano. Em caso de empate, os alunos ficam na mesma posicao e recebem um
 * aviso visual - o requisito deixa o criterio de desempate a cargo do
 * responsavel pela escolinha, sem regra automatica.
 */
export function DestaqueRanking({ ranking }: { ranking: PosicaoRanking[] }) {
  if (ranking.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <Trophy className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={2.5} />
        <p className="mt-2 font-pixel text-[13px] uppercase text-muted-foreground">Nenhum aluno para exibir</p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Selecione uma turma com aulas avaliadas para gerar a classificação.
        </p>
      </div>
    )
  }

  const haEmpate = ranking.some((r) => r.empatado)

  return (
    <>
      {haEmpate && (
        <div className="flex items-start gap-2 border-b-2 border-panel-shade bg-gold/10 px-3 py-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
          <p className="font-sans text-xs text-muted-foreground">
            Há empate de pontuação entre alunos marcados abaixo. O critério de desempate fica a critério do
            responsável pela escolinha.
          </p>
        </div>
      )}

      <ul className="divide-y divide-panel-shade/60">
        {ranking.map((item) => (
          <li
            key={item.aluno.id}
            className={cn(
              "flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between",
              item.aulasAvaliadas === 0 && "opacity-50",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <PositionTag label={`${item.posicao}º`} variant={variantePosicao(item.posicao)} className="shrink-0" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-sans text-sm font-bold leading-tight text-foreground text-pretty">
                  {item.aluno.nome}
                  {item.empatado && (
                    <AlertTriangle className="h-3 w-3 shrink-0 text-gold" strokeWidth={2.5} aria-label="Empate" />
                  )}
                </p>
                <p className="mt-0.5 font-sans text-[13px] text-muted-foreground">
                  {item.aulasAvaliadas} aula(s) avaliada(s) · Diário {item.totalDiario} + Mensal {item.totalMensal}
                </p>
              </div>
            </div>

            <span className="shrink-0 self-start rounded-sm border border-panel-shade bg-panel-shade/30 px-2 py-1 text-right font-pixel text-sm leading-none text-outline text-gold sm:self-center">
              {item.totalGeral} pts
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
