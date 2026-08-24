"use client"

import { useMemo, useState } from "react"
import { CalendarCheck2, FlaskConical, Search, Trophy, UserPlus2, Users } from "lucide-react"
import { type AulaExperimental, aulasExperimentais as aulasIniciais, situacoesContato, turmasDisponiveis } from "@/lib/aulas-experimentais-data"
import {
  adicionarAulaExperimental,
  atualizarSituacao,
  calcularResumoAulasExperimentais,
  editarAulaExperimental,
  filtrarAulasExperimentais,
} from "@/lib/services/aulas-experimentais.service"
import { AulaExperimentalCard } from "./aula-experimental-card"
import { NovoContatoForm } from "./novo-contato-form"
import { ConverterEmAlunoModal } from "./converter-em-aluno-modal"

export function AulasExperimentaisView() {
  const [lista, setLista] = useState<AulaExperimental[]>(aulasIniciais)
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState("todas")
  const [situacaoFiltro, setSituacaoFiltro] = useState("todas")
  const [expandidoId, setExpandidoId] = useState<string | null>(null)
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const [conversaoId, setConversaoId] = useState<string | null>(null)

  const filtrados = useMemo(
    () => filtrarAulasExperimentais(lista, { busca, turma: turmaFiltro, situacao: situacaoFiltro }),
    [lista, busca, turmaFiltro, situacaoFiltro],
  )

  const resumo = useMemo(() => calcularResumoAulasExperimentais(lista), [lista])

  function registrarContato(novo: Omit<AulaExperimental, "id">) {
    const { lista: novaLista, criado } = adicionarAulaExperimental(lista, novo)
    setLista(novaLista)
    setFormularioAberto(false)
    setAviso(`Contato de ${criado.nomeCrianca || criado.nomeResponsavel} registrado com sucesso.`)
  }

  function editar(id: string, dados: Partial<AulaExperimental>) {
    setLista((prev) => editarAulaExperimental(prev, id, dados))
  }

  function mudarSituacao(id: string, situacao: AulaExperimental["situacao"]) {
    setLista((prev) => atualizarSituacao(prev, id, situacao))
    if (situacao === "Matrícula confirmada") {
      setConversaoId(id)
    }
  }

  function limparFiltros() {
    setBusca("")
    setTurmaFiltro("todas")
    setSituacaoFiltro("todas")
  }

  function concluirConversao(id: string) {
    setLista((prev) => prev.filter((item) => item.id !== id))
    setConversaoId(null)
    setAviso("Cadastro convertido em aluno. Os dados já preenchidos foram reaproveitados na ficha.")
  }

  const temFiltro = busca !== "" || turmaFiltro !== "todas" || situacaoFiltro !== "todas"
  const emConversao = lista.find((item) => item.id === conversaoId) ?? null

  return (
    <>
      {/* Contadores */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Contador icon={FlaskConical} valor={resumo.total} label="Em acompanhamento" tone="gold" />
        <Contador icon={CalendarCheck2} valor={resumo.agendadas} label="Aulas agendadas" tone="blue" />
        <Contador icon={Users} valor={resumo.aguardando} label="Aguardando contato" tone="danger" />
        <Contador icon={Trophy} valor={resumo.matriculasConfirmadas} label="Matrículas confirmadas" tone="primary" />
      </section>

      {/* Aviso */}
      {aviso && (
        <div className="panel-bevel flex items-center justify-between gap-3 rounded-md border-2 border-primary bg-primary/15 px-3 py-2">
          <p className="flex items-center gap-2 font-sans text-sm font-semibold text-primary">
            <UserPlus2 className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {aviso}
          </p>
          <button
            type="button"
            onClick={() => setAviso(null)}
            className="font-pixel text-[9px] uppercase text-primary hover:underline"
          >
            OK
          </button>
        </div>
      )}

      {/* Ação principal: novo contato */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <button
          type="button"
          onClick={() => setFormularioAberto((v) => !v)}
          className="flex w-full items-center justify-between gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2 text-left transition-colors hover:bg-scoreboard/80"
        >
          <span className="flex items-center gap-2">
            <span className="rounded-sm bg-gold px-3 py-0.5 font-pixel text-sm font-bold leading-none text-gold-foreground">
              NOVO
            </span>
            <h2 className="font-pixel text-lg font-bold uppercase tracking-wide text-white pixel-shadow">
              Registrar novo contato
            </h2>
          </span>
          <UserPlus2 className="h-4 w-4 shrink-0 text-white" strokeWidth={2.5} />
        </button>

        {formularioAberto && (
          <div className="p-3">
            <NovoContatoForm onSalvar={registrarContato} onCancelar={() => setFormularioAberto(false)} />
          </div>
        )}
      </section>

      {/* Busca e filtros */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-3 py-0.5 font-pixel text-sm font-bold leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-lg font-bold uppercase tracking-wide text-white pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">
              Criança ou responsável
            </span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar contatos..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </span>
          </label>

          <FiltroSelect
            label="Turma de interesse"
            value={turmaFiltro}
            onChange={setTurmaFiltro}
            options={[{ value: "todas", label: "Todas as turmas" }, ...turmasDisponiveis.map((t) => ({ value: t, label: t }))]}
          />

          <FiltroSelect
            label="Situação do atendimento"
            value={situacaoFiltro}
            onChange={setSituacaoFiltro}
            options={[{ value: "todas", label: "Todas as situações" }, ...situacoesContato.map((s) => ({ value: s, label: s }))]}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {filtrados.length} de {lista.length} contato(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-gold-foreground focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista de contatos */}
      {filtrados.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {filtrados.map((item) => (
            <AulaExperimentalCard
              key={item.id}
              item={item}
              expandido={expandidoId === item.id}
              onToggle={() => setExpandidoId((atual) => (atual === item.id ? null : item.id))}
              onEditar={editar}
              onMudarSituacao={mudarSituacao}
            />
          ))}
        </ul>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-lg font-bold uppercase text-muted-foreground">Nenhum contato encontrado</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            {lista.length === 0
              ? "Ainda não há aulas experimentais registradas."
              : "Ajuste a busca ou os filtros para ver mais resultados."}
          </p>
        </div>
      )}

      {/* Conversao em aluno */}
      {emConversao && (
        <ConverterEmAlunoModal
          item={emConversao}
          onConfirmar={() => concluirConversao(emConversao.id)}
          onCancelar={() => setConversaoId(null)}
        />
      )}
    </>
  )
}

function Contador({
  icon: Icon,
  valor,
  label,
  tone,
}: {
  icon: typeof Users
  valor: number
  label: string
  tone: "danger" | "blue" | "primary" | "gold"
}) {
  const tones = {
    danger: "text-danger",
    blue: "text-scoreboard",
    primary: "text-primary",
    gold: "text-gold",
  }
  return (
    <div className="panel-bevel flex items-center gap-3 rounded-md bg-card px-3 py-2.5">
      <Icon className={`h-6 w-6 shrink-0 ${tones[tone]}`} strokeWidth={2.5} />
      <div className="min-w-0">
        <p className="font-pixel text-xl font-bold leading-none text-foreground">{valor}</p>
        <p className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}

function FiltroSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
