import { useMemo, useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { Box } from "@mui/material";
import backgroundImage from "@assets/background.png";
import PrimaryHeader from "@components/Header";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import { useAuth } from "@context/UseAuth";

const DEFAULT_APP_TITLE = "Office Issue Tracker";

const BaseLayout: React.FC = () => {
  const matches = useMatches();
  const { isAuthenticated } = useAuth();
  const routeTitle = useMemo(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i] as { handle?: { pageTitle: string } };
      if (match.handle) return match.handle.pageTitle;
    }
  }, [matches]);

  const title = routeTitle
    ? `${routeTitle} | ${DEFAULT_APP_TITLE}`
    : DEFAULT_APP_TITLE;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      <Sidebar isAuthenticated={isAuthenticated} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {isAuthenticated && <PrimaryHeader />}
        {isAuthenticated && (
          <Box
            sx={{
              "&::before": {
                content: '""',
                position: "fixed",
                minHeight: "500px",
                inset: "min(20%, 200px) -100px 0 -50px",
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "40% 20%",
                backgroundSize: "contain",
                filter: "opacity(0.08) grayscale(80%) brightness(1)",
              },
            }}
          />
        )}
        <Box
          flex={1}
          px={{ xs: 1, sm: 2, md: 4 }}
          py={{ xs: 2, sm: 3, md: 4 }}
          position="relative"
          overflow="hidden"
          zIndex={1}
        >
          <Outlet />
        </Box>
        <Footer isAuthenticated={isAuthenticated} />
      </Box>
    </Box>
  );
};

export default BaseLayout;
