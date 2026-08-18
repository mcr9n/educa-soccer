"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Search, Shirt, Plus } from "lucide-react"
import { turmasDisponiveis } from "@/lib/turmas-data"
import { formatarValor } from "@/lib/pagamentos-data"
import {
  pedidosUniformes as pedidosIniciais,
  alunoDoPedido,
  resumoUniformes,
  proximoIdPedidoUniforme,
  type PedidoUniforme,
} from "@/lib/uniformes-data"
import { TurmaPedidos, type LinhaPedido } from "./pedido-turma"
import { PedidoUniformeForm } from "./pedido-form"

type SituacaoFiltro = "todas" | "pagamento-pendente" | "pagamento-ok" | "entregue" | "nao-entregue" | "repasse-ok" | "repasse-pendente"

const opcoesSituacao: { value: SituacaoFiltro; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "pagamento-pendente", label: "Pagamento pendente" },
  { value: "pagamento-ok", label: "Pagamento realizado" },
  { value: "entregue", label: "Uniforme entregue" },
  { value: "nao-entregue", label: "Uniforme não entregue" },
  { value: "repasse-ok", label: "Repasse realizado" },
  { value: "repasse-pendente", label: "Repasse pendente" },
]

export function UniformesView() {
  const [lista, setLista] = useState<PedidoUniforme[]>(pedidosIniciais)
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState("todas")
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoFiltro>("todas")
  const [formulario, setFormulario] = useState<"fechado" | "novo" | PedidoUniforme>("fechado")
  const [exclusaoPendente, setExclusaoPendente] = useState<PedidoUniforme | null>(null)

  function criarPedido(dados: Omit<PedidoUniforme, "id" | "pago" | "entregue" | "repassadoJP">) {
    setLista((prev) => [
      ...prev,
      { ...dados, id: proximoIdPedidoUniforme(prev), pago: false, entregue: false, repassadoJP: false },
    ])
  }

  function editarPedido(id: string, dados: Omit<PedidoUniforme, "id" | "pago" | "entregue" | "repassadoJP">) {
    setLista((prev) => prev.map((p) => (p.id === id ? { ...p, ...dados } : p)))
  }

  function togglePago(id: string) {
    setLista((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, pago: !p.pago, dataPagamento: !p.pago ? new Date().toISOString().slice(0, 10) : undefined }
          : p,
      ),
    )
  }

  function toggleEntregue(id: string) {
    setLista((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, entregue: !p.entregue, dataEntrega: !p.entregue ? new Date().toISOString().slice(0, 10) : undefined }
          : p,
      ),
    )
  }

  function toggleRepasse(id: string) {
    setLista((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              repassadoJP: !p.repassadoJP,
              dataRepasse: !p.repassadoJP ? new Date().toISOString().slice(0, 10) : undefined,
            }
          : p,
      ),
    )
  }

  function excluirPedido(id: string) {
    setLista((prev) => prev.filter((p) => p.id !== id))
    setExclusaoPendente(null)
  }

  // Aplica os filtros do requisito 11.
  const linhasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const resultado: LinhaPedido[] = []
    for (const pedido of lista) {
      const aluno = alunoDoPedido(pedido)
      if (!aluno) continue
      if (turmaFiltro !== "todas" && aluno.turma !== turmaFiltro) continue
      if (situacaoFiltro === "pagamento-pendente" && pedido.pago) continue
      if (situacaoFiltro === "pagamento-ok" && !pedido.pago) continue
      if (situacaoFiltro === "entregue" && !pedido.entregue) continue
      if (situacaoFiltro === "nao-entregue" && pedido.entregue) continue
      if (situacaoFiltro === "repasse-ok" && !pedido.repassadoJP) continue
      if (situacaoFiltro === "repasse-pendente" && pedido.repassadoJP) continue
      if (termo && !aluno.nome.toLowerCase().includes(termo) && !aluno.responsavel.toLowerCase().includes(termo))
        continue
      resultado.push({ aluno, pedido })
    }
    return resultado
  }, [lista, busca, turmaFiltro, situacaoFiltro])

  // Agrupa por turma.
  const grupos = useMemo(() => {
    const mapa = new Map<string, LinhaPedido[]>()
    for (const linha of linhasFiltradas) {
      const arr = mapa.get(linha.aluno.turma) ?? []
      arr.push(linha)
      mapa.set(linha.aluno.turma, arr)
    }
    return Array.from(mapa.entries())
      .map(([turma, linhas]) => ({ turma, linhas: linhas.sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome)) }))
      .sort((a, b) => a.turma.localeCompare(b.turma))
  }, [linhasFiltradas])

  const resumo = resumoUniformes(lista)
  const valorTotal = lista.reduce((s, p) => s + p.valor, 0)

  const temFiltro = busca !== "" || turmaFiltro !== "todas" || situacaoFiltro !== "todas"

  const cards = [
    { label: "Pedidos", value: String(resumo.total), cls: "text-primary" },
    { label: "Valor total", value: formatarValor(valorTotal), cls: "text-primary" },
    { label: "Pag. pendente", value: String(resumo.pagamentoPendente), cls: "text-gold" },
    { label: "A entregar", value: String(resumo.entregaPendente), cls: "text-gold" },
    { label: "Repasse pend.", value: String(resumo.repassePendente), cls: "text-danger" },
  ]

  return (
    <>
      {/* Cabeçalho placar */}
      <header className="panel-bevel overflow-hidden rounded-md bg-card">
        <div className="flex items-center gap-3 bg-scoreboard px-3 py-2">
          <Image
            src="/educa-soccer-crest.png"
            alt="Brasão do Educa Soccer"
            width={32}
            height={32}
            className="size-8 shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-primary-foreground pixel-shadow sm:text-base">
              Gestão de Uniformes
            </h1>
            <p className="font-sans text-[14px] font-semibold uppercase tracking-widest text-danger">
              Pedidos, pagamentos, entregas e repasse ao JP
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormulario("novo")}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border-2 border-gold bg-gold px-2.5 py-1.5 font-pixel text-[13px] uppercase tracking-wide text-gold-foreground transition-transform hover:-translate-y-0.5 focus:outline-none"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            Novo pedido
          </button>
        </div>

        <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className={`mt-1 font-pixel text-base leading-none text-outline text-primary-foreground ${c.cls}`}>{c.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Filtros (req. 11) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">Aluno / responsável</span>
            <span className="flex items-center gap-2 rounded-sm border border-panel-edge bg-panel-shade/60 px-2 py-1.5 inset-bevel focus-within:border-gold">
              <Search className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </span>
          </label>

          <FiltroSelect
            label="Turma"
            value={turmaFiltro}
            onChange={setTurmaFiltro}
            options={[{ value: "todas", label: "Todas as turmas" }, ...turmasDisponiveis.map((t) => ({ value: t, label: t }))]}
          />
          <FiltroSelect
            label="Situação"
            value={situacaoFiltro}
            onChange={(v) => setSituacaoFiltro(v as SituacaoFiltro)}
            options={opcoesSituacao}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <Shirt className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {linhasFiltradas.length} pedido(s) • {grupos.length} turma(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusca("")
                setTurmaFiltro("todas")
                setSituacaoFiltro("todas")
              }}
              className="rounded-sm border border-panel-edge bg-panel-shade/50 px-2 py-1 font-sans text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      {/* Lista agrupada por turma */}
      {grupos.length > 0 ? (
        <div className="flex flex-col gap-2">
          {grupos.map((g) => (
            <TurmaPedidos
              key={g.turma}
              turma={g.turma}
              linhas={g.linhas}
              onTogglePago={togglePago}
              onToggleEntregue={toggleEntregue}
              onToggleRepasse={toggleRepasse}
              onEditar={(pedido) => setFormulario(pedido)}
              onExcluir={(id) => setExclusaoPendente(lista.find((p) => p.id === id) ?? null)}
            />
          ))}
        </div>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-[13px] uppercase text-muted-foreground">Nenhum pedido encontrado</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">Ajuste os filtros ou cadastre um novo pedido.</p>
        </div>
      )}

      {formulario !== "fechado" && (
        <PedidoUniformeForm
          pedidoEditando={formulario === "novo" ? undefined : formulario}
          pedidosExistentes={lista}
          onClose={() => setFormulario("fechado")}
          onSalvar={(dados) => {
            if (formulario === "novo") criarPedido(dados)
            else editarPedido(formulario.id, dados)
          }}
        />
      )}

      {exclusaoPendente && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          onClick={() => setExclusaoPendente(null)}
        >
          <div
            className="panel-bevel w-full max-w-sm overflow-hidden rounded-md bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
              <h2 className="font-pixel text-[13px] uppercase tracking-wide text-primary-foreground pixel-shadow">
                Excluir pedido
              </h2>
            </header>
            <div className="p-3">
              <p className="font-sans text-sm text-foreground text-pretty">
                Tem certeza que deseja excluir o pedido de uniforme de{" "}
                <span className="font-bold">{alunoDoPedido(exclusaoPendente)?.nome}</span>? Esta ação não pode ser
                desfeita.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => excluirPedido(exclusaoPendente.id)}
                  className="inline-flex flex-1 items-center justify-center rounded-sm border-2 border-danger bg-danger px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 focus:outline-none"
                >
                  Excluir
                </button>
                <button
                  type="button"
                  onClick={() => setExclusaoPendente(null)}
                  className="rounded-sm border-2 border-panel-edge bg-panel-shade/50 px-3 py-2 font-pixel text-[13px] uppercase tracking-wide text-foreground transition-colors hover:border-gold hover:text-gold focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
