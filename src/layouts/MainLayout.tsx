import { Box } from "@mui/material";
import PrimaryHeader from "@components/Header";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import { Outlet } from "react-router-dom";
import React from "react";

type Variant = "authenticated" | "unauthenticated";

interface BaseLayoutProps {
  variant: Variant;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ variant }) => {
  const showHeader = variant === "authenticated";

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
          }}
        >
          <Outlet />
        </Box>
        <Footer variant={variant} />
      </Box>
    </Box>
  );
};

export default BaseLayout;
