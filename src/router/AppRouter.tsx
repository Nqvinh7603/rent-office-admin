import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    element: <Login />,
    path: "/login",
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
    ],
  },
]);
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
