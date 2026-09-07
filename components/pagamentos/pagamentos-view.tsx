"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Search, Wallet } from "lucide-react"
import { type Aluno } from "@/lib/alunos-data"
import { listarAlunos } from "@/lib/services/alunos-api"
import { listarTurmas } from "@/lib/services/turmas-api"
import { listarPagamentos, registrarPagamento, reabrirPagamento } from "@/lib/services/pagamentos-api"
import {
  type Pagamento,
  type SituacaoPagamento,
  type FormaPagamento,
  meses,
  formatarValor,
} from "@/lib/pagamentos-data"
import { TurmaPagamentos, type LinhaPagamento } from "./pagamento-turma"

type SituacaoFiltro = SituacaoPagamento | "todas"
type ModalidadeFiltro = "todas" | "coletiva" | "particular"

const anoAtualSistema = new Date().getFullYear()
const mesAtualPadrao = new Date().getMonth() + 1
const anosDisponiveis = [anoAtualSistema]

export function PagamentosView() {
  const [lista, setLista] = useState<Pagamento[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmasDisponiveis, setTurmasDisponiveis] = useState<string[]>([])
  const [busca, setBusca] = useState("")
  const [turmaFiltro, setTurmaFiltro] = useState("todas")
  const [mesFiltro, setMesFiltro] = useState(mesAtualPadrao)
  const [anoFiltro, setAnoFiltro] = useState(anoAtualSistema)
  const [situacaoFiltro, setSituacaoFiltro] = useState<SituacaoFiltro>("todas")
  const [modalidadeFiltro, setModalidadeFiltro] = useState<ModalidadeFiltro>("todas")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([listarAlunos(), listarTurmas()])
      .then(([alunosApi, turmasApi]) => {
        setAlunos(alunosApi)
        setTurmasDisponiveis(turmasApi.map((turma) => turma.nome))
      })
      .catch(() => setErro("Não foi possível carregar alunos e turmas."))
  }, [])

  useEffect(() => {
    setCarregando(true)
    listarPagamentos(anoFiltro, mesFiltro)
      .then(setLista)
      .catch(() => setErro("Não foi possível carregar os pagamentos."))
      .finally(() => setCarregando(false))
  }, [anoFiltro, mesFiltro])

  // Registrar pagamento (req. 6.2): marca como pago e salva os dados.
  async function registrar(
    id: string,
    dados: {
      dataPagamento: string
      valorRecebido: number
      formaPagamento: FormaPagamento
      responsavelRegistro: string
      observacoes?: string
    },
  ) {
    await registrarPagamento(id, dados)
    setLista((prev) => prev.map((p) => (p.id === id ? { ...p, situacao: "pago", ...dados } : p)))
  }

  // Reabrir um pagamento pago (volta para pendente).
  async function reabrir(id: string) {
    await reabrirPagamento(id)
    setLista((prev) => prev.map((p) => p.id === id
      ? { ...p, situacao: "pendente", dataPagamento: undefined, valorRecebido: undefined, formaPagamento: undefined, responsavelRegistro: undefined }
      : p))
  }

  // Aplica todos os filtros do requisito 6.4.
  const linhasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const resultado: LinhaPagamento[] = []
    for (const pg of lista) {
      if (pg.ano !== anoFiltro) continue
      if (pg.mes !== mesFiltro) continue
      const aluno = alunos.find((item) => item.id === pg.alunoId)
      if (!aluno || !aluno.ativo) continue
      if (turmaFiltro !== "todas" && aluno.turma !== turmaFiltro) continue
      if (modalidadeFiltro !== "todas" && aluno.modalidade !== modalidadeFiltro) continue
      if (situacaoFiltro !== "todas" && pg.situacao !== situacaoFiltro) continue
      if (termo && !aluno.nome.toLowerCase().includes(termo) && !aluno.responsavel.toLowerCase().includes(termo))
        continue
      resultado.push({ aluno, pagamento: pg })
    }
    return resultado
  }, [lista, alunos, busca, turmaFiltro, mesFiltro, anoFiltro, situacaoFiltro, modalidadeFiltro])

  // Agrupa por turma (req. 6.1: alunos organizados por turma).
  const grupos = useMemo(() => {
    const mapa = new Map<string, LinhaPagamento[]>()
    for (const linha of linhasFiltradas) {
      const arr = mapa.get(linha.aluno.turma) ?? []
      arr.push(linha)
      mapa.set(linha.aluno.turma, arr)
    }
    return Array.from(mapa.entries()).map(([turma, linhas]) => ({
      turma,
      modalidade: linhas[0].aluno.modalidade,
      linhas: linhas.sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome)),
    }))
  }, [linhasFiltradas])

  // Resumo financeiro do mes/ano selecionado.
  const resumo = useMemo(() => {
    const acc = { recebido: 0, aberto: 0, pagos: 0, pendentes: 0, atrasados: 0, isentos: 0 }
    for (const { pagamento } of linhasFiltradas) {
      if (pagamento.situacao === "pago") {
        acc.recebido += pagamento.valorRecebido ?? pagamento.valor
        acc.pagos++
      } else if (pagamento.situacao === "pendente") {
        acc.aberto += pagamento.valor
        acc.pendentes++
      } else if (pagamento.situacao === "atrasado") {
        acc.aberto += pagamento.valor
        acc.atrasados++
      } else {
        acc.isentos++
      }
    }
    return acc
  }, [linhasFiltradas])

  const temFiltro =
    busca !== "" ||
    turmaFiltro !== "todas" ||
    situacaoFiltro !== "todas" ||
    modalidadeFiltro !== "todas" ||
    mesFiltro !== mesAtualPadrao ||
    anoFiltro !== anoAtualSistema

  const cards = [
    { label: "Recebido", value: formatarValor(resumo.recebido), cls: "text-primary" },
    { label: "Em aberto", value: formatarValor(resumo.aberto), cls: "text-gold" },
    { label: "Pagos", value: String(resumo.pagos), cls: "text-primary" },
    { label: "Pendentes", value: String(resumo.pendentes), cls: "text-gold" },
    { label: "Atrasados", value: String(resumo.atrasados), cls: "text-danger" },
  ]

  return (
    <>
      {erro && <p className="rounded-sm border border-danger bg-danger/10 p-3 text-sm text-danger">{erro}</p>}
      {carregando && <p className="p-4 text-sm text-muted-foreground">Carregando pagamentos...</p>}
      {/* Cabeçalho placar */}
      <header className="panel-bevel overflow-hidden rounded-md bg-card">
        <div className="flex items-center gap-3 bg-scoreboard px-3 py-2">
          <Image
            src="/educa-soccer-crest.png"
            alt="Brasão do Educa Soccer"
            width={32}
            height={32}
            className="shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-pixel text-sm uppercase tracking-wide text-white pixel-shadow sm:text-base">
              Gestão de Pagamentos
            </h1>
            <p className="font-sans text-[14px] font-semibold uppercase tracking-widest text-danger">
              {meses[mesFiltro - 1]} / {anoFiltro}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-panel-shade sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="inset-bevel bg-card px-3 py-2">
              <p className="font-pixel text-[13px] uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className={`mt-1 font-pixel text-base leading-none text-outline text-white ${c.cls}`}>{c.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Filtros (req. 6.4) */}
      <section className="panel-bevel overflow-hidden rounded-md bg-card">
        <header className="flex items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-2">
          <span className="rounded-sm bg-gold px-1.5 py-0.5 font-pixel text-[13px] leading-none text-gold-foreground">
            FILTRO
          </span>
          <h2 className="font-pixel text-[13px] uppercase tracking-wide text-white pixel-shadow">
            Buscar & Filtrar
          </h2>
        </header>

        <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 xl:col-span-1">
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

          <FiltroSelect label="Turma" value={turmaFiltro} onChange={setTurmaFiltro}
            options={[{ value: "todas", label: "Todas as turmas" }, ...turmasDisponiveis.map((t) => ({ value: t, label: t }))]}
          />
          <FiltroSelect label="Mês" value={String(mesFiltro)} onChange={(v) => setMesFiltro(Number(v))}
            options={meses.map((m, i) => ({ value: String(i + 1), label: m }))}
          />
          <FiltroSelect label="Ano" value={String(anoFiltro)} onChange={(v) => setAnoFiltro(Number(v))}
            options={anosDisponiveis.map((a) => ({ value: String(a), label: String(a) }))}
          />
          <FiltroSelect label="Situação" value={situacaoFiltro} onChange={(v) => setSituacaoFiltro(v as SituacaoFiltro)}
            options={[
              { value: "todas", label: "Todas" },
              { value: "pago", label: "Pago" },
              { value: "pendente", label: "Pendente" },
              { value: "atrasado", label: "Atrasado" },
              { value: "isento", label: "Isento" },
            ]}
          />
          <FiltroSelect label="Modalidade" value={modalidadeFiltro} onChange={(v) => setModalidadeFiltro(v as ModalidadeFiltro)}
            options={[
              { value: "todas", label: "Todas" },
              { value: "coletiva", label: "Coletiva" },
              { value: "particular", label: "Particular" },
            ]}
          />
        </div>

        <div className="flex items-center justify-between gap-2 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-2">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold text-muted-foreground">
            <Wallet className="h-3.5 w-3.5 text-gold" strokeWidth={2.5} />
            {linhasFiltradas.length} mensalidade(s) • {grupos.length} turma(s)
          </p>
          {temFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusca("")
                setTurmaFiltro("todas")
                setMesFiltro(mesAtualPadrao)
                setAnoFiltro(anoAtualSistema)
                setSituacaoFiltro("todas")
                setModalidadeFiltro("todas")
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
            <TurmaPagamentos
              key={g.turma}
              turma={g.turma}
              modalidade={g.modalidade}
              linhas={g.linhas}
              onRegistrar={(id, dados) => void registrar(id, dados)}
              onReabrir={(id) => void reabrir(id)}
            />
          ))}
        </div>
      ) : (
        <div className="panel-bevel rounded-md bg-card px-4 py-10 text-center">
          <p className="font-pixel text-[13px] uppercase text-muted-foreground">Nenhuma mensalidade encontrada</p>
          <p className="mt-2 font-sans text-sm text-muted-foreground">Ajuste o mês, o ano ou os filtros.</p>
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
