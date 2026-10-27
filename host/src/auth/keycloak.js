import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8082",
  realm: "healthcare",
  clientId: "healthcare-portal",
});

export default keycloak;