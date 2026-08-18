// Dados de exemplo (mock) do Álbum de Figurinhas do Educa Soccer (req. 13).
// Espelha a planilha de acompanhamento usada hoje por turma: cada aluno tem
// colunas de figurinha (uma por personagem/comportamento), marcadas "OK"
// quando entregues, com uma observação (motivo) ao lado e uma data de
// entrega. Aqui isso se torna: um catálogo de tipos (13.2) + um histórico de
// entregas por aluno e por ano (13.1/13.3).
// Em uma versão futura, estes dados virão de um banco de dados.

import { alunos, type Aluno } from "./alunos-data"
import { getTurma } from "./turmas-data"

export type TipoFigurinha = {
  id: string
  /** Nome do personagem/mascote impresso na figurinha (ex.: "CR7"). */
  personagem: string
  /** Comportamento, conquista ou habilidade associada (req. 13.2). */
  comportamento: string
  ativo: boolean
}

// Catálogo inicial exigido pelo requisito 13.2 (Son, CR7, Pelé, Buffon).
// A planilha em uso mostra que a escolinha já ampliou esse catálogo em
// algumas turmas (Messi/Organização e Brasil/Trabalho em equipe) — por isso
// o catálogo é editável pela coordenação, e não fixo em 4 tipos.
export const tiposFigurinhaIniciais: TipoFigurinha[] = [
  { id: "tf1", personagem: "Son", comportamento: "Respeito e colaboração com os colegas", ativo: true },
  { id: "tf2", personagem: "CR7", comportamento: "Esforço, dedicação e disciplina", ativo: true },
  { id: "tf3", personagem: "Pelé", comportamento: "Autonomia, desempenho e criatividade", ativo: true },
  { id: "tf4", personagem: "Buffon", comportamento: "Liderança, defesa e comprometimento", ativo: true },
  { id: "tf5", personagem: "Messi", comportamento: "Organização", ativo: true },
  { id: "tf6", personagem: "Brasil", comportamento: "Trabalho em equipe", ativo: true },
]

export type FigurinhaConcedida = {
  id: string
  alunoId: string
  /** Ano do álbum (req. 13.1: cada aluno tem um álbum por ano, com histórico preservado). */
  ano: number
  tipoId: string
  /** Data de recebimento, registrada automaticamente pelo sistema (req. 13.3). */
  data: string // ISO (YYYY-MM-DD)
  /** Motivo pelo qual a figurinha foi concedida. */
  motivo: string
  /** Professor responsável pela entrega. */
  professor: string
}

// Ano vigente do álbum. Fixo (em vez de `new Date()`) para não divergir na
// hidratação entre servidor e cliente; corresponde ao ano corrente do
// sistema (2026).
export const anoAtual = 2026

