import { useMemo, useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { Box } from "@mui/material";
import PrimaryHeader from "@components/Header";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";

const DEFAULT_APP_TITLE = "Office Issue Tracker";

interface BaseLayoutProps {
  variant: "authenticated" | "unauthenticated";
}

const BaseLayout = ({ variant }: BaseLayoutProps) => {
  const showHeader = variant === "authenticated";

  const matches = useMatches();
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
