import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@app";
import { AuthProvider } from "@context/AuthProvider";
import theme from "@styles/theme";
import "@styles/index.css";
import { CssBaseline, ThemeProvider } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
