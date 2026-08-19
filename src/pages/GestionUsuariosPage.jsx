import { useEffect, useState } from "react";
import { toast } from "sonner";
import Skeleton from "../components/Skeleton";
import NuevoUsuarioModal from "../components/NuevoUsuarioModal";
import NuevaSucursalModal from "../components/NuevaSucursalModal";
import EditarSucursalModal from "../components/EditarSucursalModal";
import EditarUsuarioModal from "../components/EditarUsuarioModal";
import ResetearPasswordModal from "../components/ResetearPasswordModal";
import {
  obtenerUsuarios,
  obtenerSucursales,
  obtenerEmpresas,
  asignarSucursal,
  cambiarEstadoSucursal,
  cambiarEstadoUsuario,
} from "../services/ticketService";

function EstadoBadge({ activo }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
        activo
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-slate-800 text-slate-400 border-slate-700"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);

  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [modalSucursalAbierto, setModalSucursalAbierto] = useState(false);
  const [sucursalEditando, setSucursalEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioReseteando, setUsuarioReseteando] = useState(null);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [datosUsuarios, datosSucursales, datosEmpresas] =
        await Promise.all([
          obtenerUsuarios(),
          obtenerSucursales(true), // incluye inactivas, para poder reactivarlas
          obtenerEmpresas(),
        ]);
      setUsuarios(datosUsuarios);
      setSucursales(datosSucursales);
      setEmpresas(datosEmpresas);
    } catch (error) {
      toast.error("No se pudo cargar la información de gestión.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // El selector de "asignar sucursal" muestra TODAS (activas e inactivas)
  // — si solo mostrara las activas, y a alguien ya lo tenían asignado a una
  // que después se dio de baja, el <select> quedaría con un value sin
  // ninguna <option> que lo respalde. Las inactivas se marcan en el texto.
  const sucursalesPorEmpresa = empresas
    .map((empresa) => ({
      empresa,
      sucursales: sucursales.filter((s) => s.empresaId === empresa.id),
    }))
    .filter((grupo) => grupo.sucursales.length > 0);

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

  const handleToggleUsuario = async (usuario) => {
    try {
      await cambiarEstadoUsuario(usuario.id, !usuario.activo);
      toast.success(
        usuario.activo
          ? `${usuario.nombre} dado de baja.`
          : `${usuario.nombre} reactivado.`,
      );
      await cargarDatos();
    } catch (error) {
      toast.error("No se pudo cambiar el estado del usuario.");
    }
  };

  const handleToggleSucursal = async (sucursal) => {
    try {
      await cambiarEstadoSucursal(sucursal.id, !sucursal.activa);
      toast.success(
        sucursal.activa
          ? `${sucursal.nombre} dada de baja.`
          : `${sucursal.nombre} reactivada.`,
      );
      await cargarDatos();
    } catch (error) {
      toast.error("No se pudo cambiar el estado de la sucursal.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Usuarios y sucursales de las empresas del grupo.
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
                    <th className="px-5 py-3 font-medium">Estado</th>
                    <th className="px-5 py-3 font-medium text-right">
                      Acciones
                    </th>
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
                          {sucursalesPorEmpresa.map(
                            ({ empresa, sucursales: delGrupo }) => (
                              <optgroup
                                key={empresa.id}
                                label={empresa.razonSocial}
                              >
                                {delGrupo.map((sucursal) => (
                                  <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre} (#{sucursal.numeroTienda}
                                    ){!sucursal.activa ? " — inactiva" : ""}
                                  </option>
                                ))}
                              </optgroup>
                            ),
                          )}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <EstadoBadge activo={usuario.activo} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2 text-xs">
                          <button
                            onClick={() => setUsuarioEditando(usuario)}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
                          >
                            Editar
                          </button>
                          <span className="text-slate-700">·</span>
                          <button
                            onClick={() => setUsuarioReseteando(usuario)}
                            className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
                          >
                            Resetear clave
                          </button>
                          <span className="text-slate-700">·</span>
                          <button
                            onClick={() => handleToggleUsuario(usuario)}
                            className={`cursor-pointer font-medium ${usuario.activo ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}
                          >
                            {usuario.activo ? "Dar de baja" : "Reactivar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- SUCURSALES DE LAS EMPRESAS --- */}
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
                  className={`flex items-center justify-between text-sm bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-2.5 ${!sucursal.activa ? "opacity-60" : ""}`}
                >
                  <div>
                    <span className="text-slate-200 font-medium">
                      {sucursal.nombre}
                    </span>
                    <span className="text-slate-400 text-xs block">
                      {sucursal.empresa} · #{sucursal.numeroTienda}
                      {sucursal.seccion ? ` · ${sucursal.seccion}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <EstadoBadge activo={sucursal.activa} />
                    <button
                      onClick={() => setSucursalEditando(sucursal)}
                      className="text-blue-400 hover:text-blue-300 cursor-pointer text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleSucursal(sucursal)}
                      className={`cursor-pointer text-xs font-medium ${sucursal.activa ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}
                    >
                      {sucursal.activa ? "Baja" : "Reactivar"}
                    </button>
                  </div>
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
        empresas={empresas}
      />
      <EditarSucursalModal
        isOpen={sucursalEditando != null}
        onClose={() => setSucursalEditando(null)}
        onSucursalEditada={cargarDatos}
        sucursal={sucursalEditando}
        empresas={empresas}
      />
      <EditarUsuarioModal
        isOpen={usuarioEditando != null}
        onClose={() => setUsuarioEditando(null)}
        onUsuarioEditado={cargarDatos}
        usuario={usuarioEditando}
      />
      <ResetearPasswordModal
        isOpen={usuarioReseteando != null}
        onClose={() => setUsuarioReseteando(null)}
        usuario={usuarioReseteando}
      />
    </div>
  );
}

export default GestionUsuariosPage;
