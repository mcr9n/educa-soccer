"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, RotateCcw, UsersRound, Sparkles, X } from "lucide-react"
import {
  type Modalidade,
  type SituacaoTurma,
  type Turma,
  adicionarTurma,
  diasDaSemana,
  locaisDisponiveis,
  professoresDisponiveis,
  sugerirNomeTurma,
} from "@/lib/turmas-data"

type FormState = {
  nome: string
  local: string
  dias: string[]
  horario: string
  modalidade: Modalidade
  faixaEtaria: string
  professor: string
  situacao: SituacaoTurma
  limite: string
}

type Erros = Partial<Record<keyof FormState, string>>

const estadoInicial: FormState = {
  nome: "",
  local: "",
  dias: [],
  horario: "",
  modalidade: "coletiva",
  faixaEtaria: "",
  professor: professoresDisponiveis[0],
  situacao: "ativa",
  limite: "",
}

export function CadastroTurmaForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(estadoInicial)
  const [erros, setErros] = useState<Erros>({})
  const [salva, setSalva] = useState<Turma | null>(null)
  const [nomeEditado, setNomeEditado] = useState(false)

  // Nome sugerido automaticamente enquanto o usuário não digitar um nome próprio.
  const nomeSugerido = useMemo(
    () => sugerirNomeTurma(form.local, form.dias, form.horario),
    [form.local, form.dias, form.horario],
  )
  const nomeEfetivo = nomeEditado && form.nome ? form.nome : nomeSugerido

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function alternarDia(dia: string) {
    setForm((f) => ({
      ...f,
      dias: f.dias.includes(dia) ? f.dias.filter((d) => d !== dia) : [...f.dias, dia],
    }))
    setErros((e) => ({ ...e, dias: undefined }))
  }

  function validar(): boolean {
    const e: Erros = {}
    if (!nomeEfetivo.trim()) e.nome = "Informe o nome da turma."
    if (!form.local.trim()) e.local = "Selecione o local."
    if (form.modalidade === "coletiva" && form.dias.length === 0) e.dias = "Selecione ao menos um dia."
    if (!form.horario.trim()) e.horario = "Informe o horário."
    if (!form.faixaEtaria.trim()) e.faixaEtaria = "Informe a faixa etária."
    if (form.limite && (Number(form.limite) <= 0 || !Number.isInteger(Number(form.limite))))
      e.limite = "Limite inválido."
    setErros(e)
    return Object.keys(e).length === 0
  }

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!validar()) return
    const turma = adicionarTurma({
      nome: nomeEfetivo.trim(),
      local: form.local.trim(),
      dias: form.dias.length ? form.dias : ["A combinar"],
      horario: form.horario.trim(),
      modalidade: form.modalidade,
      faixaEtaria: form.faixaEtaria.trim(),
      professor: form.professor,
      situacao: form.situacao,
      limite: form.limite ? Number(form.limite) : undefined,
    })
    setSalva(turma)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function novaTurma() {
    setForm(estadoInicial)
    setErros({})
    setNomeEditado(false)
    setSalva(null)
  }

  if (salva) {
    return <TurmaSalva turma={salva} onNova={novaTurma} onIrParaTurmas={() => router.push("/turmas")} />
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-3" noValidate>
      <FormSection tag="NEW" titulo="Dados da Turma" icon>
        <div className="grid gap-3">
          {/* Nome + sugestão */}
          <Campo label="Nome da turma" obrigatorio erro={erros.nome}>
            <input
              value={nomeEfetivo}
              onChange={(e) => {
                setNomeEditado(true)
                set("nome", e.target.value)
              }}
              placeholder="Ex.: SUDOESTE (SEXTA - 17h00 às 18h00)"
              className={inputClasses}
            />
            {nomeSugerido && nomeEditado && (
              <button
                type="button"
                onClick={() => {
                  setNomeEditado(false)
                  set("nome", "")
                }}
                className="mt-1 inline-flex items-center gap-1 self-start rounded-sm border border-panel-edge bg-panel-shade/50 px-1.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wide text-gold transition-colors hover:border-gold focus:outline-none"
              >
                <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                Usar sugestão: {nomeSugerido}
              </button>
            )}
            {!nomeEditado && nomeSugerido && (
              <span className="mt-1 inline-flex items-center gap-1 font-sans text-[11px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-gold" strokeWidth={2.5} />
                Nome gerado automaticamente — edite se preferir.
              </span>
            )}
          </Campo>

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label="Local" obrigatorio erro={erros.local}>
              <select value={form.local} onChange={(e) => set("local", e.target.value)} className={inputClasses}>
                <option value="">Selecione o local...</option>
                {locaisDisponiveis.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Horário" obrigatorio erro={erros.horario}>
              <input
                value={form.horario}
                onChange={(e) => set("horario", e.target.value)}
                placeholder="Ex.: 17h00 às 18h00"
                className={inputClasses}
              />
            </Campo>
          </div>

          {/* Dias */}
          <Campo label="Dias das aulas" erro={erros.dias}>
            <div className="flex flex-wrap gap-1.5">
              {diasDaSemana.map((dia) => {
                const ativo = form.dias.includes(dia)
                return (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => alternarDia(dia)}
                    aria-pressed={ativo}
                    className={`rounded-sm border-2 px-2.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none ${
                      ativo
                        ? "border-gold bg-gold text-gold-foreground"
                        : "border-panel-edge bg-panel-shade/50 text-foreground hover:border-gold hover:text-gold"
                    }`}
                  >
                    {dia}
                  </button>
                )
              })}
            </div>
          </Campo>
        </div>
      </FormSection>

      <FormSection tag="CFG" titulo="Configurações">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo label="Modalidade de atendimento" obrigatorio>
            <div className="flex gap-2">
              {(["coletiva", "particular"] as Modalidade[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set("modalidade", m)}
                  aria-pressed={form.modalidade === m}
                  className={`flex-1 rounded-sm border-2 px-2 py-1.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none ${
                    form.modalidade === m
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-panel-edge bg-panel-shade/50 text-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {m === "coletiva" ? "Coletiva" : "Particular"}
                </button>
              ))}
            </div>
          </Campo>

          <Campo label="Situação" obrigatorio>
            <div className="flex gap-2">
              {(["ativa", "inativa"] as SituacaoTurma[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("situacao", s)}
                  aria-pressed={form.situacao === s}
                  className={`flex-1 rounded-sm border-2 px-2 py-1.5 font-sans text-xs font-bold uppercase tracking-wide transition-colors focus:outline-none ${
                    form.situacao === s
                      ? "border-gold bg-gold text-gold-foreground"
                      : "border-panel-edge bg-panel-shade/50 text-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {s === "ativa" ? "Ativa" : "Inativa"}
                </button>
              ))}
            </div>
          </Campo>

          <Campo label="Faixa etária" obrigatorio erro={erros.faixaEtaria}>
            <input
              value={form.faixaEtaria}
              onChange={(e) => set("faixaEtaria", e.target.value)}
              placeholder="Ex.: 8 a 10 anos"
              className={inputClasses}
            />
          </Campo>

          <Campo label="Professor responsável" obrigatorio>
            <select value={form.professor} onChange={(e) => set("professor", e.target.value)} className={inputClasses}>
              {professoresDisponiveis.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Limite de alunos (opcional)" erro={erros.limite}>
            <input
              inputMode="numeric"
              value={form.limite}
              onChange={(e) => set("limite", e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Ex.: 16"
              className={inputClasses}
            />
          </Campo>
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <button
          type="button"
          onClick={novaTurma}
          className="flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
          Limpar formulário
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-5 py-2 font-pixel text-[10px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
          Salvar turma
        </button>
      </div>
    </form>
  )
}

const inputClasses =
  "w-full rounded-sm border border-panel-edge bg-panel-shade/60 px-2.5 py-1.5 font-sans text-sm font-medium text-foreground inset-bevel placeholder:text-muted-foreground focus:border-gold focus:outline-none"

function Campo({
  label,
  obrigatorio,
  erro,
  className,
  children,
}: {
  label: string
  obrigatorio?: boolean
  erro?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">
        {label}
        {obrigatorio && <span className="ml-1 text-danger">*</span>}
      </span>
      {children}
      {erro && (
        <span className="flex items-center gap-1 font-sans text-[11px] font-semibold text-danger">
          <X className="h-3 w-3" strokeWidth={3} />
          {erro}
        </span>
      )}
    </label>
  )
}

function FormSection({
  tag,
  titulo,
  icon,
  children,
}: {
  tag: string
  titulo: string
  icon?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
        <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">
          {tag}
        </span>
        <h2 className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">
          {icon && <UsersRound className="h-4 w-4" strokeWidth={2.5} />}
          {titulo}
        </h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

function TurmaSalva({
  turma,
  onNova,
  onIrParaTurmas,
}: {
  turma: Turma
  onNova: () => void
  onIrParaTurmas: () => void
}) {
  const linhas: { rotulo: string; valor: string }[] = [
    { rotulo: "Turma", valor: turma.nome },
    { rotulo: "Local", valor: turma.local },
    { rotulo: "Dias", valor: turma.dias.join(", ") },
    { rotulo: "Horário", valor: turma.horario },
    { rotulo: "Modalidade", valor: turma.modalidade === "particular" ? "Particular" : "Coletiva" },
    { rotulo: "Faixa etária", valor: turma.faixaEtaria },
    { rotulo: "Professor", valor: turma.professor },
    { rotulo: "Situação", valor: turma.situacao === "ativa" ? "Ativa" : "Inativa" },
    { rotulo: "Limite", valor: turma.limite ? `${turma.limite} alunos` : "Sem limite" },
  ]

  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-primary px-3 py-2">
        <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">
          GOAL!
        </span>
        <h2 className="font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">
          Turma cadastrada
        </h2>
      </header>

      <div className="flex flex-col items-center gap-3 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-gold/20">
          <Check className="h-8 w-8 text-gold" strokeWidth={3} />
        </div>
        <p className="text-center font-sans text-sm text-muted-foreground text-pretty">
          A turma foi criada e seu nome já pode ser usado no cadastro de alunos.
        </p>

        <dl className="w-full max-w-md divide-y divide-panel-shade rounded-sm border border-panel-edge bg-panel-shade/30">
          {linhas.map((l) => (
            <div key={l.rotulo} className="flex items-start justify-between gap-3 px-3 py-2">
              <dt className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{l.rotulo}</dt>
              <dd className="text-right font-sans text-sm font-bold text-foreground text-pretty">{l.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onIrParaTurmas}
            className="flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            Ver lista de turmas
          </button>
          <button
            type="button"
            onClick={onNova}
            className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-4 py-2 font-pixel text-[10px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <UsersRound className="h-4 w-4" strokeWidth={3} />
            Nova turma
          </button>
        </div>
      </div>
    </section>
  )
}
