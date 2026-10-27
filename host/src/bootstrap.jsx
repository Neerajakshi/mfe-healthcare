import React from "react";
import { createRoot } from "react-dom/client";
import createApiClient from "./api/apiClient";
import { Provider } from "react-redux";
import keycloak from "./auth/keycloak";
import { store } from "./store";
import App from "./App";
import authService from "./auth/authService";



const renderApp = ({apiClient}) => {
    const root = createRoot(
        document.getElementById("root")
    );
    root.render(
        <Provider store={store}>
            <App 
             apiClient={apiClient}
            />
        </Provider>
    );
};
const apiClient = createApiClient(authService);

renderApp({apiClient});

// keycloak
//     .init({
//         onLoad: "login-required",
//         checkLoginIframe: false
//     })
//     .then((authenticated) => {
//         if (!authenticated) {
//             console.error("User is not authenticated");
//             return;
//         }

//         console.log("Keycloak authentication successful");
//         console.log(
//             "Username:",
//             keycloak.tokenParsed?.preferred_username
//         );

//         console.log(
//             "Access token:",
//             keycloak.token
//         );

//         const apiClient = createApiClient(keycloak);

//         renderApp(apiClient);
//     })
//     .catch((error) => {
//         console.error(
//             "Keycloak initialization failed:",
//             error
//         );
//     });