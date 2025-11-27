import React from "react";
import { Box, Avatar } from "@mui/material";

const SidebarAuth: React.FC = () => {
  return (
    <Box
      sx={{
        width: "90px",
        bgcolor: "#fff",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <Avatar
        src="/src/assets/Cognizant_Logo.jpeg"
        alt="Logo"
        sx={{
          width: 50,
          height: 50,
          mb: 5,
        }}
      />
    </Box>
  );
};

export default SidebarAuth;
