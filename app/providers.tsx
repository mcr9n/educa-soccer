"use client"

import { ReactKeycloakProvider } from "@react-keycloak/web"
import keycloak from "@/lib/services/keycloak"

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: "check-sso",
      }}
    >
      {children}
    </ReactKeycloakProvider>
  )
}