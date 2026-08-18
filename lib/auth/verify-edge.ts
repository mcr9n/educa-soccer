import { jwtVerify } from "jose"
import type { SessaoPayload } from "./types"

/**
 * Verificação do token de sessão para uso no `proxy.ts`.
 *
 * Separado de `session.ts` porque o proxy não pode importar `next/headers`
 * (usa `NextRequest`/`NextResponse` para ler/escrever cookies) nem o
 * marcador `server-only`. A lógica de verificação (jose + `AUTH_SECRET`) é a
 * mesma.
 */
export async function verificarTokenSessaoEdge(token: string | undefined): Promise<SessaoPayload | null> {
  if (!token) return null
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload as unknown as SessaoPayload
  } catch {
    return null
  }
}
