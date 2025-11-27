import { Box } from "@mui/material";
import SidebarAuth from "@components/SidebarAuth";
import FooterAuth from "@components/FooterAuth";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <SidebarAuth />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          {children}
        </Box>
        <FooterAuth />
      </Box>
    </Box>
  );
};

export default AuthLayout;
