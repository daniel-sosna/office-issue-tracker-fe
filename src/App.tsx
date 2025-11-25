import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Home as Profile } from "@pages/Home";
import { Login } from "@pages/Login";
import { IssueHome } from "@pages/issues/Issues";
import { ErrorPage } from "@components/ErrorPage";
import { RequireAuth } from "@components/RequireAuth";
import { useAuth } from "@context/Use-auth";
import { Box, LinearProgress } from "@mui/material";
import MainLayout from "@layouts/MainLayout";

const NotFoundRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <ErrorPage />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/issues" replace />,
      },
      {
        path: "issues",
        element: <IssueHome />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "*",
        element: <NotFoundRoute />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
