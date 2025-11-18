import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "@pages/Home";
import { Login } from "@pages/Login";
import { IssueHome } from "@pages/issues/Issues";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/issues",
    element: <IssueHome />,
  },
]);

export const App = () => <RouterProvider router={router} />;
