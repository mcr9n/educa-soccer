"use client"

import { useMemo, useState } from "react"
import { Search, Users } from "lucide-react"
import {
  type Aluno,
  alunos as alunosIniciais,
  faixasEtarias,
  turmasDisponiveis,
  totalExAlunos,
} from "@/lib/alunos-data"
import {
  calcularResumoAlunos,
  editarAluno as editarAlunoService,
  filtrarAlunos,
  marcarAlunoComoExAluno,
  obterAlunosAtivos,
  type ModalidadeFiltro,
  transferirAluno as transferirAlunoService,
} from "@/lib/services/alunos.service"
import { AlunosCounters } from "../alunos-counters/alunos-counters"
import { AlunoCard } from "../aluno-card/aluno-card"
import styles from "./alunos-view.module.css"

export function AlunosView() {
  const [lista, setLista] = useState<Aluno[]>(alunosIniciais)
  const [exAlunos, setExAlunos] = useState(totalExAlunos)
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState<string>("todas")
  const [faixaFiltro, setFaixaFiltro] = useState<string>("todas")
  const [modalidadeFiltro, setModalidadeFiltro] = useState<ModalidadeFiltro>("todas")
  const [expandidoId, setExpandidoId] = useState<string | null>(null)

  const ativos = useMemo(() => obterAlunosAtivos(lista), [lista])

  const filtrados = useMemo(() => {
    return filtrarAlunos(ativos, {
      busca,
      turma: turmaFiltro,
      faixaEtaria: faixaFiltro,
      modalidade: modalidadeFiltro,
    })
  }, [ativos, busca, turmaFiltro, faixaFiltro, modalidadeFiltro])

  const contadores = useMemo(() => calcularResumoAlunos(ativos), [ativos])

  function editarAluno(id: string, dados: Partial<Aluno>) {
    setLista((prev) => editarAlunoService(prev, id, dados))
  }

  function transferirAluno(id: string, turma: string) {
    setLista((prev) => transferirAlunoService(prev, id, turma))
  }

  function marcarExAluno(id: string) {
    setLista((prev) => marcarAlunoComoExAluno(prev, id))
    setExAlunos((n) => n + 1)
    setExpandidoId((atual) => (atual === id ? null : atual))
  }

  function limparFiltros() {
    setBusca("")
    setTurmaFiltro("todas")
    setFaixaFiltro("todas")
    setModalidadeFiltro("todas")
  }

  const temFiltro =
    busca !== "" || turmaFiltro !== "todas" || faixaFiltro !== "todas" || modalidadeFiltro !== "todas"

  return (
    <div className={styles.root}>
      <AlunosCounters
        ativos={contadores.ativos}
        particulares={contadores.particulares}
        coletivos={contadores.coletivos}
        exAlunos={exAlunos}
        porTurma={contadores.porTurma}
      />

      <section className={styles.panel}>
        <header className={styles.panelHeader}>
          <span className={styles.badge}>FILTRO</span>
          <h2 className={styles.title}>Buscar & Filtrar</h2>
        </header>

        <div className={styles.filtersGrid}>
          <label className={`${styles.fieldLabel} ${styles.fieldLabelWide}`}>
            <span className={styles.fieldCaption}>Nome do aluno</span>
            <span className={styles.searchField}>
              <Search className={styles.fieldIcon} size={14} strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar..."
                className={styles.searchInput}
              />
            </span>
          </label>

          <FiltroSelect
            className={styles.selectField}
            label="Turma"
            value={turmaFiltro}
            onChange={setTurmaFiltro}
            options={[{ value: "todas", label: "Todas as turmas" }, ...turmasDisponiveis.map((t) => ({ value: t, label: t }))]}
          />

          <FiltroSelect
            className={styles.selectField}
            label="Faixa etária"
            value={faixaFiltro}
            onChange={setFaixaFiltro}
            options={[
              { value: "todas", label: "Todas as idades" },
              ...faixasEtarias.map((f) => ({ value: f, label: `${f}` })),
            ]}
          />

          <FiltroSelect
            className={styles.selectField}
            label="Atendimento"
            value={modalidadeFiltro}
            onChange={(v) => setModalidadeFiltro(v as ModalidadeFiltro)}
            options={[
              { value: "todas", label: "Todos" },
              { value: "coletiva", label: "Coletivo" },
              { value: "particular", label: "Particular" },
            ]}
          />
        </div>

        <div className={styles.filtersFooter}>
          <p className={styles.countText}>
            <Users className={styles.iconGold} size={14} strokeWidth={2.5} />
            {filtrados.length} de {contadores.ativos} aluno(s)
          </p>
          {temFiltro && (
            <button type="button" onClick={limparFiltros} className={styles.clearButton}>
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {filtrados.length > 0 ? (
        <ul className={styles.cardList}>
          {filtrados.map((aluno) => (
            <AlunoCard
              key={aluno.id}
              aluno={aluno}
              expandido={expandidoId === aluno.id}
              onToggle={() => setExpandidoId((atual) => (atual === aluno.id ? null : aluno.id))}
              onEditar={editarAluno}
              onTransferir={transferirAluno}
              onMarcarExAluno={marcarExAluno}
            />
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>Nenhum aluno encontrado</p>
          <p className={styles.emptyDescription}>Ajuste a busca ou os filtros para ver mais resultados.</p>
        </div>
      )}
    </div>
  )
}

function FiltroSelect({
  className,
  label,
  value,
  onChange,
  options,
}: {
  className: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className={styles.fieldLabel}>
      <span className={styles.fieldCaption}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${styles.selectInput} ${className}`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}