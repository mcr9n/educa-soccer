// Dados de exemplo (mock) de alunos do Educa Soccer.
// Os campos espelham a ficha de cadastro usada hoje na planilha:
// RESPONSAVEL, ALUNO, DATA DE NASCIMENTO, TELEFONE, E-MAIL, HORA/AULA,
// MENSALIDADE, TURMA e situacao (ATIVO). Em uma versao futura, estes dados
// virao de um banco de dados.

import type { Modalidade } from "./turmas-data"

export type { Modalidade } from "./turmas-data"
export { turmasDisponiveis, modalidadeDaTurma } from "./turmas-data"

export type Aluno = {
  id: string
  numero: number
  nome: string
  responsavel: string
  dataNascimento: string // ISO (YYYY-MM-DD)
  telefone: string // formato (DD) 9XXXX-XXXX
  email: string
  mensalidade: number
  turma: string
  modalidade: Modalidade
  ativo: boolean
  dataEntrada?: string // ISO (YYYY-MM-DD) - data de entrada na escolinha
  observacoes?: string
  foto?: string // data URL ou caminho da fotografia (opcional)
}

export const alunos: Aluno[] = [
  {
    id: "a1",
    numero: 1,
    nome: "Aletea Vega Marona Kunde",
    responsavel: "João Inácio Marona Kunde",
    dataNascimento: "2016-01-31",
    telefone: "(51) 99335-6910",
    email: "joao.kunde@email.com",
    mensalidade: 230,
    turma: "SUDOESTE (QUINTA 18H40 E SÁBADO 09H00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a2",
    numero: 2,
    nome: "Bernardo Amaral de Andrade",
    responsavel: "Aline Cornélia do Amaral Andrade",
    dataNascimento: "2018-01-04",
    telefone: "(61) 98114-7236",
    email: "aline.andrade@email.com",
    mensalidade: 230,
    turma: "SUDOESTE (SEXTA - 17h00 às 18h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a3",
    numero: 3,
    nome: "Ana Maria de Sousa Silva Cunha",
    responsavel: "João Matheus de Sousa Cunha",
    dataNascimento: "2015-11-05",
    telefone: "(61) 99397-3773",
    email: "joao.cunha@email.com",
    mensalidade: 230,
    turma: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a4",
    numero: 4,
    nome: "Eduardo Krabbe Catteli",
    responsavel: "Marcos Catteli",
    dataNascimento: "2014-03-22",
    telefone: "(61) 99812-5544",
    email: "marcos.catteli@email.com",
    mensalidade: 230,
    turma: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a5",
    numero: 5,
    nome: "Caio Costa Britto",
    responsavel: "Renata Costa Britto",
    dataNascimento: "2016-07-18",
    telefone: "(61) 98233-1290",
    email: "renata.britto@email.com",
    mensalidade: 230,
    turma: "ASA NORTE (SEGUNDA E QUARTA - 18h00 às 19h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a6",
    numero: 6,
    nome: "João Miguel Itacarambi Canedo de Freitas",
    responsavel: "Patrícia Canedo de Freitas",
    dataNascimento: "2015-05-09",
    telefone: "(62) 99441-7788",
    email: "patricia.freitas@email.com",
    mensalidade: 230,
    turma: "SUDOESTE (SÁBADO - 09h00 às 10h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a7",
    numero: 7,
    nome: "Lorenzo Borreli Belas",
    responsavel: "Fábio Belas",
    dataNascimento: "2013-10-08",
    telefone: "(61) 99126-4590",
    email: "fabio.belas@email.com",
    mensalidade: 420,
    turma: "PARTICULAR (HORÁRIO A COMBINAR)",
    modalidade: "particular",
    ativo: true,
  },
  {
    id: "a8",
    numero: 8,
    nome: "Joaquim Fernandes Magalhães",
    responsavel: "Carla Fernandes",
    dataNascimento: "2019-02-14",
    telefone: "(61) 98800-3321",
    email: "carla.fernandes@email.com",
    horaAula: "Sábado 10h40 às 11h40",
    mensalidade: 230,
    turma: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a9",
    numero: 9,
    nome: "Adriano Rueda Fernandes",
    responsavel: "Sérgio Rueda",
    dataNascimento: "2017-09-30",
    telefone: "(61) 99655-2010",
    email: "sergio.rueda@email.com",
    horaAula: "Terça e Quinta 18h00",
    mensalidade: 230,
    turma: "NOROESTE (TERÇA E QUINTA - 18h00 às 19h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a10",
    numero: 10,
    nome: "Henrique Catelli",
    responsavel: "Débora Catelli",
    dataNascimento: "2011-05-28",
    telefone: "(61) 99733-8845",
    email: "debora.catelli@email.com",
    horaAula: "Aula particular — Segunda 19h00",
    mensalidade: 420,
    turma: "PARTICULAR (HORÁRIO A COMBINAR)",
    modalidade: "particular",
    ativo: true,
  },
  {
    id: "a11",
    numero: 11,
    nome: "Gabriel Campos da Silva",
    responsavel: "Rodrigo Campos",
    dataNascimento: "2010-08-03",
    telefone: "(61) 98277-6633",
    email: "rodrigo.campos@email.com",
    horaAula: "Segunda e Quarta 19h00",
    mensalidade: 230,
    turma: "ASA NORTE (SEGUNDA E QUARTA - 19h00 às 20h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a12",
    numero: 12,
    nome: "Felipe Álvares Soriano",
    responsavel: "Mariana Soriano",
    dataNascimento: "2016-03-05",
    telefone: "(61) 99012-4478",
    email: "mariana.soriano@email.com",
    horaAula: "Sábado 09h00 às 10h00",
    mensalidade: 230,
    turma: "SUDOESTE (SÁBADO - 09h00 às 10h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a13",
    numero: 13,
    nome: "Thiago Caetano Peixoto de Camargo",
    responsavel: "Luiz Peixoto de Camargo",
    dataNascimento: "2014-09-12",
    telefone: "(61) 99388-2255",
    email: "luiz.camargo@email.com",
    horaAula: "Terça e Quinta 17h00",
    mensalidade: 230,
    turma: "NOROESTE (TERÇA E QUINTA - 17h00 às 18h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a14",
    numero: 14,
    nome: "Heitor Borges Barros",
    responsavel: "Camila Borges",
    dataNascimento: "2013-11-19",
    telefone: "(61) 98566-1177",
    email: "camila.borges@email.com",
    horaAula: "Segunda e Quarta 18h00",
    mensalidade: 230,
    turma: "ASA NORTE (SEGUNDA E QUARTA - 18h00 às 19h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a15",
    numero: 15,
    nome: "Ana Carvalho Filippi",
    responsavel: "Gustavo Filippi",
    dataNascimento: "2012-04-11",
    telefone: "(61) 99744-9900",
    email: "gustavo.filippi@email.com",
    horaAula: "Segunda e Quarta 19h00",
    mensalidade: 230,
    turma: "ASA NORTE (SEGUNDA E QUARTA - 19h00 às 20h00)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a16",
    numero: 16,
    nome: "Manuela Dias Rangel",
    responsavel: "Simone Rangel",
    dataNascimento: "2019-06-27",
    telefone: "(61) 98122-3388",
    email: "simone.rangel@email.com",
    horaAula: "Sábado 10h40 às 11h40",
    mensalidade: 230,
    turma: "SUDOESTE (SÁBADO - 10h40 às 11h40)",
    modalidade: "coletiva",
    ativo: true,
  },
  {
    id: "a17",
    numero: 17,
    nome: "Rafael Teixeira Nunes",
    responsavel: "Alexandre Teixeira",
    dataNascimento: "2015-12-01",
    telefone: "(61) 99855-4412",
    email: "alexandre.teixeira@email.com",
    horaAula: "Aula particular — Sexta 18h00",
    mensalidade: 420,
    turma: "PARTICULAR (HORÁRIO A COMBINAR)",
    modalidade: "particular",
    ativo: true,
  },
  {
    id: "a18",
    numero: 18,
    nome: "Isabela Moraes Prado",
    responsavel: "Fernanda Prado",
    dataNascimento: "2017-01-23",
    telefone: "(61) 98399-7766",
    email: "fernanda.prado@email.com",
    horaAula: "Terça e Quinta 18h00",
    mensalidade: 230,
    turma: "NOROESTE (TERÇA E QUINTA - 18h00 às 19h00)",
    modalidade: "coletiva",
    ativo: true,
  },
]

