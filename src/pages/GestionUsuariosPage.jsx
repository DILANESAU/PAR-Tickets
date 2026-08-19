import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Skeleton from "../components/Skeleton";
import NuevoUsuarioModal from "../components/NuevoUsuarioModal";
import NuevaSucursalModal from "../components/NuevaSucursalModal";
import {
  obtenerUsuarios,
  obtenerSucursales,
  asignarSucursal,
} from "../services/ticketService";

function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);

  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [modalSucursalAbierto, setModalSucursalAbierto] = useState(false);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [datosUsuarios, datosSucursales] = await Promise.all([
        obtenerUsuarios(),
        obtenerSucursales(),
      ]);
      setUsuarios(datosUsuarios);
      setSucursales(datosSucursales);
    } catch (error) {
      toast.error("No se pudo cargar la lista de usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCambioSucursal = async (usuarioId, sucursalId) => {
    if (!sucursalId) return;

    setGuardandoId(usuarioId);
    try {
      await asignarSucursal(usuarioId, Number(sucursalId));
      toast.success("Sucursal asignada correctamente.");
      await cargarDatos();
    } catch (error) {
      const mensaje =
        error.response?.data || "No se pudo asignar la sucursal.";
      toast.error(typeof mensaje === "string" ? mensaje : "Ocurrió un error.");
    } finally {
      setGuardandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-5xl mx-auto p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Usuarios registrados en tu empresa y su sucursal asignada.
            </p>
          </div>
          <div className="flex gap-3 self-start sm:self-auto">
            <button
              onClick={() => setModalSucursalAbierto(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
            >
              + Nueva Sucursal
            </button>
            <button
              onClick={() => setModalUsuarioAbierto(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm shadow-lg shadow-blue-900/20"
            >
              + Nuevo Usuario
            </button>
          </div>
        </div>

        {/* --- TABLA DE USUARIOS --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl mb-6">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
            </div>
          ) : usuarios.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">
              No hay usuarios registrados todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-400">
                    <th className="px-5 py-3 font-medium">Nombre</th>
                    <th className="px-5 py-3 font-medium">Correo</th>
                    <th className="px-5 py-3 font-medium">Rol</th>
                    <th className="px-5 py-3 font-medium">Sucursal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3 font-medium text-white">
                        {usuario.nombre}
                      </td>
                      <td className="px-5 py-3 text-slate-300">
                        {usuario.correo}
                      </td>
                      <td className="px-5 py-3 text-slate-300">
                        {usuario.rol}
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={usuario.sucursalId ?? ""}
                          disabled={guardandoId === usuario.id}
                          onChange={(e) =>
                            handleCambioSucursal(usuario.id, e.target.value)
                          }
                          className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                        >
                          <option value="" disabled>
                            {usuario.sucursal || "Sin asignar"}
                          </option>
                          {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                              {sucursal.nombre} (#{sucursal.numeroTienda})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- SUCURSALES DE LA EMPRESA --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6">
          <h2 className="font-semibold text-white mb-4">Sucursales</h2>

          {isLoading ? (
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, idx) => (
                  <Skeleton key={idx} className="h-5 w-full" />
                ))}
            </div>
          ) : sucursales.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              Todavía no hay sucursales dadas de alta.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sucursales.map((sucursal) => (
                <div
                  key={sucursal.id}
                  className="flex items-center justify-between text-sm bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5"
                >
                  <span className="text-slate-200 font-medium">
                    {sucursal.nombre}
                  </span>
                  <span className="text-slate-400 text-xs">
                    #{sucursal.numeroTienda}
                    {sucursal.seccion ? ` · ${sucursal.seccion}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <NuevoUsuarioModal
        isOpen={modalUsuarioAbierto}
        onClose={() => setModalUsuarioAbierto(false)}
        onUsuarioCreado={cargarDatos}
      />
      <NuevaSucursalModal
        isOpen={modalSucursalAbierto}
        onClose={() => setModalSucursalAbierto(false)}
        onSucursalCreada={cargarDatos}
      />
    </div>
  );
}

export default GestionUsuariosPage;
