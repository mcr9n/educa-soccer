import Image from "next/image"
import styles from "./alunos-counters.module.css"

type Counter = { label: string; value: number; accent?: "green" | "gold" | "blue" | "danger" }

export function AlunosCounters({
  ativos,
  particulares,
  coletivos,
  exAlunos,
  porTurma,
}: {
  ativos: number
  particulares: number
  coletivos: number
  exAlunos: number
  porTurma: { turma: string; total: number }[]
}) {
  const principais: Counter[] = [
    { label: "Alunos Ativos", value: ativos, accent: "green" },
    { label: "Particulares", value: particulares, accent: "black" },
    { label: "Coletivos", value: coletivos, accent: "black" },
    { label: "Ex-Alunos", value: exAlunos, accent: "danger" },
  ]

  const accentClass: Record<NonNullable<Counter["accent"]>, string> = {
    green: styles.accentGreen,
    gold: styles.accentGold,
    blue: styles.accentBlue,
    danger: styles.accentDanger,
  }

  return (
    <header className={styles.root}>
      <div className={styles.header}>
        <Image
          src="/educa-soccer-crest.png"
          alt="Brasão do Educa Soccer"
          width={32}
          height={32}
          className={styles.brand}
          priority
        />
        <div className={styles.heading}>
          <h1 className={styles.title}>Consulta de Alunos</h1>
          <p className={styles.subtitle}>Elenco Ativo</p>
        </div>
      </div>

      <div className={styles.counterGrid}>
        {principais.map((c) => (
          <div key={c.label} className={styles.counterCard}>
            <p className={styles.counterLabel}>{c.label}</p>
            <p className={`${styles.counterValue} ${accentClass[c.accent ?? "green"]}`}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.tagsBar}>
        <span className={styles.tagsLabel}>Por turma:</span>
        {porTurma.map((t) => (
          <span key={t.turma} className={styles.tag}>
            <span className={styles.tagName}>{t.turma}</span>
            <span className={styles.tagValue}>{t.total}</span>
          </span>
        ))}
      </div>
    </header>
  )
}