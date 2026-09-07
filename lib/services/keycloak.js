import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8999/",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "educa-soccer-realm",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "professor-client",
});

export default keycloak;