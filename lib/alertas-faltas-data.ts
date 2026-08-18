// Calculo de alertas de faltas consecutivas (req. 10.2).
// A partir do historico de chamadas (lib/chamada-data.ts), identifica alunos
// que acumularam N faltas consecutivas na propria turma, sendo N configuravel
// pelo usuario na tela (ex.: 3 faltas consecutivas).
//
// Regra de contagem, andando pelas chamadas da turma em ordem cronologica:
// - "ausente"              -> soma 1 na sequencia atual;
// - "presente" ou
//   "ausencia_justificada" -> zera a sequencia (a falta foi justificada ou
//                              o aluno voltou a frequentar);
// - "aula_cancelada" ou
//   "nao_se_aplica"        -> e ignorado (a aula nao ocorreu normalmente
//                              para o aluno, entao nao conta nem zera).
//
// O alerta e gerado quando a sequencia mais recente (a que termina na ultima
// chamada registrada da turma) atinge o limite configurado.

import { alunos, linkWhatsApp, type Aluno } from "./alunos-data"
import { type Chamada, formatarDataBR } from "./chamada-data"

/** Quantidade padrao de faltas consecutivas para disparar o alerta. */
export const limiteFaltasPadrao = 3

/** Limites configuraveis oferecidos no seletor da tela. */
export const opcoesLimiteFaltas = [2, 3, 4, 5]

export type AlertaFalta = {
  aluno: Aluno
  turma: string
  quantidadeFaltas: number
  datasFaltas: string[] // ISO (YYYY-MM-DD), em ordem cronologica
}

/**
 * Calcula, para um aluno especifico, a sequencia de faltas consecutivas mais
 * recente dentro das chamadas de sua turma (ja ordenadas por data).
 */
function sequenciaAtualDeFaltas(alunoId: string, chamadasDaTurmaOrdenadas: Chamada[]): string[] {
  let sequencia: string[] = []
  for (const chamada of chamadasDaTurmaOrdenadas) {
    const presenca = chamada.presencas.find((p) => p.alunoId === alunoId)
    if (!presenca) continue
    if (presenca.status === "ausente") {
      sequencia = [...sequencia, chamada.data]
    } else if (presenca.status === "presente" || presenca.status === "ausencia_justificada") {
      sequencia = []
    }
    // "aula_cancelada" e "nao_se_aplica" sao ignorados (nao alteram a sequencia).
  }
  return sequencia
}

/**
 * Identifica todos os alunos ativos com faltas consecutivas iguais ou acima
 * do limite informado (req. 10.2: quantidade configuravel).
 */
export function calcularAlertasFaltas(chamadas: Chamada[], limite: number): AlertaFalta[] {
  const alertas: AlertaFalta[] = []

  const turmas = Array.from(new Set(chamadas.map((c) => c.turma)))
  for (const turma of turmas) {
    const chamadasDaTurma = chamadas.filter((c) => c.turma === turma).sort((a, b) => a.data.localeCompare(b.data))
    const alunosDaTurma = alunos.filter((a) => a.ativo && a.turma === turma)

    for (const aluno of alunosDaTurma) {
      const sequencia = sequenciaAtualDeFaltas(aluno.id, chamadasDaTurma)
      if (sequencia.length >= limite) {
        alertas.push({ aluno, turma, quantidadeFaltas: sequencia.length, datasFaltas: sequencia })
      }
    }
  }

  // Alunos com mais faltas consecutivas aparecem primeiro.
  return alertas.sort((a, b) => b.quantidadeFaltas - a.quantidadeFaltas || a.aluno.nome.localeCompare(b.aluno.nome))
}

/** Lista formatada (DD/MM/AAAA) das datas de ausencia de um alerta. */
export function datasFaltasFormatadas(alerta: AlertaFalta): string {
  return alerta.datasFaltas.map(formatarDataBR).join(", ")
}

/** Link do WhatsApp para contatar o responsavel sobre as faltas do aluno. */
export function linkContatoFaltas(alerta: AlertaFalta): string {
  const digitos = alerta.aluno.telefone.replace(/\D/g, "")
  const numero = digitos.startsWith("55") ? digitos : `55${digitos}`
  const texto = encodeURIComponent(
    `Olá! Falo da escolinha Educa Soccer. Notamos que ${alerta.aluno.nome} teve ${alerta.quantidadeFaltas} faltas consecutivas na turma. Está tudo bem? Podemos ajudar em algo?`,
  )
  return `https://wa.me/${numero}?text=${texto}`
}

// Reexportado para uso direto nos componentes, se necessario.
export { linkWhatsApp }
