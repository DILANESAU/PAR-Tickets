import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import LoginPage from "./pages/LoginPage"; // <-- Importa la nueva página

function App() {
  return (
    <Routes>
      {/* Ruta pública sin layout (sin menú lateral) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redireccionar la raíz al login temporalmente */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas protegidas (con el menú lateral) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ticket/:id" element={<TicketDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
