import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import TicketDetailPage from "./components/TicketDetailPage";
import LoginPage from "./pages/LoginPage"; // <-- Importa la nueva página
import RutaProtegida from "./components/RutaProtegida";
import HistorialPage from "./pages/HistorialPage";
import WikiPage from "./pages/WikiPage";
import PerfilPage from "./pages/PerfilPage";

function App() {
  return (
    <>
      {/* A nivel de toda la app, no solo dentro de MainLayout — así los toasts
          también se ven en /login (ej. "correo o contraseña incorrectos"). */}
      <Toaster theme="dark" position="bottom-right" richColors />

      <Routes>
        {/* Ruta pública sin layout (sin menú lateral) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redireccionar la raíz al login temporalmente */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas protegidas: sin token válido, RutaProtegida manda a /login */}
        <Route element={<RutaProtegida />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ticket/:id" element={<TicketDetailPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/wiki" element={<WikiPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
