"use client"

import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { rotuloPapel, useUsuarioLogado } from "@/lib/auth/use-usuario-logado"

function obterIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  const iniciais = partes.length > 1 ? `${partes[0][0]}${partes[partes.length - 1][0]}` : partes[0]?.slice(0, 2) ?? "?"
  return iniciais.toUpperCase()
}

/**
 * Identificação do usuário autenticado + botão de logout. Usado no rodapé do
 * menu de mesa (`QuickMenu`) e na gaveta mobile (`MobileNav`).
 */
export function UserMenu() {
  const { usuario, carregando } = useUsuarioLogado()

  if (carregando) {
    return <div className="h-14 shrink-0 border-t-2 border-panel-shade bg-panel-shade/20" />
  }

  if (!usuario) return null

  return (
    <div className="flex shrink-0 items-center gap-2.5 border-t-2 border-panel-shade bg-panel-shade/20 px-3 py-3">
      <Avatar size="sm" className="border-2 border-panel-edge">
        <AvatarFallback className="bg-gold font-pixel text-[10px] font-bold text-gold-foreground">
          {obterIniciais(usuario.nome)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-xs font-bold text-foreground">{usuario.nome}</p>
        <Badge variant="secondary" className="mt-0.5 px-1.5 py-0 text-[9px] uppercase leading-none">
          {rotuloPapel(usuario.papeis)}
        </Badge>
      </div>

      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          aria-label="Sair do sistema"
          title="Sair do sistema"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-panel-edge bg-panel-shade/40 text-foreground transition-colors hover:border-danger hover:bg-danger/10 hover:text-danger focus-visible:border-danger focus-visible:outline-none"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  )
}
