import { NextResponse } from "next/server"
import { obterSessao } from "@/lib/auth/session"

/** Retorna o usuário autenticado atual, ou 401 se não houver sessão. */
export async function GET() {
  const usuario = await obterSessao()
  if (!usuario) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }
  return NextResponse.json({ usuario })
}
