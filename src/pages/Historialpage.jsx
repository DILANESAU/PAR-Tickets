import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { obtenerMisTickets } from "../services/ticketService";

function HistorialPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mis Tickets</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Historial de las solicitudes que tú has creado.
          </p>
        </div>

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
              <div className="p-10 text-center text-slate-500 text-sm">
                Todavía no has creado ningún ticket.
              </div>
            ) : (
              tickets.map((ticket) => (
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
      </main>
    </div>
  );
}

export default HistorialPage;
