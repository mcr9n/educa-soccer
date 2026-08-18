import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { authConfig, COOKIE_SESSAO } from "./config"
import type { SessaoPayload, UsuarioSessao } from "./types"

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error(
      "AUTH_SECRET não está configurada. Defina essa variável de ambiente para assinar a sessão de autenticação.",
    )
  }
  return new TextEncoder().encode(secret)
}

/** Assina a sessão do usuário autenticado em um JWT compacto (usado como valor do cookie). */
export async function criarTokenSessao(usuario: UsuarioSessao): Promise<string> {
  return new SignJWT({ usuario } satisfies Omit<SessaoPayload, "exp">)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${authConfig.duracaoSessaoSegundos}s`)
    .sign(getSecret())
}

/** Verifica e decodifica o token de sessão. Retorna `null` se ausente, inválido ou expirado. */
export async function verificarTokenSessao(token: string | undefined): Promise<SessaoPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessaoPayload
  } catch {
    return null
  }
}

/** Grava o cookie `HttpOnly` de sessão a partir do usuário autenticado. */
export async function criarSessao(usuario: UsuarioSessao): Promise<void> {
  const token = await criarTokenSessao(usuario)
  const store = await cookies()
  store.set(COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: authConfig.duracaoSessaoSegundos,
  })
}

/** Remove o cookie de sessão (logout local). */
export async function destruirSessao(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_SESSAO)
}

/** Lê a sessão atual (Server Components, Route Handlers, Server Actions). */
export async function obterSessao(): Promise<UsuarioSessao | null> {
  const store = await cookies()
  const payload = await verificarTokenSessao(store.get(COOKIE_SESSAO)?.value)
  return payload?.usuario ?? null
}

/** Igual a `obterSessao`, mas lança se não houver usuário autenticado. Use em rotas/páginas já protegidas pelo proxy. */
export async function exigirSessao(): Promise<UsuarioSessao> {
  const usuario = await obterSessao()
  if (!usuario) {
    throw new Error("Sessão obrigatória: nenhum usuário autenticado.")
  }
  return usuario
}
