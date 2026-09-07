"use client"

import { useEffect, useMemo, useState } from "react"
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
import { atualizarAluno, listarAlunos } from "@/lib/services/alunos-api"
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
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listarAlunos()
      .then((alunos) => setLista(alunos))
      .catch(() => setErro("Não foi possível carregar os alunos. Verifique se o backend está em execução."))
      .finally(() => setCarregando(false))
  }, [])

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

  async function editarAluno(id: string, dados: Partial<Aluno>) {
    const atual = lista.find((aluno) => aluno.id === id)
    if (!atual) return
    const atualizado = await atualizarAluno(id, { ...atual, ...dados })
    setLista((prev) => editarAlunoService(prev, id, atualizado))
  }

  async function transferirAluno(id: string, turma: string) {
    const atual = lista.find((aluno) => aluno.id === id)
    if (!atual) return
    const dados = transferirAlunoService([atual], id, turma)[0]
    const atualizado = await atualizarAluno(id, dados)
    setLista((prev) => editarAlunoService(prev, id, atualizado))
  }

  async function marcarExAluno(id: string, motivo: string, observacoes: string) {
    const atual = lista.find((aluno) => aluno.id === id)
    if (!atual) return
    const dados = marcarAlunoComoExAluno([atual], id)[0]
    const atualizado = await atualizarAluno(id, {
      ...dados,
      observacoesDesativacao: [motivo, observacoes].filter(Boolean).join(" - "),
    })
    setLista((prev) => editarAlunoService(prev, id, atualizado))
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
      {erro && <p className="rounded-sm border border-danger bg-danger/10 p-3 text-sm text-danger">{erro}</p>}
      {carregando && <p className="p-4 text-sm text-muted-foreground">Carregando alunos...</p>}
      <AlunosCounters
        ativos={contadores.ativos}
        particulares={contadores.particulares}
        coletivos={contadores.coletivos}
        exAlunos={contadores.exAlunos}
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
              onEditar={(id, dados) => void editarAluno(id, dados)}
              onTransferir={(id, turma) => void transferirAluno(id, turma)}
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