import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Profile } from "@pages/Profile";
import { Login } from "@pages/Login";
import { IssueHome } from "@pages/issues/Issues";
import { ErrorPage } from "@pages/error/ErrorPage";
import { RequireAuth } from "@components/RequireAuth";
import { AuthLayout, MainLayout } from "@layouts/MainLayout";
import { NotFoundPage } from "@pages/error/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
    errorElement: <ErrorPage />,
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
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
