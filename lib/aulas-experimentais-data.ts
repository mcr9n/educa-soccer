// Dados de exemplo (mock) da gestao de aulas experimentais do Educa Soccer (requisito 9).
// Os campos espelham a planilha usada hoje (RESPONSAVEL, ALUNO, IDADE, TURMA DE
// INTERESSE, ENTROU EM CONTATO, AULA EXPERIMENTAL - DATA, FEZ AULA EXPERIMENTAL?,
// FECHOU MATRICULA?, OBSERVACAO), acrescida dos campos do levantamento de requisitos
// (telefone, origem do contato e situacao do atendimento). Em uma versao futura estes
// dados virao de um banco de dados.

export type SituacaoContato =
  | "Novo contato"
  | "Aguardando resposta"
  | "Aula experimental agendada"
  | "Aula experimental realizada"
  | "Matrícula confirmada"
  | "Não teve interesse"
  | "Sem retorno"

export const situacoesContato: SituacaoContato[] = [
  "Novo contato",
  "Aguardando resposta",
  "Aula experimental agendada",
  "Aula experimental realizada",
  "Matrícula confirmada",
  "Não teve interesse",
  "Sem retorno",
]

export type OrigemContato =
  | "Indicação"
  | "Instagram"
  | "WhatsApp"
  | "Formulário do site"
  | "Passou na frente"
  | "Outro"

export const origensContato: OrigemContato[] = [
  "Indicação",
  "Instagram",
  "WhatsApp",
  "Formulário do site",
  "Passou na frente",
  "Outro",
]

export type AulaExperimental = {
  id: string
  nomeCrianca: string
  idade: string // texto livre, ex.: "7,5 anos" (espelha a planilha)
  nomeResponsavel: string
  telefone: string
  dataPrimeiroContato: string // ISO (YYYY-MM-DD)
  turmaInteresse: string
  origemContato: OrigemContato
  dataAulaExperimental: string | null // ISO ou null (ainda nao agendada)
  situacao: SituacaoContato
  observacoes: string
}

export const aulasExperimentais: AulaExperimental[] = [
  {
    id: "ae1",
    nomeCrianca: "Bruno",
    idade: "7,5 anos",
    nomeResponsavel: "Leticia Mesquita",
    telefone: "(61) 99887-1122",
    dataPrimeiroContato: "2026-02-09",
    turmaInteresse: "SUDOESTE (SEXTA - 17h00 às 18h00)",
    origemContato: "Indicação",
    dataAulaExperimental: "2026-02-20",
    situacao: "Não teve interesse",
    observacoes:
      "Agendou aula experimental, mas no final disse que ia treinar na escola pela logística. Também perguntou se tinha turma seg/qua a tarde.",
  },
  {
    id: "ae2",
    nomeCrianca: "Enzo",
    idade: "7 anos",
    nomeResponsavel: "Jak",
    telefone: "(61) 99221-3344",
    dataPrimeiroContato: "2026-02-18",
    turmaInteresse: "SUDOESTE (SÁBADO - 09h00 às 10h00)",
    origemContato: "Instagram",
    dataAulaExperimental: "2026-02-21",
    situacao: "Sem retorno",
    observacoes: "Demonstrou interesse no sábado. Agendou aula, mas não levou. Entrei em contato novamente e não respondeu.",
  },
  {
    id: "ae3",
    nomeCrianca: "Gabriel Paiva",
    idade: "10 anos",
    nomeResponsavel: "Ana Cristina",
    telefone: "(61) 99456-7788",
    dataPrimeiroContato: "2026-01-27",
    turmaInteresse: "SUDOESTE (SEXTA - 17h00 às 18h00)",
    origemContato: "Indicação",
    dataAulaExperimental: "2026-01-30",
    situacao: "Não teve interesse",
    observacoes: "Fez aula experimental sexta (10h). Agendou para sábado, mas nunca foi pela logística.",
  },
  {
    id: "ae4",
    nomeCrianca: "Vicente",
    idade: "9 anos",
    nomeResponsavel: "Bruno Oliveira",
    telefone: "(61) 99334-5566",
    dataPrimeiroContato: "2026-01-31",
    turmaInteresse: "SUDOESTE (SÁBADO - 09h00 às 10h00)",
    origemContato: "Outro",
    dataAulaExperimental: "2026-01-31",
    situacao: "Sem retorno",
    observacoes: "Ex-aluno fez um treino em 31/01. Está fazendo muitas atividades e com o tempo apertado. Talvez turma na semana possa servir.",
  },
  {
    id: "ae5",
    nomeCrianca: "Miguel",
    idade: "4 anos",
    nomeResponsavel: "Diego Neves",
    telefone: "(61) 98123-4455",
    dataPrimeiroContato: "2026-03-19",
    turmaInteresse: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)",
    origemContato: "Formulário do site",
    dataAulaExperimental: "2026-03-19",
    situacao: "Matrícula confirmada",
    observacoes: "Aula realizada no dia (19/03). Aluno fechou matrícula.",
  },
  {
    id: "ae6",
    nomeCrianca: "Henrique",
    idade: "7 anos",
    nomeResponsavel: "Erval",
    telefone: "(61) 99887-6655",
    dataPrimeiroContato: "2026-03-02",
    turmaInteresse: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    origemContato: "WhatsApp",
    dataAulaExperimental: "2026-03-06",
    situacao: "Não teve interesse",
    observacoes: "Fez aula experimental sexta e sábado (06 e 07/03), porém disse que o atleta ia treinar na escola.",
  },
  {
    id: "ae7",
    nomeCrianca: "Henrique Emrich Lopes",
    idade: "3 anos",
    nomeResponsavel: "Felipe",
    telefone: "(61) 99765-4321",
    dataPrimeiroContato: "2026-03-14",
    turmaInteresse: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    origemContato: "Indicação",
    dataAulaExperimental: "2026-03-14",
    situacao: "Matrícula confirmada",
    observacoes: "Fez aula experimental (14/03). Fechou matrícula.",
  },
  {
    id: "ae8",
    nomeCrianca: "Não informado",
    idade: "5 anos",
    nomeResponsavel: "Erika",
    telefone: "(61) 98455-1290",
    dataPrimeiroContato: "2026-03-21",
    turmaInteresse: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    origemContato: "Instagram",
    dataAulaExperimental: null,
    situacao: "Sem retorno",
    observacoes: "Entrou em contato, porém, quando respondi não deu retorno. Entrar em contato novamente.",
  },
  {
    id: "ae9",
    nomeCrianca: "Tomas",
    idade: "8 anos",
    nomeResponsavel: "Rejane",
    telefone: "(61) 99012-3344",
    dataPrimeiroContato: "2026-03-30",
    turmaInteresse: "PARTICULAR (HORÁRIO A COMBINAR)",
    origemContato: "Indicação",
    dataAulaExperimental: "2026-03-30",
    situacao: "Aula experimental realizada",
    observacoes: "Fez aula particular experimental. Aguardando retorno sobre matrícula.",
  },
  {
    id: "ae10",
    nomeCrianca: "Gabrielzinho",
    idade: "6 anos",
    nomeResponsavel: "Estefania",
    telefone: "(61) 98211-7654",
    dataPrimeiroContato: "2026-06-02",
    turmaInteresse: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)",
    origemContato: "Formulário do site",
    dataAulaExperimental: "2026-06-11",
    situacao: "Aula experimental agendada",
    observacoes: "Interesse na turma de quinta às 17h. Confirmar horário um dia antes.",
  },
  {
    id: "ae11",
    nomeCrianca: "Gabriel",
    idade: "10 anos",
    nomeResponsavel: "Adriana Caixeta",
    telefone: "(61) 99344-8899",
    dataPrimeiroContato: "2026-06-05",
    turmaInteresse: "ASA NORTE (SEGUNDA E QUARTA - 18h00 às 19h00)",
    origemContato: "Indicação",
    dataAulaExperimental: null,
    situacao: "Aguardando resposta",
    observacoes: "Perguntou sobre valores e horários. Aguardando confirmação de disponibilidade.",
  },
  {
    id: "ae12",
    nomeCrianca: "Não informado",
    idade: "10 anos",
    nomeResponsavel: "Igor Galdino",
    telefone: "(61) 98700-1122",
    dataPrimeiroContato: "2026-07-08",
    turmaInteresse: "ASA NORTE (SEGUNDA E QUARTA - 19h00 às 20h00)",
    origemContato: "Formulário do site",
    dataAulaExperimental: null,
    situacao: "Novo contato",
    observacoes: "Interesse em aula à noite. Preencheu formulário no site.",
  },
]

