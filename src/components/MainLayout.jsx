import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cerrarSesion } from "../services/ticketService";

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleCerrarSesion = () => {
    cerrarSesion(); // borra token_soporte y usuario_nombre de localStorage
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Logo / Título */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mr-3">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">Soporte IT</span>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive("/dashboard") ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <span className="mr-3">📊</span> Panel Principal
          </Link>

          <Link
            to="/historial"
            className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive("/historial") ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <span className="mr-3">📋</span> Mis Tickets
          </Link>

          <Link
            to="/wiki"
            className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive("/wiki") ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <span className="mr-3">📚</span> Base de Conocimientos
          </Link>
        </nav>

        {/* Footer del Sidebar (Perfil y Salir) */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer mb-2">
            <span className="mr-3">⚙️</span> Configuración
          </button>
          <button
            onClick={handleCerrarSesion}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <span className="mr-3">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Dinámico (Aquí se inyectan las páginas) */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
