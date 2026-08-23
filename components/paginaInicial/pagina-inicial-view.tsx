"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useKeycloak } from "@react-keycloak/web"
import { LogIn, LogOut } from "lucide-react"

export function PaginaInicialView() {
  const { keycloak, initialized } = useKeycloak()

  useEffect(() => {
    if (keycloak?.token) {
      localStorage.setItem("accessToken", keycloak.token)
    } else {
      localStorage.removeItem("accessToken")
    }
  }, [keycloak?.token])

  function login() {
    keycloak.login({
      redirectUri: `${window.location.origin}/dashboard`,
    })
  }

  function logout() {
    keycloak.logout({
      redirectUri: window.location.origin,
    })
  }

  if (!initialized) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/soccer_background_theme.jpg')",
        }}
      >
        <div className="rounded-xl bg-black/70 px-8 py-6 shadow-2xl backdrop-blur-sm">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-white">
            Carregando...
          </p>
        </div>
      </main>
    )
  }

  const username =
    keycloak.tokenParsed?.preferred_username ??
    keycloak.tokenParsed?.name ??
    "Usuário"

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage: "url('/soccer_background_theme.jpg')",
      }}
    >
      {/* Camada escura sobre a imagem */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card central */}
      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/75 shadow-2xl backdrop-blur-md">
        {/* Faixa superior */}
        <div className="h-1.5 w-full bg-danger" />

        <div className="flex flex-col items-center px-8 py-10 text-center">
          <Image
            src="/educa-soccer-crest.png"
            alt="Brasão do Educa Soccer"
            width={90}
            height={90}
            priority
            className="mb-5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
          />

          <h1 className="font-pixel text-xl uppercase tracking-wide text-white pixel-shadow sm:text-2xl">
            Educa Soccer
          </h1>

          <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.22em] text-danger">
            Gestão da Escolinha
          </p>

          <div className="my-7 h-px w-full bg-white/10" />

          {!keycloak.authenticated ? (
            <>
              <p className="mb-6 max-w-xs font-sans text-sm leading-relaxed text-white/70">
                Acesse sua conta para continuar para o sistema de gestão do
                Educa Soccer.
              </p>

              <button
                type="button"
                onClick={login}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-danger px-5 py-3 font-sans text-sm font-bold uppercase tracking-wider text-black transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-black"
              >
                <LogIn className="h-4 w-4" strokeWidth={2.5} />
                Entrar
              </button>
            </>
          ) : (
            <>
              <p className="mb-6 font-sans text-sm text-white/70">
                Você está autenticado como{" "}
                <span className="font-bold text-white">{username}</span>.
              </p>

              <a
                href="/dashboard"
                className="mb-3 inline-flex w-full items-center justify-center rounded-md bg-danger px-5 py-3 font-sans text-sm font-bold uppercase tracking-wider text-black transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                Ir para o sistema
              </a>

              <button
                type="button"
                onClick={logout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 font-sans text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 focus:outline-none"
              >
                <LogOut className="h-4 w-4" strokeWidth={2.5} />
                Sair
              </button>
            </>
          )}
        </div>

        <footer className="border-t border-white/10 bg-black/30 px-6 py-4 text-center">
          <p className="font-sans text-[11px] uppercase tracking-widest text-white/40">
            Educa Soccer
          </p>
        </footer>
      </section>
    </main>
  )
}