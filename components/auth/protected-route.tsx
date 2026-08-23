"use client"

import { useKeycloak } from "@react-keycloak/web"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { keycloak, initialized } = useKeycloak()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      router.replace("/")
    }
  }, [
    initialized,
    keycloak.authenticated,
    router,
  ])

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (!keycloak.authenticated) {
    return null
  }

  return <>{children}</>
}