// Quantidade de ex-alunos (indicador do requisito 4.3). Em producao viria do banco.
export const totalExAlunos = 37

/** Idade em anos completos a partir da data de nascimento (ISO). */
export function calcularIdade(dataNascimento: string, hoje = new Date()): number {
  const nasc = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nasc.getFullYear()
  const mes = hoje.getMonth() - nasc.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--
  return idade
}

export type FaixaEtaria = "5 a 7" | "8 a 10" | "11 a 13" | "14+"

/** Faixa etaria de acordo com a idade. */
export function faixaEtaria(idade: number): FaixaEtaria {
  if (idade < 11) return "sub-11"
  if (idade < 10) return "sub-10"
  if (idade < 8) return "sub-8"
  if (idade < 7) return "sub-7"
  return "11+"
}

export const faixasEtarias: FaixaEtaria[] = [ "sub-7","sub-8", "sub-10", "sub-11", "11+"]

/** Monta o link de conversa no WhatsApp a partir do telefone cadastrado. */
export function linkWhatsApp(telefone: string, nomeAluno: string): string {
  const digitos = telefone.replace(/\D/g, "")
  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`
  const texto = encodeURIComponent(
    `Olá! Falo da escolinha Educa Soccer sobre o aluno ${nomeAluno}.`,
  )
  return `https://wa.me/${numero}?text=${texto}`
}

/**
 * Formata a data (YYYY-MM-DD) no padrao brasileiro (DD/MM/AAAA).
 * Faz o parse manual dos componentes para evitar o deslocamento de fuso
 * horario do `new Date(iso)`, que interpreta a data como UTC e causa
 * divergencia de hidratacao entre servidor e cliente.
 */
export function formatarData(dataISO: string): string {
  if (!dataISO) return "—"
  const [ano, mes, dia] = dataISO.slice(0, 10).split("-")
  if (!ano || !mes || !dia) return "—"
  return `${dia}/${mes}/${ano}`
}

/** Aplica a mascara de telefone brasileiro: (DD) 9XXXX-XXXX. */
export function formatarTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** Proximo numero sequencial de matricula com base na lista atual. */
export function proximoNumero(lista: Aluno[]): number {
  return lista.reduce((max, a) => Math.max(max, a.numero), 0) + 1
}
