import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AsgardeoProvider } from "@asgardeo/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AsgardeoProvider
      baseUrl={import.meta.env.VITE_THUNDER_BASE_URL as string}
      clientId={import.meta.env.VITE_REACT_APP_CLIENT_ID as string}
      platform="AsgardeoV2"
    >
      <App />
    </AsgardeoProvider>
  </StrictMode>
);