/** Proximo id sequencial com base na lista atual. */
export function proximoIdAulaExperimental(lista: AulaExperimental[]): string {
  const maior = lista.reduce((max, a) => {
    const n = Number(a.id.replace(/\D/g, "")) || 0
    return Math.max(max, n)
  }, 0)
  return `ae${maior + 1}`
}

/**
 * Formata data ISO (YYYY-MM-DD) no padrao brasileiro (DD/MM/AAAA).
 * Faz o parse manual dos componentes para evitar o deslocamento de fuso
 * horario do `new Date(iso)`, que causa divergencia de hidratacao.
 */
export function formatarDataBR(iso: string | null): string {
  if (!iso) return "—"
  const [ano, mes, dia] = iso.slice(0, 10).split("-")
  if (!ano || !mes || !dia) return "—"
  return `${dia}/${mes}/${ano}`
}

/** Variante de tag coerente com o restante do app para cada situacao de atendimento. */
export function situacaoVariant(s: SituacaoContato): "default" | "gold" | "green" | "danger" | "blue" {
  switch (s) {
    case "Matrícula confirmada":
      return "green"
    case "Aula experimental agendada":
      return "blue"
    case "Aula experimental realizada":
      return "gold"
    case "Novo contato":
      return "default"
    case "Aguardando resposta":
      return "gold"
    case "Não teve interesse":
    case "Sem retorno":
      return "danger"
    default:
      return "default"
  }
}

/** Rotulo curto para exibir na etiqueta (PositionTag) de cada situacao. */
export function situacaoTag(s: SituacaoContato): string {
  switch (s) {
    case "Matrícula confirmada":
      return "OK"
    case "Aula experimental agendada":
      return "AGD"
    case "Aula experimental realizada":
      return "FEZ"
    case "Novo contato":
      return "NOVO"
    case "Aguardando resposta":
      return "AGU"
    case "Não teve interesse":
      return "SEM INT."
    case "Sem retorno":
      return "S/ RET."
    default:
      return "—"
  }
}

/** Monta o link de conversa no WhatsApp a partir do telefone cadastrado. */
export function linkWhatsApp(telefone: string, nomeCrianca: string): string {
  const digitos = telefone.replace(/\D/g, "")
  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`
  const texto = encodeURIComponent(
    `Olá! Aqui é da escolinha Educa Soccer. Vamos conversar sobre a aula experimental de ${nomeCrianca}?`,
  )
  return `https://wa.me/${numero}?text=${texto}`
}

// Reexporta utilitarios ja existentes para uso na tela de aulas experimentais.
export { turmasDisponiveis, modalidadeDaTurma } from "./turmas-data"
export { formatarTelefone } from "./alunos-data"
