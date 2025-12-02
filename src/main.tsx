import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@app";
import { AuthProvider } from "@context/AuthProvider";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@styles/theme";
import "@styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
