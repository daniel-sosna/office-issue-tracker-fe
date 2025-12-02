import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@app";
import { AuthProvider } from "@context/AuthProvider";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@styles/theme";
import "@styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let queryClient: QueryClient;

try {
  queryClient = new QueryClient();
} catch (err: unknown) {
  const error = err instanceof Error ? err : new Error(String(err));
  console.error("Failed to initialize QueryClient:", error);
  queryClient = new QueryClient();
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
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
