"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { NavList } from "./quick-menu"
import { UserMenu } from "./user-menu"

/**
 * Navegação mobile (< lg): cabeçalho compacto com botão hamburguer que abre
 * uma gaveta lateral (drawer) sobrepondo o conteúdo, com os mesmos itens do
 * menu de mesa. Substitui a sidebar fixa, que no mobile ocuparia largura
 * horizontal ou empilharia um menu gigante acima do conteúdo.
 */
export function MobileNav({ secao }: { secao: string }) {
  const [aberto, setAberto] = useState(false)

  // Fecha a gaveta com Escape e trava o scroll do body enquanto aberta.
  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false)
    }
    document.addEventListener("keydown", aoTeclar)
    const overflowOriginal = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", aoTeclar)
      document.body.style.overflow = overflowOriginal
    }
  }, [aberto])

  return (
    <>
      <header className="panel-bevel sticky top-0 z-30 flex items-center gap-2 rounded-md bg-scoreboard px-3 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu de navegação"
          aria-expanded={aberto}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border-2 border-panel-edge bg-panel-shade/40 text-primary-foreground transition-colors active:bg-gold active:text-gold-foreground"
        >
          <Menu className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <Image
          src="/educa-soccer-crest.png"
          alt="Logotipo do EducaSoccer"
          width={28}
          height={28}
          className="shrink-0 drop-shadow"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-pixel text-[13px] uppercase leading-none tracking-tight text-primary-foreground">
            {secao}
          </p>
        </div>
      </header>

      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu de navegação"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-black/70"
          />
          <div className="panel-bevel absolute inset-y-0 left-0 flex w-[82vw] max-w-xs flex-col overflow-hidden rounded-r-md bg-card">
            <header className="flex shrink-0 items-center gap-2 border-b-2 border-panel-shade bg-scoreboard px-3 py-3">
              <Image
                src="/educa-soccer-crest.png"
                alt="Logotipo do EducaSoccer"
                width={32}
                height={32}
                className="shrink-0 drop-shadow"
              />
              <div className="min-w-0 flex-1">
                <p className="font-pixel text-base font-extrabold uppercase leading-none tracking-tight">
                  <span className="text-primary-foreground">EDUCA</span>
                  <span className="text-danger">SOCCER</span>
                </p>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-danger">Menu Principal</p>
              </div>
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2 border-panel-edge bg-panel-shade/50 text-foreground transition-colors hover:border-danger hover:text-danger focus:outline-none"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </header>

            <NavList onNavigate={() => setAberto(false)} />
            <UserMenu />
          </div>
        </div>
      )}
    </>
  )
}
