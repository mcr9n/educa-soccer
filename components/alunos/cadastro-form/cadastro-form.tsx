"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Camera,
  Check,
  ChevronLeft,
  RotateCcw,
  Trash2,
  UserPlus,
  X,
} from "lucide-react"
import {
  type Aluno,
  type Modalidade,
  calcularIdade,
  faixaEtaria,
  modalidadeDaTurma,
  turmasDisponiveis,
} from "@/lib/alunos-data"
import { formatarTelefone } from "@/lib/alunos-data"

type FormState = {
  nome: string
  dataNascimento: string
  responsavel: string
  telefone: string
  email: string
  turma: string
  modalidade: Modalidade
  horaAula: string
  mensalidade: string
  dataEntrada: string
  observacoes: string
  foto: string
}

type Erros = Partial<Record<keyof FormState, string>>

const hoje = new Date().toISOString().slice(0, 10)

const estadoInicial: FormState = {
  nome: "",
  dataNascimento: "",
  responsavel: "",
  telefone: "",
  email: "",
  turma: "",
  modalidade: "coletiva",
  horaAula: "",
  mensalidade: "",
  dataEntrada: hoje,
  observacoes: "",
  foto: "",
}

export function CadastroForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(estadoInicial)
  const [erros, setErros] = useState<Erros>({})
  const [salvo, setSalvo] = useState<Aluno | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const idade = useMemo(() => {
    if (!form.dataNascimento) return null
    const i = calcularIdade(form.dataNascimento)
    return i >= 0 && i < 120 ? i : null
  }, [form.dataNascimento])

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
    setErros((e) => ({ ...e, [campo]: undefined }))
  }

  function aoSelecionarTurma(turma: string) {
    const modalidade: Modalidade = turma ? modalidadeDaTurma(turma) : form.modalidade
    setForm((f) => ({ ...f, turma, modalidade }))
    setErros((e) => ({ ...e, turma: undefined }))
  }

  function aoEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    const leitor = new FileReader()
    leitor.onload = () => set("foto", String(leitor.result))
    leitor.readAsDataURL(arquivo)
  }

  function validar(): boolean {
    const e: Erros = {}
    if (!form.nome.trim()) e.nome = "Informe o nome completo do aluno."
    if (!form.dataNascimento) e.dataNascimento = "Informe a data de nascimento."
    else if (idade === null) e.dataNascimento = "Data de nascimento inválida."
    if (!form.responsavel.trim()) e.responsavel = "Informe o nome do responsável."
    if (form.telefone.replace(/\D/g, "").length < 10) e.telefone = "Telefone incompleto."
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido."
    if (!form.turma) e.turma = "Selecione uma turma."
    if (!form.dataEntrada) e.dataEntrada = "Informe a data de entrada."
    setErros(e)
    return Object.keys(e).length === 0
  }

  function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!validar()) return
    const novo: Aluno = {
      id: `novo-${Date.now()}`,
      numero: 0,
      nome: form.nome.trim(),
      responsavel: form.responsavel.trim(),
      dataNascimento: form.dataNascimento,
      telefone: form.telefone,
      email: form.email.trim(),
      horaAula: form.horaAula.trim() || "A definir",
      mensalidade: Number(form.mensalidade) || 0,
      turma: form.turma,
      modalidade: form.modalidade,
      ativo: true,
      dataEntrada: form.dataEntrada,
      observacoes: form.observacoes.trim() || undefined,
      foto: form.foto || undefined,
    }
    setSalvo(novo)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function novoCadastro() {
    setForm(estadoInicial)
    setErros({})
    setSalvo(null)
  }

  if (salvo) {
    return <CadastroSucesso aluno={salvo} onNovo={novoCadastro} onIrParaAlunos={() => router.push("/alunos")} />
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-3" noValidate>
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">NEW</span>
          <h2 className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            <UserPlus className="h-4 w-4" strokeWidth={2.5} />
            Ficha de Cadastro
          </h2>
        </header>

        <div className="grid gap-4 p-4 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-2">
            <span className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">Fotografia</span>
            <div className="relative h-32 w-28 overflow-hidden rounded-sm border-2 border-panel-edge bg-panel-shade/60 inset-bevel">
              {form.foto ? (
                <Image src={form.foto || "/placeholder.svg"} alt="Foto do aluno" fill className="object-cover" />
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <Camera className="h-7 w-7" strokeWidth={2} />
                  <span className="font-sans text-[10px]">Sem foto</span>
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none">
                Enviar
              </button>
              {form.foto && (
                <button type="button" onClick={() => set("foto", "")} aria-label="Remover foto" className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 text-danger transition-colors hover:border-danger focus:outline-none">
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={aoEscolherFoto} className="hidden" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Campo className="sm:col-span-2" label="Nome completo do aluno" obrigatorio erro={erros.nome}>
              <input value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Ex.: João Pedro da Silva" className={inputClasses} />
            </Campo>

            <Campo label="Data de nascimento" obrigatorio erro={erros.dataNascimento}>
              <input type="date" max={hoje} value={form.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} className={inputClasses} />
            </Campo>

            <Campo label="Idade (automática)">
              <div className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/40 px-2 py-1.5 inset-bevel">
                <span className="font-pixel text-[12px] text-gold">{idade !== null ? idade : "--"}</span>
                <span className="font-sans text-sm text-muted-foreground">{idade !== null ? `anos • faixa ${faixaEtaria(idade)}` : "informe a data"}</span>
              </div>
            </Campo>
          </div>
        </div>
      </section>

      <FormSection tag="RESP" titulo="Responsável & Contato">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo label="Nome do responsável" obrigatorio erro={erros.responsavel}>
            <input value={form.responsavel} onChange={(e) => set("responsavel", e.target.value)} placeholder="Ex.: Maria da Silva" className={inputClasses} />
          </Campo>

          <Campo label="Telefone do responsável" obrigatorio erro={erros.telefone}>
            <input inputMode="tel" value={form.telefone} onChange={(e) => set("telefone", formatarTelefone(e.target.value))} placeholder="(51) 99999-9999" className={inputClasses} />
          </Campo>

          <Campo className="sm:col-span-2" label="E-mail" erro={erros.email}>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="responsavel@email.com" className={inputClasses} />
          </Campo>
        </div>
      </FormSection>

      <FormSection tag="TUR" titulo="Turma & Horário">
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo label="Turma" obrigatorio erro={erros.turma}>
            <select value={form.turma} onChange={(e) => aoSelecionarTurma(e.target.value)} className={inputClasses}>
              <option value="">Selecione...</option>
              {turmasDisponiveis.map((turma) => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Modalidade">
            <div className="rounded-sm border border-panel-edge bg-panel-shade/40 px-2 py-1.5 inset-bevel">
              <span className="font-sans text-sm font-semibold text-foreground">{form.modalidade === "particular" ? "Particular" : "Coletiva"}</span>
            </div>
          </Campo>

          <Campo className="sm:col-span-2" label="Horário / Aula">
            <input value={form.horaAula} onChange={(e) => set("horaAula", e.target.value)} placeholder="Ex.: Terça 18h30" className={inputClasses} />
          </Campo>

          <Campo label="Mensalidade (R$)">
            <input type="number" min="0" value={form.mensalidade} onChange={(e) => set("mensalidade", e.target.value)} className={inputClasses} />
          </Campo>

          <Campo label="Data de entrada" obrigatorio erro={erros.dataEntrada}>
            <input type="date" max={hoje} value={form.dataEntrada} onChange={(e) => set("dataEntrada", e.target.value)} className={inputClasses} />
          </Campo>
        </div>
      </FormSection>

      <FormSection tag="OBS" titulo="Observações">
        <Campo label="Anotações gerais (opcional)">
          <textarea value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} rows={3} placeholder="Restrições médicas, informações relevantes, etc." className={`${inputClasses} resize-y`} />
        </Campo>
      </FormSection>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <button type="button" onClick={novoCadastro} className="flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none">
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
          Limpar formulário
        </button>
        <button type="submit" className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-5 py-2 font-pixel text-[10px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none">
          <Check className="h-4 w-4" strokeWidth={3} />
          Salvar cadastro
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
  children,
}: {
  tag: string
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
        <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">{tag}</span>
        <h2 className="font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">{titulo}</h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

function CadastroSucesso({
  aluno,
  onNovo,
  onIrParaAlunos,
}: {
  aluno: Aluno
  onNovo: () => void
  onIrParaAlunos: () => void
}) {
  const idade = calcularIdade(aluno.dataNascimento)
  const linhas: { rotulo: string; valor: string }[] = [
    { rotulo: "Aluno", valor: aluno.nome },
    { rotulo: "Idade", valor: `${idade} anos (faixa ${faixaEtaria(idade)})` },
    { rotulo: "Responsável", valor: aluno.responsavel },
    { rotulo: "Telefone", valor: aluno.telefone },
    { rotulo: "Turma", valor: `${aluno.turma} • ${aluno.modalidade === "particular" ? "Particular" : "Coletivo"}` },
    { rotulo: "Horário", valor: aluno.horaAula },
    { rotulo: "Mensalidade", valor: `R$ ${aluno.mensalidade.toLocaleString("pt-BR")}` },
  ]

  return (
    <section className="panel-bevel overflow-hidden rounded-md bg-card">
      <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-primary px-3 py-2">
        <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[8px] leading-none text-gold-foreground">GOAL!</span>
        <h2 className="font-pixel text-[10px] uppercase tracking-wide text-primary-foreground pixel-shadow">Aluno cadastrado</h2>
      </header>

      <div className="flex flex-col items-center gap-3 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-gold/20">
          <Check className="h-8 w-8 text-gold" strokeWidth={3} />
        </div>
        <p className="text-center font-sans text-sm text-muted-foreground text-pretty">O cadastro foi registrado com sucesso na ficha do Educa Soccer.</p>

        <dl className="w-full max-w-md divide-y divide-panel-shade rounded-sm border border-panel-edge bg-panel-shade/30">
          {linhas.map((l) => (
            <div key={l.rotulo} className="flex items-start justify-between gap-3 px-3 py-2">
              <dt className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{l.rotulo}</dt>
              <dd className="text-right font-sans text-sm font-bold text-foreground">{l.valor}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={onIrParaAlunos} className="flex items-center gap-1.5 rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none">
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            Ver lista de alunos
          </button>
          <button type="button" onClick={onNovo} className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-4 py-2 font-pixel text-[10px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none">
            <UserPlus className="h-4 w-4" strokeWidth={3} />
            Novo cadastro
          </button>
        </div>
      </div>
    </section>
  )
}