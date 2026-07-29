"use client"

import { useMemo, useState } from "react"
import {
  Search,
  MessageCircle,
  Pencil,
  ArrowLeftRight,
  UserMinus,
  X,
  Phone,
  Cake,
  CalendarDays,
  MapPin,
  Wallet,
} from "lucide-react"
import { RetroPanel } from "@/components/dashboard/retro-panel"
import { PositionTag } from "@/components/dashboard/position-tag"
import {
  alunos as todosAlunos,
  bairros,
  faixas,
  whatsappLink,
  iniciais,
  type Aluno,
  type FaixaEtaria,
} from "@/lib/students"

type ModalidadeFiltro = "todas" | "particular" | "coletiva"

export function StudentsScreen({ onStatus }: { onStatus: (msg: string) => void }) {
  const [busca, setBusca] = useState("")
  const [bairro, setBairro] = useState("todos")
  const [faixa, setFaixa] = useState<FaixaEtaria>("todas")
  const [modalidade, setModalidade] = useState<ModalidadeFiltro>("todas")
  const [selecionado, setSelecionado] = useState<Aluno | null>(null)

  const ativos = useMemo(() => todosAlunos.filter((a) => a.ativo), [])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const faixaObj = faixas.find((f) => f.valor === faixa)!
    return ativos.filter((a) => {
      if (termo && !a.nome.toLowerCase().includes(termo)) return false
      if (bairro !== "todos" && a.bairro !== bairro) return false
      if (modalidade !== "todas" && a.modalidade !== modalidade) return false
      if (!faixaObj.test(a.idade)) return false
      return true
    })
  }, [ativos, busca, bairro, faixa, modalidade])

  const limparFiltros = () => {
    setBusca("")
    setBairro("todos")
    setFaixa("todas")
    setModalidade("todas")
  }

  const temFiltro = busca || bairro !== "todos" || faixa !== "todas" || modalidade !== "todas"

  return (
    <div className="flex flex-col gap-3">
      {/* Cabeçalho da tela */}
      <RetroPanel title="Consulta de Alunos" tag="ALN">
        <div className="flex flex-wrap items-center gap-3">
          <StatMini label="Alunos Ativos" value={ativos.length} accent="green" />
          <StatMini label="Resultado" value={filtrados.length} accent="gold" />
          <StatMini label="Particulares" value={ativos.filter((a) => a.modalidade === "particular").length} />
          <StatMini label="Coletivos" value={ativos.filter((a) => a.modalidade === "coletiva").length} />
        </div>
      </RetroPanel>

      {/* Filtros */}
      <RetroPanel title="Filtros" tag="F">
        <div className="flex flex-col gap-3">
          {/* Busca */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar pelo nome do aluno..."
              className="w-full rounded-sm border-2 border-panel-shade bg-panel-shade/40 py-2 pl-9 pr-3 font-sans text-sm text-foreground placeholder:text-muted-foreground inset-bevel focus:border-gold focus:outline-none"
            />
          </div>

          {/* Selects */}
          <div className="grid gap-2 sm:grid-cols-3">
            <FilterSelect label="Turma / Local" value={bairro} onChange={setBairro}>
              <option value="todos">Todas as turmas</option>
              {bairros.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Faixa etária" value={faixa} onChange={(v) => setFaixa(v as FaixaEtaria)}>
              {faixas.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {f.label}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              label="Atendimento"
              value={modalidade}
              onChange={(v) => setModalidade(v as ModalidadeFiltro)}
            >
              <option value="todas">Particular e coletivo</option>
              <option value="particular">Somente particular</option>
              <option value="coletiva">Somente coletivo</option>
            </FilterSelect>
          </div>

          {temFiltro && (
            <button
              type="button"
              onClick={limparFiltros}
              className="inline-flex w-fit items-center gap-1.5 rounded-sm border-2 border-panel-shade bg-panel-shade/40 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </button>
          )}
        </div>
      </RetroPanel>

      {/* Lista */}
      <RetroPanel
        title="Alunos Ativos"
        tag="LIST"
        right={<span className="font-pixel text-[9px] text-gold">{filtrados.length} de {ativos.length}</span>}
      >
        {filtrados.length === 0 ? (
          <p className="px-2 py-8 text-center font-sans text-sm text-muted-foreground">
            Nenhum aluno encontrado com os filtros selecionados.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {filtrados.map((a) => (
              <StudentRow
                key={a.id}
                aluno={a}
                onOpen={() => {
                  setSelecionado(a)
                  onStatus(`Ficha aberta: ${a.nome}`)
                }}
                onStatus={onStatus}
              />
            ))}
          </ul>
        )}
      </RetroPanel>

      {selecionado && (
        <StudentDialog aluno={selecionado} onClose={() => setSelecionado(null)} onStatus={onStatus} />
      )}
    </div>
  )
}

function StudentRow({
  aluno,
  onOpen,
  onStatus,
}: {
  aluno: Aluno
  onOpen: () => void
  onStatus: (msg: string) => void
}) {
  const wpp = whatsappLink(aluno.telefone, aluno.nome)
  return (
    <li className="flex items-center gap-2.5 rounded-sm border-2 border-transparent bg-panel-shade/30 px-2.5 py-2 transition-colors hover:border-panel-edge">
      {/* Avatar com iniciais */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-scoreboard font-pixel text-[10px] text-primary-foreground inset-bevel">
        {iniciais(aluno.nome)}
      </span>

      {/* Nome + responsável (clicável para abrir ficha) */}
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left focus:outline-none">
        <span className="block font-sans text-sm font-bold leading-tight text-foreground text-pretty">
          {aluno.nome}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-sans text-[11px] text-muted-foreground">
          {aluno.idade != null && <span>{aluno.idade} anos</span>}
          {aluno.responsavel && <span className="truncate">Resp.: {aluno.responsavel}</span>}
        </span>
      </button>

      {/* Tags */}
      <div className="hidden shrink-0 items-center gap-1 md:flex">
        <PositionTag label={aluno.bairro} variant="blue" />
        <PositionTag
          label={aluno.modalidade === "particular" ? "PART" : "COL"}
          variant={aluno.modalidade === "particular" ? "gold" : "green"}
        />
      </div>

      {/* Ações */}
      <div className="flex shrink-0 items-center gap-1">
        <ActionButton
          title="Contato via WhatsApp"
          onClick={() => {
            if (wpp) {
              window.open(wpp, "_blank", "noopener,noreferrer")
              onStatus(`WhatsApp aberto: ${aluno.nome}`)
            } else {
              onStatus(`Sem telefone cadastrado para ${aluno.nome}`)
            }
          }}
          variant="green"
        >
          <MessageCircle className="h-4 w-4" />
        </ActionButton>
        <ActionButton title="Editar cadastro" onClick={() => onStatus(`Editar cadastro: ${aluno.nome}`)}>
          <Pencil className="h-4 w-4" />
        </ActionButton>
        <ActionButton title="Transferir de turma" onClick={() => onStatus(`Transferir de turma: ${aluno.nome}`)}>
          <ArrowLeftRight className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          title="Marcar como ex-aluno"
          onClick={() => onStatus(`Marcar como ex-aluno: ${aluno.nome}`)}
          variant="danger"
        >
          <UserMinus className="h-4 w-4" />
        </ActionButton>
      </div>
    </li>
  )
}

function StudentDialog({
  aluno,
  onClose,
  onStatus,
}: {
  aluno: Aluno
  onClose: () => void
  onStatus: (msg: string) => void
}) {
  const wpp = whatsappLink(aluno.telefone, aluno.nome)
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha de ${aluno.nome}`}
      onClick={onClose}
    >
      <div
        className="panel-bevel w-full max-w-md overflow-hidden rounded-md bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b-2 border-panel-shade bg-scoreboard px-3 py-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-gold font-pixel text-xs text-gold-foreground inset-bevel">
            {iniciais(aluno.nome)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-pixel text-[11px] uppercase leading-tight tracking-wide text-primary-foreground pixel-shadow text-pretty">
              {aluno.nome}
            </h2>
            <p className="mt-1 font-sans text-[11px] uppercase tracking-widest text-gold">Ficha do Aluno</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ficha"
            className="shrink-0 rounded-sm border-2 border-panel-shade bg-panel-shade/40 p-1 text-primary-foreground transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex flex-col gap-2 p-3">
          <DetailRow icon={Cake} label="Idade">
            {aluno.idade != null ? `${aluno.idade} anos` : "—"}
            {aluno.nascimento && (
              <span className="ml-2 text-muted-foreground">
                (nasc. {new Date(aluno.nascimento).toLocaleDateString("pt-BR")})
              </span>
            )}
          </DetailRow>
          <DetailRow icon={CalendarDays} label="Turma / Horário">
            {aluno.turma}
          </DetailRow>
          <DetailRow icon={MapPin} label="Local">
            {aluno.bairro}
          </DetailRow>
          <DetailRow icon={Wallet} label="Atendimento">
            <span className="capitalize">{aluno.modalidade}</span>
            {aluno.mensalidade != null && (
              <span className="ml-2 text-muted-foreground">
                • Mensalidade R$ {aluno.mensalidade.toLocaleString("pt-BR")}
              </span>
            )}
          </DetailRow>
          <DetailRow icon={Phone} label="Responsável">
            {aluno.responsavel ?? "—"}
            {aluno.telefone && <span className="ml-2 text-muted-foreground">{aluno.telefone}</span>}
          </DetailRow>

          <div className="mt-1 grid grid-cols-2 gap-2">
            <DialogAction
              variant="green"
              onClick={() => {
                if (wpp) {
                  window.open(wpp, "_blank", "noopener,noreferrer")
                  onStatus(`WhatsApp aberto: ${aluno.nome}`)
                } else {
                  onStatus(`Sem telefone cadastrado para ${aluno.nome}`)
                }
              }}
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </DialogAction>
            <DialogAction onClick={() => onStatus(`Editar cadastro: ${aluno.nome}`)}>
              <Pencil className="h-4 w-4" /> Editar
            </DialogAction>
            <DialogAction onClick={() => onStatus(`Transferir de turma: ${aluno.nome}`)}>
              <ArrowLeftRight className="h-4 w-4" /> Transferir
            </DialogAction>
            <DialogAction variant="danger" onClick={() => onStatus(`Marcar como ex-aluno: ${aluno.nome}`)}>
              <UserMinus className="h-4 w-4" /> Ex-aluno
            </DialogAction>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- pequenos blocos reutilizáveis ---------- */

function StatMini({ label, value, accent }: { label: string; value: number; accent?: "green" | "gold" }) {
  return (
    <div className="rounded-sm border-2 border-panel-shade bg-panel-shade/40 px-3 py-1.5 inset-bevel">
      <p className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={
          "mt-0.5 font-pixel text-base leading-none text-outline " +
          (accent === "green" ? "text-primary" : accent === "gold" ? "text-gold" : "text-foreground")
        }
      >
        {value}
      </p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border-2 border-panel-shade bg-panel-shade/40 px-2 py-2 font-sans text-sm font-semibold text-foreground inset-bevel focus:border-gold focus:outline-none"
      >
        {children}
      </select>
    </label>
  )
}

function ActionButton({
  children,
  title,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode
  title: string
  onClick: () => void
  variant?: "default" | "green" | "danger"
}) {
  const cores =
    variant === "green"
      ? "hover:border-primary hover:bg-primary hover:text-primary-foreground"
      : variant === "danger"
        ? "hover:border-danger hover:bg-danger hover:text-white"
        : "hover:border-gold hover:bg-gold hover:text-gold-foreground"
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-sm border-2 border-panel-shade bg-panel-shade/50 p-1.5 text-foreground transition-colors focus:outline-none focus-visible:border-gold ${cores}`}
    >
      {children}
    </button>
  )
}

function DialogAction({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "default" | "green" | "danger"
}) {
  const cores =
    variant === "green"
      ? "hover:border-primary hover:bg-primary hover:text-primary-foreground"
      : variant === "danger"
        ? "hover:border-danger hover:bg-danger hover:text-white"
        : "hover:border-gold hover:bg-gold hover:text-gold-foreground"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-sm border-2 border-panel-shade bg-panel-shade/50 px-2 py-2 font-sans text-xs font-bold uppercase tracking-wide text-foreground transition-colors focus:outline-none focus-visible:border-gold ${cores}`}
    >
      {children}
    </button>
  )
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-sm border-2 border-panel-shade bg-panel-shade/30 px-2.5 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <div className="min-w-0">
        <p className="font-pixel text-[7px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-sans text-sm font-semibold text-foreground text-pretty">{children}</p>
      </div>
    </div>
  )
}