// Decisão de requisito (13.3, pergunta em aberto): a mesma figurinha PODE
// ser entregue mais de uma vez ao mesmo aluno no mesmo ano — é exatamente o
// que a planilha registra (vários "OK" para o mesmo personagem em datas de
// entrega diferentes). Por isso cada entrega é um registro próprio, e o
// álbum soma a quantidade recebida de cada tipo.
export const figurinhasConcedidasIniciais: FigurinhaConcedida[] = [
  { id: "fg1", alunoId: "a1", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Rafael Duarte" },
  { id: "fg2", alunoId: "a1", ano: 2026, tipoId: "tf1", data: "2026-06-27", motivo: "Posse de bola", professor: "Prof. Rafael Duarte" },
  { id: "fg3", alunoId: "a1", ano: 2026, tipoId: "tf2", data: "2026-06-27", motivo: "Esforço nos treinos", professor: "Prof. Rafael Duarte" },
  { id: "fg4", alunoId: "a1", ano: 2026, tipoId: "tf3", data: "2026-07-25", motivo: "Condução de bola", professor: "Prof. Rafael Duarte" },
  { id: "fg5", alunoId: "a5", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Rafael Duarte" },
  { id: "fg6", alunoId: "a5", ano: 2026, tipoId: "tf3", data: "2026-07-25", motivo: "Condução de bola", professor: "Prof. Rafael Duarte" },
  { id: "fg7", alunoId: "a6", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Rafael Duarte" },
  { id: "fg8", alunoId: "a6", ano: 2026, tipoId: "tf2", data: "2026-06-27", motivo: "Esforço nos treinos", professor: "Prof. Rafael Duarte" },
  { id: "fg9", alunoId: "a12", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Rafael Duarte" },
  { id: "fg10", alunoId: "a12", ano: 2026, tipoId: "tf2", data: "2026-06-27", motivo: "Esforço nos treinos", professor: "Prof. Rafael Duarte" },
  { id: "fg11", alunoId: "a12", ano: 2026, tipoId: "tf3", data: "2026-07-25", motivo: "Posse de bola", professor: "Prof. Rafael Duarte" },
  { id: "fg12", alunoId: "a12", ano: 2026, tipoId: "tf4", data: "2026-08-29", motivo: "Liderança em quadra", professor: "Prof. Rafael Duarte" },
  { id: "fg13", alunoId: "a9", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Bruno Antunes" },
  { id: "fg14", alunoId: "a10", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Rafael Duarte" },
  { id: "fg15", alunoId: "a10", ano: 2026, tipoId: "tf2", data: "2026-06-27", motivo: "Esforço nos treinos", professor: "Prof. Rafael Duarte" },
  { id: "fg16", alunoId: "a8", ano: 2026, tipoId: "tf1", data: "2026-05-23", motivo: "Respeito e colaboração com os colegas", professor: "Prof. Rafael Duarte" },
  { id: "fg17", alunoId: "a8", ano: 2026, tipoId: "tf2", data: "2026-06-27", motivo: "Esforço nos treinos", professor: "Prof. Rafael Duarte" },
  { id: "fg18", alunoId: "a8", ano: 2026, tipoId: "tf3", data: "2026-07-25", motivo: "Posse de bola", professor: "Prof. Rafael Duarte" },
  { id: "fg19", alunoId: "a8", ano: 2026, tipoId: "tf4", data: "2026-08-29", motivo: "Tem o álbum dos mais velhos", professor: "Prof. Rafael Duarte" },
  // Histórico de um ano anterior, para demonstrar a preservação exigida no req. 13.1.
  { id: "fg20", alunoId: "a1", ano: 2025, tipoId: "tf2", data: "2025-09-12", motivo: "Esforço nos treinos", professor: "Prof. Rafael Duarte" },
]

/** Aluno vinculado a uma entrega de figurinha. */
export function alunoDaFigurinha(concedida: FigurinhaConcedida): Aluno | undefined {
  return alunos.find((a) => a.id === concedida.alunoId)
}

/** Tipo de figurinha de uma entrega. */
export function tipoDaFigurinha(concedida: FigurinhaConcedida, tipos: TipoFigurinha[]): TipoFigurinha | undefined {
  return tipos.find((t) => t.id === concedida.tipoId)
}

/** Anos com álbum disponível: os anos com histórico registrado + o ano vigente. */
export function anosDoAlbum(lista: FigurinhaConcedida[]): number[] {
  const anos = new Set(lista.map((f) => f.ano))
  anos.add(anoAtual)
  return Array.from(anos).sort((a, b) => b - a)
}

export type ResumoTipo = {
  tipo: TipoFigurinha
  quantidade: number
  entregas: FigurinhaConcedida[]
}

/**
 * Monta o álbum de um aluno em um ano: para cada tipo cadastrado (ativo),
 * mostra a quantidade recebida e o histórico de entregas (req. 13.1 —
 * figurinhas disponíveis + já recebidas + quantidade + data + motivo).
 */
export function albumDoAluno(
  alunoId: string,
  ano: number,
  concedidas: FigurinhaConcedida[],
  tipos: TipoFigurinha[],
): ResumoTipo[] {
  return tipos
    .filter((t) => t.ativo)
    .map((tipo) => {
      const entregas = concedidas
        .filter((f) => f.alunoId === alunoId && f.ano === ano && f.tipoId === tipo.id)
        .sort((a, b) => a.data.localeCompare(b.data))
      return { tipo, quantidade: entregas.length, entregas }
    })
}

/** Total de figurinhas recebidas por um aluno em um ano. */
export function totalFigurinhasAluno(alunoId: string, ano: number, concedidas: FigurinhaConcedida[]): number {
  return concedidas.filter((f) => f.alunoId === alunoId && f.ano === ano).length
}

/** Resumo numérico para o cabeçalho-placar da tela (req. 13). */
export function resumoAlbum(concedidas: FigurinhaConcedida[], tipos: TipoFigurinha[], ano: number) {
  const doAno = concedidas.filter((f) => f.ano === ano)
  const alunosComAlbum = new Set(doAno.map((f) => f.alunoId)).size
  return {
    total: doAno.length,
    alunosComAlbum,
    tiposAtivos: tipos.filter((t) => t.ativo).length,
  }
}

/** Professor padrão de uma entrega, a partir da turma do aluno. */
export function professorPadraoDoAluno(aluno: Aluno): string {
  return getTurma(aluno.turma)?.professor ?? "Coordenação"
}

/** Próximo id sequencial de entrega com base na lista atual. */
export function proximoIdFigurinha(lista: FigurinhaConcedida[]): string {
  const maior = lista.reduce((max, f) => Math.max(max, Number(f.id.replace(/\D/g, "")) || 0), 0)
  return `fg${maior + 1}`
}

/** Próximo id sequencial de tipo com base na lista atual. */
export function proximoIdTipoFigurinha(lista: TipoFigurinha[]): string {
  const maior = lista.reduce((max, t) => Math.max(max, Number(t.id.replace(/\D/g, "")) || 0), 0)
  return `tf${maior + 1}`
}

/** Cores (estilo tags do jogo) atribuídas ciclicamente a cada tipo cadastrado. */
export const variantesTipoFigurinha = ["gold", "green", "blue", "danger", "default"] as const
export type VarianteTipoFigurinha = (typeof variantesTipoFigurinha)[number]

export function varianteDoTipo(tipoId: string, tipos: TipoFigurinha[]): VarianteTipoFigurinha {
  const indice = tipos.findIndex((t) => t.id === tipoId)
  if (indice < 0) return "default"
  return variantesTipoFigurinha[indice % variantesTipoFigurinha.length]
}

/**
 * Formata data ISO (YYYY-MM-DD) no padrão brasileiro (DD/MM/AAAA).
 * Faz o parse manual dos componentes para evitar o deslocamento de fuso
 * horário do `new Date(iso)`, que causa divergência de hidratação.
 */
export function formatarDataAlbum(iso: string): string {
  if (!iso) return "—"
  const [ano, mes, dia] = iso.slice(0, 10).split("-")
  if (!ano || !mes || !dia) return "—"
  return `${dia}/${mes}/${ano}`
}
