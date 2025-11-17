import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@app";
import { AuthProvider } from "@context/AuthProvider";
import "@styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
