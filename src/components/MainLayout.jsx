import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cerrarSesion } from "../services/ticketService";

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // El sidebar es fijo en escritorio, pero en pantallas chicas (celular) se
  // abre como panel deslizante — antes ocupaba 256px sin forma de ocultarlo,
  // dejando la app inutilizable en móvil.
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Si cambia de página (ej. tocó un link), cierra el panel móvil solo. Se
  // ajusta durante el render (no en un efecto) para no disparar un segundo
  // ciclo de render tras la navegación.
  const [rutaPrevia, setRutaPrevia] = useState(location.pathname);
  if (location.pathname !== rutaPrevia) {
    setRutaPrevia(location.pathname);
    setMenuAbierto(false);
  }

  const isActive = (path) => location.pathname === path;

  const handleCerrarSesion = () => {
    cerrarSesion(); // borra token_soporte y usuario_nombre de localStorage
    navigate("/login", { replace: true });
  };

  const enlaces = [
    { to: "/dashboard", icono: "📊", label: "Panel Principal" },
    { to: "/historial", icono: "📋", label: "Mis Tickets" },
    { to: "/wiki", icono: "📚", label: "Base de Conocimientos" },
  ];

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* Fondo oscuro clickeable para cerrar el sidebar en móvil */}
      {menuAbierto && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
          aria-hidden="true"
        />
      )}

      {/* Barra Lateral (Sidebar): fija en md+, panel deslizante en móvil */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 ease-out
          ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo / Título */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white mr-3">
            S
          </div>
          <span className="font-bold text-lg tracking-tight">Soporte IT</span>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.to}
              to={enlace.to}
              className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive(enlace.to) ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <span className="mr-3">{enlace.icono}</span> {enlace.label}
            </Link>
          ))}
        </nav>

        {/* Footer del Sidebar (Perfil y Salir) */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/perfil"
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors mb-2 ${isActive("/perfil") ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <span className="mr-3">⚙️</span> Configuración
          </Link>
          <button
            onClick={handleCerrarSesion}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <span className="mr-3">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Columna derecha: barra superior móvil + contenido */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior, solo visible en móvil, con botón para abrir el menú */}
        <div className="md:hidden h-14 flex items-center px-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            className="p-2 -ml-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
          >
            <span className="text-xl leading-none">☰</span>
          </button>
          <span className="ml-2 font-bold tracking-tight">Soporte IT</span>
        </div>

        {/* Contenido Dinámico (Aquí se inyectan las páginas) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
