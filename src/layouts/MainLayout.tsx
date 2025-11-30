import { Box } from "@mui/material";
import PrimaryHeader from "@components/Header";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import { Outlet } from "react-router-dom";
import React from "react";

type Variant = "authenticated" | "unauthenticated";

interface BaseLayoutProps {
  variant: Variant;
  header?: React.ReactNode;
  children: React.ReactNode;
  centerContent?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  variant,
  header,
  children,
  centerContent,
}) => {
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
        {header}
        <Box
          sx={{
            flex: 1,
            p: 4,
            ...(centerContent
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
    <BaseLayout variant="authenticated" header={<PrimaryHeader />}>
      <Outlet />
    </BaseLayout>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <BaseLayout variant="unauthenticated" centerContent>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </BaseLayout>
  );
};
