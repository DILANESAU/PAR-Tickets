import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { PrioridadBadge, EstadoBadge } from "../components/Badges";
import { obtenerMisTickets } from "../services/ticketService";

function HistorialPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setIsLoading(true);
      try {
        const datos = await obtenerMisTickets();
        setTickets(datos);
      } catch (error) {
        console.error("No se pudo cargar tu historial de tickets.");
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, []);

  const texto = busqueda.trim().toLowerCase();
  const ticketsFiltrados = texto
    ? tickets.filter(
        (t) =>
          t.asunto?.toLowerCase().includes(texto) ||
          `tk-${t.id}`.includes(texto),
      )
    : tickets;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mis Tickets</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Historial de las solicitudes que tú has creado.
          </p>
        </div>

        {!isLoading && tickets.length > 0 && (
          <div className="relative mb-4">
            <span
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
            >
              🔍
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por asunto o folio (TK-123)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
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
            ) : tickets.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                Todavía no has creado ningún ticket.
              </div>
            ) : ticketsFiltrados.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                Ningún ticket coincide con "{busqueda}".
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
                        {new Date(ticket.fechaCreacion).toLocaleDateString()}
                      </span>
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
      </main>
    </div>
  );
}

export default HistorialPage;
