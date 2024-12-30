import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  //   {
  //     element: <Login />,
  //     path: "/login",
  //   },
  //   {
  //     element: (
  //       <ProtectedRoute>
  //         <AdminLayout />
  //       </ProtectedRoute>
  //     ),
  //     errorElement: <ErrorIndicator />,
  //   },
]);
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
