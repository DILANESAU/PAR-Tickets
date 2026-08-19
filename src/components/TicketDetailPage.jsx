import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  obtenerTicketPorId,
  cerrarTicketApi,
  obtenerMensajes,
  enviarMensaje,
} from "../services/ticketService";
import { crearConexionTicketHub } from "../services/Signalservice";
import { toast } from "sonner";
import { catalogoIncidentes } from "../constants/catalogoIncidentes";

function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModifying, setIsModifying] = useState(false);

  const [mensajes, setMensajes] = useState([]);
  const [textoMensaje, setTextoMensaje] = useState("");
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const conexionRef = useRef(null);

  useEffect(() => {
    const cargarTicket = async () => {
      try {
        const datos = await obtenerTicketPorId(id);
        setTicket(datos);
      } catch (error) {
        toast.error("No se pudo cargar el ticket.");
      } finally {
        setIsLoading(false);
      }
    };
    cargarTicket();
  }, [id]);

  // El backend guarda DatosAdicionales como JSON crudo; lo parseamos y le
  // ponemos las etiquetas legibles del catálogo (en vez de las keys internas).
  const datosAdicionales = React.useMemo(() => {
    if (!ticket?.datosAdicionales) return null;

    let datos;
    try {
      datos = JSON.parse(ticket.datosAdicionales);
    } catch {
      return null;
    }

    const incidente = catalogoIncidentes.find(
      (i) => i.asunto === ticket.asunto,
    );

    return Object.entries(datos)
      .filter(([, valor]) => valor)
      .map(([key, valor]) => ({
        label: incidente?.campos?.find((c) => c.key === key)?.label || key,
        valor,
      }));
  }, [ticket]);

  // Historial de mensajes + conexión en vivo por SignalR. Se reconecta si
  // cambia el id del ticket (ej. navegaste de un ticket a otro).
  useEffect(() => {
    let activo = true;

    const cargarMensajes = async () => {
      try {
        const datos = await obtenerMensajes(id);
        if (activo) setMensajes(datos);
      } catch (error) {
        toast.error("No se pudieron cargar los mensajes.");
      }
    };
    cargarMensajes();

    const conexion = crearConexionTicketHub();
    conexionRef.current = conexion;

    conexion.on("NuevoMensaje", (mensaje) => {
      // Evita duplicar el mensaje que uno mismo acaba de enviar
      // (ya se agregó "optimistamente" al enviarlo).
      setMensajes((prev) =>
        prev.some((m) => m.id === mensaje.id) ? prev : [...prev, mensaje],
      );
    });

    conexion
      .start()
      .then(() => conexion.invoke("UnirseATicket", Number(id)))
      .catch(() => {
        // Si falla la conexión en vivo, el chat sigue funcionando por
        // petición normal (POST), solo no se actualiza en tiempo real.
        console.error("No se pudo conectar al chat en vivo.");
      });

    return () => {
      activo = false;
      if (conexion.state === "Connected") {
        conexion.invoke("SalirDeTicket", Number(id)).catch(() => {});
      }
      conexion.stop();
    };
  }, [id]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    const texto = textoMensaje.trim();
    if (!texto) return;

    setEnviandoMensaje(true);
    try {
      const mensajeCreado = await enviarMensaje(id, texto);
      setMensajes((prev) => [...prev, mensajeCreado]);
      setTextoMensaje("");
    } catch (error) {
      toast.error("No se pudo enviar el mensaje.");
    } finally {
      setEnviandoMensaje(false);
    }
  };

  const handleCerrarTicket = async () => {
    setIsModifying(true);
    try {
      const respuesta = await cerrarTicketApi(id);
      setTicket({ ...ticket, estado: respuesta.estado });
      toast.error("El ticket ha sido cerrado");
    } catch (error) {
      toast.error("No se pudo cerrar el ticket. Intenta de nuevo.");
    } finally {
      setIsModifying(false);
    }
  };

  // --- 1. SKELETON DE CARGA FLUIDO ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-8 flex justify-center">
        <div className="max-w-4xl w-full space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-800/50 rounded-md mb-8"></div>
          <div className="h-32 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          <div className="h-48 bg-slate-900 border border-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p className="text-xl mb-4">Ticket no encontrado.</p>
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            Volver al Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Volver al Panel
        </Link>

        {/* --- 2. CABECERA DEL TICKET --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-6 flex flex-col sm:flex-row justify-between sm:items-start gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-sm font-mono font-medium text-blue-400 bg-blue-950/50 border border-blue-900/50 px-3 py-1 rounded-md">
                TK-{ticket.id}
              </span>

              {/* Insignia de Estado */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                  ticket.estado === "Cerrado"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {ticket.estado}
              </span>

              {/* Insignia de Prioridad */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium border ${
                  ticket.prioridad === "Alta" || ticket.prioridad === "Critica"
                    ? "bg-red-950/40 text-red-400 border-red-900/50"
                    : ticket.prioridad === "Media"
                      ? "bg-orange-950/40 text-orange-400 border-orange-900/50"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                Prioridad {ticket.prioridad}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
              {ticket.asunto}
            </h1>
            <p className="text-sm text-slate-500">
              Reportado el {new Date(ticket.fechaCreacion).toLocaleDateString()}{" "}
              a las{" "}
              {new Date(ticket.fechaCreacion).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* BOTÓN CERRAR */}
          {ticket.estado !== "Cerrado" && (
            <button
              onClick={handleCerrarTicket}
              disabled={isModifying}
              className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-red-600 disabled:opacity-50 font-medium px-5 py-2.5 rounded-xl transition-all cursor-pointer text-sm self-start sm:self-auto flex items-center gap-2"
            >
              {isModifying ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cerrar Ticket
                </>
              )}
            </button>
          )}
        </div>

        {/* --- 3. CUERPO DEL TICKET --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
            Descripción del Problema
          </h3>
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
            {ticket.descripcion}
          </p>
        </div>

        {/* --- 3.5. DATOS ESTRUCTURADOS DEL INCIDENTE (si el tipo los pide) --- */}
        {datosAdicionales && datosAdicionales.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
              Datos de la solicitud
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {datosAdicionales.map(({ label, valor }) => (
                <div key={label}>
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="text-sm text-slate-200 font-medium">
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* --- 4. SECCIÓN DE MENSAJES --- */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Actualizaciones
          </h3>

          <div className="space-y-4">
            {mensajes.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">
                Aún no hay mensajes en este ticket.
              </p>
            )}

            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-900/30 border border-blue-800/50 flex items-center justify-center shrink-0">
                  <span className="text-blue-400 text-sm font-bold">
                    {mensaje.remitente?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-200">
                      {mensaje.remitente}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(mensaje.fechaEnvio).toLocaleString([], {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap">
                    {mensaje.texto}
                  </p>
                </div>
              </div>
            ))}

            {/* Input para responder (Deshabilitado si está cerrado) */}
            {ticket.estado !== "Cerrado" ? (
              <form onSubmit={handleEnviarMensaje} className="mt-6 flex gap-3">
                <input
                  type="text"
                  value={textoMensaje}
                  onChange={(e) => setTextoMensaje(e.target.value)}
                  maxLength={2000}
                  placeholder="Escribe un mensaje al técnico..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={enviandoMensaje || !textoMensaje.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                  {enviandoMensaje ? "Enviando..." : "Enviar"}
                </button>
              </form>
            ) : (
              <div className="mt-6 text-center p-4 bg-slate-900/30 border border-slate-800/30 rounded-xl">
                <p className="text-slate-500 text-sm">
                  Este ticket está cerrado. Ya no se pueden enviar mensajes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;
