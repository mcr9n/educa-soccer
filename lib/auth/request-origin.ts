import type { NextRequest } from "next/server"

/**
 * Resolve a origem pública real da requisição para montar URLs absolutas de
 * redirecionamento (login, callback, logout, etc.).
 *
 * `request.url`/`request.nextUrl` não servem para isso neste ambiente: por
 * trás do proxy que expõe o preview em HTTPS, o host interno do servidor
 * (`localhost:<porta>`) é preservado enquanto só o protocolo é sinalizado via
 * `x-forwarded-proto`, resultando em origens quebradas como
 * `https://localhost:3000` — inalcançável pelo navegador do usuário. Por
 * isso a origem é sempre reconstruída a partir dos headers `x-forwarded-*`
 * (com fallback para `host`), que refletem corretamente o domínio público.
 */
export function resolverOrigemPublica(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host
  const protocolo = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "")
  return `${protocolo}://${host}`
}

/** Monta uma URL absoluta para `caminho` usando a origem pública real da requisição. */
export function urlPublica(caminho: string, request: NextRequest): URL {
  return new URL(caminho, resolverOrigemPublica(request))
}
