import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Profile } from "@pages/profile/Profile";
import { Login } from "@pages/Login";
import { IssueHome } from "@pages/issues/Issues";
import { ErrorPage } from "@pages/error/ErrorPage";
import { NotFoundPage } from "@pages/error/NotFoundPage";
import { RequireAuth } from "@components/RequireAuth";
import BaseLayout from "@layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <BaseLayout variant="unauthenticated" />,
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
        element: <BaseLayout variant="authenticated" />,
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
