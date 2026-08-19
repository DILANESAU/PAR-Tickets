import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Skeleton from "../components/Skeleton";
import { obtenerMetricas, obtenerAuditoria } from "../services/ticketService";

// Convierte minutos a un formato legible ("2h 15min" / "45min"), o "—" si
// todavía no hay datos suficientes para calcular el promedio.
function formatearMinutos(minutos) {
  if (minutos == null) return "—";
  if (minutos < 60) return `${Math.round(minutos)} min`;
  const horas = Math.floor(minutos / 60);
  const resto = Math.round(minutos % 60);
  return resto > 0 ? `${horas}h ${resto}min` : `${horas}h`;
}

function TelemetriaPage() {
  const [metricas, setMetricas] = useState(null);
  const [auditoria, setAuditoria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setIsLoading(true);
      try {
        const [datosMetricas, datosAuditoria] = await Promise.all([
          obtenerMetricas(),
          obtenerAuditoria(50),
        ]);
        setMetricas(datosMetricas);
        setAuditoria(datosAuditoria);
      } catch (error) {
        toast.error("No se pudo cargar la telemetría.");
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
          <h1 className="text-3xl font-bold text-white">Telemetría</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Desempeño de soporte y bitácora de actividad de tu empresa.
          </p>
        </div>

        {/* --- MÉTRICAS GENERALES --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <p className="text-slate-400 text-sm font-medium">
              Tiempo promedio de asignación
            </p>
            <p className="text-2xl font-bold mt-2 text-white">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                formatearMinutos(metricas?.tiempoPromedioAsignacionMinutos)
              )}
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <p className="text-slate-400 text-sm font-medium">
              Tiempo promedio de resolución
            </p>
            <p className="text-2xl font-bold mt-2 text-white">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                formatearMinutos(metricas?.tiempoPromedioResolucionMinutos)
              )}
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
            <p className="text-slate-400 text-sm font-medium">
              Tickets totales
            </p>
            <p className="text-2xl font-bold mt-2 text-white">
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                (metricas?.totalTickets ?? 0)
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* --- TICKETS POR TÉCNICO --- */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6">
            <h2 className="font-semibold text-white mb-4">
              Tickets por técnico
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-5 w-full" />
                  ))}
              </div>
            ) : !metricas?.ticketsPorTecnico?.length ? (
              <p className="text-slate-400 text-sm text-center py-4">
                Todavía no hay tickets asignados a un técnico.
              </p>
            ) : (
              <div className="space-y-3">
                {metricas.ticketsPorTecnico.map((t) => (
                  <div
                    key={t.tecnico}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-200">{t.tecnico}</span>
                    <span className="text-slate-400">
                      {t.total} total ·{" "}
                      <span className="text-amber-400">
                        {t.abiertos} abiertos
                      </span>{" "}
                      ·{" "}
                      <span className="text-emerald-400">
                        {t.resueltos} resueltos
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- INCIDENTES MÁS FRECUENTES --- */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6">
            <h2 className="font-semibold text-white mb-4">
              Incidentes más frecuentes
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <Skeleton key={idx} className="h-5 w-full" />
                  ))}
              </div>
            ) : !metricas?.incidentesFrecuentes?.length ? (
              <p className="text-slate-400 text-sm text-center py-4">
                Aún no hay suficientes tickets para este desglose.
              </p>
            ) : (
              <div className="space-y-3">
                {metricas.incidentesFrecuentes.map((i) => (
                  <div
                    key={i.asunto}
                    className="flex items-center justify-between text-sm gap-3"
                  >
                    <span className="text-slate-200 truncate">
                      {i.asunto}
                    </span>
                    <span className="text-slate-400 shrink-0">
                      {i.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- BITÁCORA DE AUDITORÍA --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h2 className="font-semibold text-lg text-white">
              Bitácora de auditoría
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-5 w-full" />
                ))}
            </div>
          ) : auditoria.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">
              Sin actividad registrada todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Usuario</th>
                    <th className="px-5 py-3 font-medium">Acción</th>
                    <th className="px-5 py-3 font-medium">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {auditoria.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.fecha).toLocaleString([], {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3 text-slate-200">
                        {log.usuario}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-blue-950/50 text-blue-400 border border-blue-900/50 font-mono">
                          {log.accion}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">
                        {log.detalles}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TelemetriaPage;
