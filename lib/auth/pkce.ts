import { randomBytes, createHash } from "node:crypto"

/** Gera uma string aleatória URL-safe, usada como `state` e `code_verifier` do PKCE. */
export function gerarStringAleatoria(bytes = 32): string {
  return randomBytes(bytes).toString("base64url")
}

/** Deriva o `code_challenge` (S256) a partir do `code_verifier`, conforme RFC 7636. */
export function gerarCodeChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url")
}
