import { cn } from "@/lib/utils"

type Variant = "default" | "gold" | "green" | "danger" | "blue"

const variants: Record<Variant, string> = {
  default: "bg-secondary text-secondary-foreground",
  gold: "bg-gold text-gold-foreground",
  green: "bg-primary text-primary-foreground",
  danger: "bg-danger text-white",
  blue: "bg-scoreboard text-primary-foreground",
}

export function PositionTag({
  label,
  variant = "default",
  className,
}: {
  label: string
  variant?: Variant
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-sm border border-panel-shade px-1.5 py-0.5 font-pixel text-[8px] leading-none uppercase inset-bevel",
        variants[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
