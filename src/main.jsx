import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TicketDetailPage from "./components/TicketDetailPage";
import MainLayout from "./components/MainLayout";

const Dashboard = () => (
  <div className="p-10 text-2xl text-slate-800">
    Dashboard del Cliente (Demo)
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, // El login va solo, sin menú
  },
  {
    // Creamos una ruta padre para el Layout
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />, // Se inyecta en el <Outlet />
      },
      {
        path: "/ticket/:id",
        element: <TicketDetailPage />, // Se inyecta en el <Outlet />
      },
      // Aquí agregarías después /historial, /wiki, etc.
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
