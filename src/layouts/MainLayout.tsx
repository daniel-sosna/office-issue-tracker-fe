import { Box } from "@mui/material";
import PrimaryHeader from "@components/Header";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
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
        <Box sx={{ flex: 1, p: 4 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
