import { createBrowserRouter } from "react-router";
import MainLayout from "../features/layout/MainLayout";
import Dashboard from "../features/Dashboard/Dashboard";
import Products from "../features/products/pages/Products";
import Movements from "../features/movements/pages/Movements";
import NotFound from "../features/layout/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },

      {
        path: "products",
        children: [
          { index: true, Component: Products },
        ],
      },

      {
        path: "movements",
        children: [
          { index: true, Component: Movements },
        ],
      },

      { path: "*", Component: NotFound },
    ],
  },
]);
