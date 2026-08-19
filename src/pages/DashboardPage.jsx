import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import NuevoTicketModal from "../components/NuevoTicketModal";
import Skeleton from "../components/Skeleton";
import { PrioridadBadge, EstadoBadge } from "../components/Badges";
import {
  obtenerTickets,
  asignarTicket,
  esTecnico,
  obtenerUsuarioActual,
} from "../services/ticketService";
import { CATEGORIAS } from "../constants/catalogoIncidentes";

function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tomandoId, setTomandoId] = useState(null);

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

  const handleTomarTicket = async (ticketId) => {
    const { nombre } = obtenerUsuarioActual();
    setTomandoId(ticketId);
    try {
      await asignarTicket(ticketId, nombre);
      toast.success(`Te asignaste el ticket TK-${ticketId}.`);
      await cargarDatos();
    } catch (error) {
      toast.error("No se pudo tomar el ticket.");
    } finally {
      setTomandoId(null);
    }
  };

  const totalTickets = tickets.length;
  const abiertosOProceso = tickets.filter((t) => t.estado !== "Cerrado").length;
  const resueltos = tickets.filter((t) => t.estado === "Cerrado").length;

  // Cola de trabajo: solo le importa a un Técnico — tickets abiertos que
  // nadie ha tomado todavía, para poder asignárselos con un clic sin tener
  // que entrar al detalle de cada uno.
  const ticketsSinAsignar = tickets.filter(
    (t) => t.estado !== "Cerrado" && !t.asignadoA,
  );

  // Desglose dinámico: solo se calculan (y se muestran) las categorías que
  // realmente tienen al menos un ticket, ordenadas de la más frecuente a la menos.
  const metricasPorCategoria = CATEGORIAS.map((grupo) => {
    const deEstaCategoria = tickets.filter(
      (t) => t.categoria === grupo.categoria,
    );
    return {
      categoria: grupo.categoria,
      label: grupo.label,
      icono: grupo.icono,
      total: deEstaCategoria.length,
      abiertos: deEstaCategoria.filter((t) => t.estado !== "Cerrado").length,
      resueltos: deEstaCategoria.filter((t) => t.estado === "Cerrado").length,
    };
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const ticketsFiltrados = tickets.filter((ticket) => {
    if (filtroEstado === "Todos") return true;
    if (filtroEstado === "Pendientes") return ticket.estado !== "Cerrado";
    return ticket.estado === filtroEstado;
  });

  const pestañas = [
    { valor: "Todos", label: "Todos", total: totalTickets },
    { valor: "Pendientes", label: "Abiertos", total: abiertosOProceso },
    { valor: "Cerrado", label: "Cerrado", total: resueltos },
  ];

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

        {/* Columna principal (lista, lo más accionable) a la izquierda;
            métricas y desglose por categoría como panel secundario a la
            derecha en escritorio. En pantallas chicas se apilan con la
            lista primero, para no tener que bajar por toda la estadística
            antes de llegar a lo que realmente se viene a hacer aquí. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* --- COLUMNA PRINCIPAL: filtros + lista de tickets --- */}
          <div className="lg:col-span-2 space-y-6 lg:order-1">
            {/* COLA SIN ASIGNAR: solo Técnico — tickets abiertos que nadie ha
                tomado, con un botón para asignárselos sin entrar al detalle. */}
            {esTecnico() && !isLoading && ticketsSinAsignar.length > 0 && (
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-amber-900/40 flex items-center justify-between">
                  <h2 className="font-semibold text-amber-400 flex items-center gap-2">
                    <span aria-hidden="true">⏳</span> Sin asignar
                  </h2>
                  <span className="text-xs text-amber-400/80 font-medium">
                    {ticketsSinAsignar.length}{" "}
                    {ticketsSinAsignar.length === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
                <div className="divide-y divide-amber-900/30">
                  {ticketsSinAsignar.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <Link
                        to={`/ticket/${ticket.id}`}
                        className="min-w-0 hover:underline"
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
                          <span className="font-mono text-blue-400">
                            TK-{ticket.id}
                          </span>
                          <span>·</span>
                          <span>{ticket.empresa}</span>
                        </div>
                        <p className="text-sm text-white font-medium truncate">
                          {ticket.asunto}
                        </p>
                      </Link>
                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <PrioridadBadge prioridad={ticket.prioridad} />
                        <button
                          onClick={() => handleTomarTicket(ticket.id)}
                          disabled={tomandoId === ticket.id}
                          className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 disabled:opacity-50 font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs"
                        >
                          {tomandoId === ticket.id ? "Tomando..." : "Tomar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOTONERA DE PESTAÑAS (TABS), con conteo por estado */}
            <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-fit">
              {pestañas.map(({ valor, label, total }) => (
                <button
                  key={valor}
                  onClick={() => setFiltroEstado(valor)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    filtroEstado === valor
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {label}
                  {!isLoading && (
                    <span
                      className={`ml-1.5 ${filtroEstado === valor ? "text-blue-100" : "text-slate-500"}`}
                    >
                      ({total})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Lista de Tickets Filtrados */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800">
                <h2 className="font-semibold text-lg text-white">
                  Historial (
                  {filtroEstado === "Todos"
                    ? "Historial Completo"
                    : filtroEstado}
                  )
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
                  <div className="p-10 text-center text-slate-400 text-sm">
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
                          <span className="text-slate-400 text-xs">
                            {new Date(
                              ticket.fechaCreacion,
                            ).toLocaleDateString()}
                          </span>
                          {esTecnico() && (
                            <>
                              <span className="text-slate-700">·</span>
                              <span className="text-slate-400 text-xs">
                                {ticket.empresa}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-medium text-white text-base">
                          {ticket.asunto}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-4 self-end sm:self-auto">
                        <PrioridadBadge prioridad={ticket.prioridad} />
                        <EstadoBadge estado={ticket.estado} />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* --- PANEL SECUNDARIO: métricas + desglose por categoría --- */}
          <div className="space-y-4 lg:order-2">
            {/* Métricas: 3 en fila en pantallas medianas, apiladas en el
                panel angosto de escritorio */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <p className="text-slate-400 text-xs lg:text-sm font-medium">
                  Tickets Totales
                </p>
                <p className="text-2xl lg:text-3xl font-bold mt-2 text-white">
                  {totalTickets}
                </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <p className="text-amber-400 text-xs lg:text-sm font-medium">
                  Abiertos / En Proceso
                </p>
                <p className="text-2xl lg:text-3xl font-bold mt-2 text-white">
                  {abiertosOProceso}
                </p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <p className="text-emerald-400 text-xs lg:text-sm font-medium">
                  Resueltos
                </p>
                <p className="text-2xl lg:text-3xl font-bold mt-2 text-white">
                  {resueltos}
                </p>
              </div>
            </div>

            {/* Desglose por categoría: solo aparecen las que ya tienen tickets */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6">
              <h2 className="font-semibold text-white">
                Tickets por categoría
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 mb-5">
                Proporción de solicitudes abiertas y resueltas por tipo de
                incidente
              </p>

              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <Skeleton className="h-3.5 w-40" />
                        <Skeleton className="h-2 w-full rounded-full" />
                      </div>
                    ))}
                </div>
              ) : metricasPorCategoria.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">
                  Aún no hay tickets para desglosar por categoría.
                </p>
              ) : (
                <div className="space-y-4">
                  {metricasPorCategoria.map((cat) => {
                    const pctAbiertos =
                      cat.total > 0 ? (cat.abiertos / cat.total) * 100 : 0;
                    const pctResueltos =
                      cat.total > 0 ? (cat.resueltos / cat.total) * 100 : 0;

                    return (
                      <div key={cat.categoria}>
                        <div className="flex items-center justify-between mb-1.5 gap-3">
                          <span className="text-sm text-slate-300 flex items-center gap-2 shrink-0">
                            <span aria-hidden="true">{cat.icono}</span>
                            {cat.label}
                          </span>
                          <span className="text-xs text-slate-400 text-right">
                            <span className="text-slate-400 font-medium">
                              {cat.total}
                            </span>{" "}
                            total
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                          <div
                            className="h-full bg-amber-500/70"
                            style={{ width: `${pctAbiertos}%` }}
                            title={`${cat.abiertos} abiertos`}
                          />
                          <div
                            className="h-full bg-emerald-500/70"
                            style={{ width: `${pctResueltos}%` }}
                            title={`${cat.resueltos} resueltos`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
