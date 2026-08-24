"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { TipoFigurinha } from "@/lib/album-data"
import { ModalShell } from "@/components/shared/modal-shell"

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  "w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm text-foreground inset-bevel focus:border-gold focus:outline-none"

/**
 * Cadastro dos tipos de figurinha (req. 13.2): personagem + comportamento
 * associado. A associação deve ser confirmada pela coordenação, por isso o
 * cadastro fica sempre editável (e não fixo nos 4 tipos iniciais).
 */
export function TipoFigurinhaForm({
  tipoEditando,
  tiposExistentes,
  onClose,
  onSalvar,
}: {
  tipoEditando?: TipoFigurinha
  tiposExistentes: TipoFigurinha[]
  onClose: () => void
  onSalvar: (dados: Omit<TipoFigurinha, "id">) => void
}) {
  const [personagem, setPersonagem] = useState(tipoEditando?.personagem ?? "")
  const [comportamento, setComportamento] = useState(tipoEditando?.comportamento ?? "")
  const [ativo, setAtivo] = useState(tipoEditando?.ativo ?? true)
  const [erro, setErro] = useState<string | null>(null)

  function confirmar() {
    const nome = personagem.trim()
    if (!nome) {
      setErro("Informe o nome do personagem.")
      return
    }
    if (!comportamento.trim()) {
      setErro("Informe o comportamento associado.")
      return
    }
    const duplicado = tiposExistentes.some(
      (t) => t.id !== tipoEditando?.id && t.personagem.toLowerCase() === nome.toLowerCase(),
    )
    if (duplicado) {
      setErro("Já existe um tipo de figurinha com esse personagem.")
      return
    }
    setErro(null)
    onSalvar({ personagem: nome, comportamento: comportamento.trim(), ativo })
    onClose()
  }

  return (
    <ModalShell
      titulo={tipoEditando ? "Editar tipo de figurinha" : "Novo tipo de figurinha"}
      tag="TIPO"
      onClose={onClose}
      maxWidthClassName="sm:max-w-sm"
    >
      <div className="flex flex-col gap-3">
        <Campo label="Personagem">
          <input
            value={personagem}
            onChange={(e) => setPersonagem(e.target.value)}
            placeholder="Ex.: Messi"
            className={inputCls}
          />
        </Campo>

        <Campo label="Comportamento associado">
          <input
            value={comportamento}
            onChange={(e) => setComportamento(e.target.value)}
            placeholder="Ex.: Organização"
            className={inputCls}
          />
        </Campo>

        {tipoEditando && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span className="font-sans text-xs font-semibold text-foreground">Tipo ativo (disponível para entrega)</span>
          </label>
        )}

        {erro && (
          <p className="rounded-sm border border-danger bg-danger/10 px-2 py-1.5 font-sans text-xs font-semibold text-danger">
            {erro}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirmar}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {tipoEditando ? "Salvar alterações" : "Cadastrar tipo"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
