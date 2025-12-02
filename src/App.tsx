import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Profile } from "@pages/Profile";
import { Login } from "@pages/Login";
import { IssueHome } from "@pages/issues/Issues";
import { ErrorPage } from "@pages/error/ErrorPage";
import { AuthLayout, MainLayout } from "@layouts/MainLayout";
import { NotFoundPage } from "@pages/error/NotFoundPage";
import { RequireAuth } from "@components/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
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
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
