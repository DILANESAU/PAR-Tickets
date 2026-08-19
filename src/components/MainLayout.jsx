import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cerrarSesion, esTecnico } from "../services/ticketService";
import { crearConexionTicketHub } from "../services/Signalservice";
import {
  notificacionesSoportadas,
  permisoNotificaciones,
  pedirPermisoNotificaciones,
  mostrarNotificacion,
} from "../services/Notificaciones";

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [permisoNotif, setPermisoNotif] = useState(permisoNotificaciones());

  // La conexión de fondo (más abajo) se abre una sola vez al montar, así
  // que su closure no ve cambios de ruta — se lee la ruta actual desde
  // esta ref en vez de la variable `location` directamente.
  const rutaActualRef = useRef(location.pathname);
  useEffect(() => {
    rutaActualRef.current = location.pathname;
  }, [location.pathname]);

  const handlePedirPermiso = async () => {
    const resultado = await pedirPermisoNotificaciones();
    setPermisoNotif(resultado);
    if (resultado === "granted") {
      toast.success("Notificaciones de escritorio activadas.");
    } else if (resultado === "denied") {
      toast.error(
        "Notificaciones bloqueadas. Actívalas desde los permisos del sitio en tu navegador.",
      );
    }
  };

  // Conexión "de fondo" para avisos, separada de la que abre
  // TicketDetailPage al ver un ticket específico — esta vive mientras haya
  // sesión, sin importar en qué página estés, para que te enteres de
  // tickets/mensajes nuevos aunque no tengas ese ticket abierto.
  useEffect(() => {
    const conexion = crearConexionTicketHub();

    conexion.on("RecibirNuevoTicket", (ticket) => {
      toast.info(`Nuevo ticket: ${ticket.asunto}`, {
        description: `TK-${ticket.id} · Prioridad ${ticket.prioridad}`,
      });
      mostrarNotificacion(
        "Nuevo ticket de soporte",
        { body: `TK-${ticket.id} · ${ticket.asunto}` },
        () => navigate(`/ticket/${ticket.id}`),
      );
    });

    conexion.on("NuevoMensajeNotificacion", (aviso) => {
      // Si ya estás viendo justo ese ticket, TicketDetailPage ya te muestra
      // el mensaje en el chat — un toast aparte solo sería ruido.
      if (rutaActualRef.current === `/ticket/${aviso.ticketId}`) return;

      toast.info(`Mensaje nuevo en TK-${aviso.ticketId}`, {
        description: `${aviso.remitente}: ${aviso.texto}`,
      });
      mostrarNotificacion(
        `${aviso.remitente} respondió`,
        { body: `TK-${aviso.ticketId} · ${aviso.asunto}` },
        () => navigate(`/ticket/${aviso.ticketId}`),
      );
    });

    conexion.start().catch(() => {
      console.error("No se pudo conectar el servicio de notificaciones.");
    });

    return () => {
      conexion.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Solo visibles para Técnico — el backend ya rechaza estas rutas con 403
  // para cualquier otro rol, esto es nada más para no mostrarle a un
  // Cliente un enlace que le va a dar error.
  const enlacesGestion = [
    { to: "/gestion/usuarios", icono: "👥", label: "Usuarios" },
    { to: "/gestion/telemetria", icono: "📈", label: "Telemetría" },
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

          {esTecnico() && (
            <>
              <p className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gestión
              </p>
              {enlacesGestion.map((enlace) => (
                <Link
                  key={enlace.to}
                  to={enlace.to}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive(enlace.to) ? "bg-blue-600/10 text-blue-400 font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                >
                  <span className="mr-3">{enlace.icono}</span> {enlace.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer del Sidebar (Perfil y Salir) */}
        <div className="p-4 border-t border-slate-800">
          {notificacionesSoportadas() && permisoNotif !== "granted" && (
            <button
              onClick={handlePedirPermiso}
              className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer mb-2"
            >
              <span className="mr-3">🔔</span> Activar notificaciones
            </button>
          )}
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
