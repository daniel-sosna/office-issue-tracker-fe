import { Box } from "@mui/material";
import type { ReactNode } from "react";
import PrimaryHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <PrimaryHeader />
        <Box sx={{ flex: 1, p: 4 }}>{children}</Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
