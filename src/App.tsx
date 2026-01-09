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
import { TermsOfService } from "@pages/legal/TermsOfService";
import { PrivacyPolicy } from "@pages/legal/PrivacyPolicy";
import { Support } from "@pages/support/Support";
import { RequireAuth } from "@components/RequireAuth";
import BaseLayout from "@layouts/MainLayout";

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <Login />,
        handle: { pageTitle: "Login" },
      },
      {
        path: "/terms",
        element: <TermsOfService />,
        handle: { pageTitle: "Terms of Service" },
      },
      {
        path: "/support",
        element: <Support />,
        handle: { pageTitle: "Support" },
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
        handle: { pageTitle: "Privacy Policy" },
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <BaseLayout />,
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
            handle: { pageTitle: "Profile" },
          },
          {
            path: "*",
            element: <NotFoundPage />,
            handle: { pageTitle: "Not Found" },
          },
        ],
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
