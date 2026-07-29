// Dados de exemplo (mock) de alunos do Educa Soccer.
// Os campos espelham a ficha de cadastro usada hoje na planilha:
// RESPONSAVEL, ALUNO, DATA DE NASCIMENTO, TELEFONE, E-MAIL, HORA/AULA,
// MENSALIDADE, TURMA e situacao (ATIVO). Em uma versao futura, estes dados
// virao de um banco de dados.

export type Modalidade = "coletiva" | "particular"

export type Aluno = {
  id: string
  numero: number
  nome: string
  responsavel: string
  dataNascimento: string // ISO (YYYY-MM-DD)
  telefone: string // formato (DD) 9XXXX-XXXX
  email: string
  horaAula: string
  mensalidade: number
  turma: string
  modalidade: Modalidade
  ativo: boolean
}

export const turmasDisponiveis = ["Sub-7", "Sub-9", "Sub-11", "Sub-13", "Sub-15", "Particular"] as const

export const alunos: Aluno[] = [
  {
    id: "a1",
    numero: 1,
    nome: "Aletea Vega Marona Kunde",
    responsavel: "João Inácio Marona Kunde",
    dataNascimento: "2016-01-31",
    telefone: "(51) 99335-6910",
    email: "joao.kunde@email.com",
    horaAula: "Quinta 18h40 e Sábado 09h00",
    mensalidade: 230,
    turma: "Sub-9",
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
    horaAula: "Sexta 17h00 às 18h00",
    mensalidade: 230,
    turma: "Sub-7",
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
    horaAula: "Sábado 10h40 às 11h40",
    mensalidade: 230,
    turma: "Sub-11",
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
    horaAula: "Terça e Quinta 17h00",
    mensalidade: 230,
    turma: "Sub-13",
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
    horaAula: "Segunda e Quarta 18h00",
    mensalidade: 230,
    turma: "Sub-9",
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
    horaAula: "Sábado 09h00 às 10h00",
    mensalidade: 230,
    turma: "Sub-11",
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
    horaAula: "Aula particular — Quarta 19h00",
    mensalidade: 420,
    turma: "Particular",
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
    turma: "Sub-7",
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
    turma: "Sub-9",
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
    turma: "Particular",
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
    turma: "Sub-15",
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
    turma: "Sub-9",
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
    turma: "Sub-13",
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
    turma: "Sub-13",
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
    turma: "Sub-15",
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
    turma: "Sub-7",
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
    turma: "Particular",
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
    turma: "Sub-9",
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
  if (idade <= 7) return "5 a 7"
  if (idade <= 10) return "8 a 10"
  if (idade <= 13) return "11 a 13"
  return "14+"
}

export const faixasEtarias: FaixaEtaria[] = ["5 a 7", "8 a 10", "11 a 13", "14+"]

/** Monta o link de conversa no WhatsApp a partir do telefone cadastrado. */
export function linkWhatsApp(telefone: string, nomeAluno: string): string {
  const digitos = telefone.replace(/\D/g, "")
  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`
  const texto = encodeURIComponent(
    `Olá! Falo da escolinha Educa Soccer sobre o aluno ${nomeAluno}.`,
  )
  return `https://wa.me/${numero}?text=${texto}`
}

/** Formata a data de nascimento no padrao brasileiro. */
export function formatarData(dataISO: string): string {
  return new Date(dataISO).toLocaleDateString("pt-BR")
}
