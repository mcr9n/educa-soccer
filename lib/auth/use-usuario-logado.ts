"use client"

import useSWR from "swr"
import type { UsuarioSessao } from "./types"

async function buscarUsuarioLogado(url: string): Promise<UsuarioSessao | null> {
  const res = await fetch(url)
  if (res.status === 401) return null
  if (!res.ok) throw new Error("Falha ao carregar usuário autenticado.")
  const data = await res.json()
  return data.usuario as UsuarioSessao
}

/** Usuário autenticado atual, para exibir nome/papel e o botão de logout no shell do app. */
export function useUsuarioLogado() {
  const { data, isLoading } = useSWR("/api/auth/me", buscarUsuarioLogado, {
    revalidateOnFocus: false,
  })
  return { usuario: data ?? null, carregando: isLoading }
}

/** Rótulo amigável para exibição do papel principal do usuário. */
export function rotuloPapel(papeis: UsuarioSessao["papeis"]): string {
  if (papeis.includes("ADMIN")) return "Administrador"
  if (papeis.includes("COORDENADOR")) return "Coordenação"
  if (papeis.includes("PROFESSOR")) return "Professor"
  return "Usuário"
}
