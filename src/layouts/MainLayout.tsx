import { Box } from "@mui/material";
import PrimaryHeader from "@components/Header";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import { Outlet } from "react-router-dom";
import React from "react";

type Variant = "authenticated" | "unauthenticated";

interface BaseLayoutProps {
  variant: Variant;
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ variant, children }) => {
  const showHeader = variant === "authenticated";
  const isCentered = variant === "unauthenticated";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Sidebar variant={variant} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {showHeader && <PrimaryHeader />}
        <Box
          sx={{
            flex: 1,
            p: 4,
            ...(isCentered
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {}),
          }}
        >
          {children}
        </Box>
        <Footer variant={variant} />
      </Box>
    </Box>
  );
};

export const MainLayout: React.FC = () => {
  return (
    <BaseLayout variant="authenticated">
      <Outlet />
    </BaseLayout>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return <BaseLayout variant="unauthenticated">{children}</BaseLayout>;
};
