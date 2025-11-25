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
import { useAuth } from "@context/use-auth";

const NotFoundRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading ... </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  throw new Error("Not Found");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/issues" replace />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/issues",
    element: (
      <RequireAuth>
        <IssueHome />
      </RequireAuth>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <NotFoundRoute />,
    errorElement: <ErrorPage />,
  },
]);

export const App = () => <RouterProvider router={router} />;
