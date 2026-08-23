import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8999/",
    realm: "educa-soccer-realm",
    clientId: "professor-client",
});

export default keycloak;