import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NuevoTicketModal from "../components/NuevoTicketModal";
import Skeleton from "../components/Skeleton";
import { obtenerTickets } from "../services/ticketService";

function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const datosReales = await obtenerTickets();
      setTickets(datosReales);
    } catch (error) {
      console.error("No se pudo conectar con el servidor de soporte.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const totalTickets = tickets.length;
  const abiertosOProceso = tickets.filter((t) => t.estado !== "Cerrado").length;
  const resueltos = tickets.filter((t) => t.estado === "Cerrado").length;

  const ticketsFiltrados = tickets.filter((ticket) => {
    if (filtroEstado === "Todos") return true;
    if (filtroEstado === "Pendientes") return ticket.estado !== "Cerrado";
    return ticket.estado === filtroEstado;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Contenido Principal */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        {/* Encabezado y Acción Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Panel de Tickets</h1>
            <p className="text-slate-400 mt-1 text-sm">
              Gestiona y revisa el estado de tus solicitudes de soporte técnico.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20 cursor-pointer flex items-center space-x-2 self-start sm:self-auto"
          >
            <span>+</span>
            <span>Nuevo Ticket</span>
          </button>
        </div>

        {/* Grid de Métricas Dinámicas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <p className="text-slate-400 text-sm font-medium">
              Tickets Totales
            </p>
            <p className="text-3xl font-bold mt-2 text-white">{totalTickets}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <p className="text-amber-400 text-sm font-medium">
              Abiertos / En Proceso
            </p>
            <p className="text-3xl font-bold mt-2 text-white">
              {abiertosOProceso}
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <p className="text-emerald-400 text-sm font-medium">Resueltos</p>
            <p className="text-3xl font-bold mt-2 text-white">{resueltos}</p>
          </div>
        </div>

        {/* BOTONERA DE PESTAÑAS (TABS) */}
        <div className="flex space-x-2 mb-6 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 inline-flex">
          {["Todos", "Pendientes", "Cerrado"].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                filtroEstado === estado
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {estado === "Pendientes" ? "Abiertos" : estado}
            </button>
          ))}
        </div>

        {/* Lista de Tickets Filtrados */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h2 className="font-semibold text-lg text-white">
              Historial (
              {filtroEstado === "Todos" ? "Historial Completo" : filtroEstado})
            </h2>
          </div>

          <div className="divide-y divide-slate-800">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="p-5 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-3 w-full max-w-md">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                ))
            ) : ticketsFiltrados.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">
                No hay tickets para mostrar en esta categoría.
              </div>
            ) : (
              ticketsFiltrados.map((ticket) => (
                <Link
                  to={`/ticket/${ticket.id}`}
                  key={ticket.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors block cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-blue-400 font-medium bg-blue-950 border border-blue-900 px-2 py-0.5 rounded">
                        TK-{ticket.id}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {new Date(ticket.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium text-white text-base">
                      {ticket.asunto}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                        ticket.prioridad === "Alta" ||
                        ticket.prioridad === "Critica"
                          ? "bg-red-950/40 text-red-400 border-red-900/50"
                          : ticket.prioridad === "Media"
                            ? "bg-amber-950/40 text-amber-400 border-amber-900/50"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {ticket.prioridad}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        ticket.estado === "Cerrado"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {ticket.estado}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <NuevoTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTicketCreado={cargarDatos}
        />
      </main>
    </div>
  );
}

export default DashboardPage;
