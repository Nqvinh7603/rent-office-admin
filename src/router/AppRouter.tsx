import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import ConsignmentDetail from "../features/consignment/ConsignmentDetail";
import AdminLayout from "../layout/AdminLayout";
import BuildingLevels from "../pages/BuildingLevels";
import BuildingTypes from "../pages/BuildingTypes";
import Consignments from "../pages/Consignments";
import ErrorPage from "../pages/ErrorPage";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Notifications from "../pages/Notifcations";
import Permissions from "../pages/Permissions";
import Profiles from "../pages/Profiles";
import ResetPassword from "../pages/ResetPassword";
import Roles from "../pages/Roles";
import Users from "../pages/Users";

const router = createBrowserRouter([
  {
    element: <Login />,
    path: "/login",
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      {
        path: "/users",
        children: [
          {
            path: "",
            index: true,
            element: <Users />,
          },
          {
            path: ":id",
            element: <Profiles />,
          },
        ],
      },

      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/permissions",
        element: <Permissions />,
      },

      {
        path: "/building-types",
        element: <BuildingTypes />,
      },

      {
        path: "/building-levels",
        element: <BuildingLevels />,
      },
      {
        path: "/consignments",
        children: [
          {
            path: "",
            index: true,
            element: <Consignments />,
          },
          { path: ":id", element: <ConsignmentDetail /> },
        ],
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
