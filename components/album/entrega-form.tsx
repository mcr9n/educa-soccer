"use client"

import { useMemo, useState } from "react"
import { Check } from "lucide-react"
import { alunos } from "@/lib/alunos-data"
import { anosDoAlbum, anoAtual, professorPadraoDoAluno, type FigurinhaConcedida, type TipoFigurinha } from "@/lib/album-data"
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
 * Formulário de entrega de figurinha (req. 13.3): o professor seleciona o
 * aluno, o ano do álbum, a figurinha e o motivo da entrega. A data é
 * registrada automaticamente pelo sistema no momento em que o formulário é
 * confirmado.
 */
export function EntregaFigurinhaForm({
  alunoFixo,
  tipos,
  concedidas,
  onClose,
  onSalvar,
}: {
  /** Quando aberto a partir da linha de um aluno, o aluno já vem fixado. */
  alunoFixo?: string
  tipos: TipoFigurinha[]
  concedidas: FigurinhaConcedida[]
  onClose: () => void
  onSalvar: (dados: Omit<FigurinhaConcedida, "id" | "data">) => void
}) {
  const alunosAtivos = useMemo(() => [...alunos].filter((a) => a.ativo).sort((a, b) => a.nome.localeCompare(b.nome)), [])
  const tiposAtivos = tipos.filter((t) => t.ativo)
  const anosDisponiveis = useMemo(() => anosDoAlbum(concedidas), [concedidas])

  const [alunoId, setAlunoId] = useState(alunoFixo ?? alunosAtivos[0]?.id ?? "")
  const [ano, setAno] = useState(anoAtual)
  const [tipoId, setTipoId] = useState(tiposAtivos[0]?.id ?? "")
  const [motivo, setMotivo] = useState(tiposAtivos[0]?.comportamento ?? "")
  const [professor, setProfessor] = useState(
    alunoFixo ? professorPadraoDoAluno(alunos.find((a) => a.id === alunoFixo)!) : professorPadraoDoAluno(alunosAtivos[0]),
  )
  const [erro, setErro] = useState<string | null>(null)

  const alunoSelecionado = alunos.find((a) => a.id === alunoId)
  const tipoSelecionado = tiposAtivos.find((t) => t.id === tipoId)

  function selecionarAluno(id: string) {
    setAlunoId(id)
    const aluno = alunos.find((a) => a.id === id)
    if (aluno) setProfessor(professorPadraoDoAluno(aluno))
  }

  function selecionarTipo(id: string) {
    setTipoId(id)
    const tipo = tiposAtivos.find((t) => t.id === id)
    // Sugere o motivo a partir do comportamento do tipo, mas mantém editável.
    if (tipo) setMotivo(tipo.comportamento)
  }

  function confirmar() {
    if (!alunoId) {
      setErro("Selecione o aluno.")
      return
    }
    if (!tipoId) {
      setErro("Selecione a figurinha.")
      return
    }
    if (!motivo.trim()) {
      setErro("Informe o motivo da entrega.")
      return
    }
    if (!professor.trim()) {
      setErro("Informe o professor responsável.")
      return
    }
    setErro(null)
    onSalvar({ alunoId, ano, tipoId, motivo: motivo.trim(), professor: professor.trim() })
    onClose()
  }

  if (tiposAtivos.length === 0) {
    return (
      <ModalShell titulo="Conceder figurinha" tag="ALB" onClose={onClose}>
        <p className="font-sans text-sm text-muted-foreground">
          Nenhum tipo de figurinha está ativo. Cadastre um tipo antes de conceder uma entrega.
        </p>
      </ModalShell>
    )
  }

  return (
    <ModalShell titulo="Conceder figurinha" tag="ALB" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Campo label="Aluno">
          <select
            value={alunoId}
            onChange={(e) => selecionarAluno(e.target.value)}
            disabled={Boolean(alunoFixo)}
            className={`${inputCls} font-semibold disabled:opacity-70`}
          >
            {alunosAtivos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </Campo>

        {alunoSelecionado && (
          <div className="rounded-sm border border-panel-shade bg-panel-shade/30 p-2">
            <p className="font-sans text-xs text-muted-foreground">
              Turma: <span className="font-semibold text-foreground">{alunoSelecionado.turma}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Campo label="Ano do álbum">
            <select value={ano} onChange={(e) => setAno(Number(e.target.value))} className={`${inputCls} font-semibold`}>
              {anosDisponiveis.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Figurinha">
            <select value={tipoId} onChange={(e) => selecionarTipo(e.target.value)} className={`${inputCls} font-semibold`}>
              {tiposAtivos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.personagem}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        {tipoSelecionado && (
          <p className="rounded-sm border border-panel-shade bg-panel-shade/20 px-2 py-1.5 font-sans text-[11px] text-muted-foreground">
            Comportamento associado: <span className="font-semibold text-foreground">{tipoSelecionado.comportamento}</span>
          </p>
        )}

        <Campo label="Motivo da entrega">
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex.: Posse de bola, condução de bola..."
            className={inputCls}
          />
        </Campo>

        <Campo label="Professor responsável">
          <input value={professor} onChange={(e) => setProfessor(e.target.value)} className={inputCls} />
        </Campo>

        <p className="font-sans text-[11px] text-muted-foreground">
          A data de recebimento será registrada automaticamente pelo sistema ao confirmar.
        </p>

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
            Conceder figurinha
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
