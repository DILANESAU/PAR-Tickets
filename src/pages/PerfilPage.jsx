import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { obtenerPerfil, cambiarPassword } from "../services/ticketService";
import Skeleton from "../components/Skeleton";

function PerfilPage() {
  const [perfil, setPerfil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [isGuardando, setIsGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      setIsLoading(true);
      try {
        const datos = await obtenerPerfil();
        setPerfil(datos);
      } catch (error) {
        toast.error("No se pudo cargar tu perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, []);

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (passwordNueva !== passwordConfirmar) {
      toast.error("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setIsGuardando(true);
    try {
      await cambiarPassword(passwordActual, passwordNueva);
      toast.success("Contraseña actualizada correctamente.");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    } catch (error) {
      const mensaje =
        error.response?.data || "No se pudo cambiar la contraseña.";
      toast.error(typeof mensaje === "string" ? mensaje : "Ocurrió un error.");
    } finally {
      setIsGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-2xl mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Configuración</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Tus datos de cuenta y opciones de seguridad.
          </p>
        </div>

        {/* --- DATOS DE LA CUENTA --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Mi cuenta</h2>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : !perfil ? (
            <p className="text-slate-400 text-sm">
              No se pudo cargar la información de tu cuenta.
            </p>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-xs text-slate-400">Nombre</dt>
                <dd className="text-sm text-slate-200 font-medium">
                  {perfil.nombre}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Correo</dt>
                <dd className="text-sm text-slate-200 font-medium">
                  {perfil.correo}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Rol</dt>
                <dd className="text-sm text-slate-200 font-medium">
                  {perfil.rol}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Sucursal</dt>
                <dd className="text-sm text-slate-200 font-medium">
                  {perfil.sucursal}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Empresa</dt>
                <dd className="text-sm text-slate-200 font-medium">
                  {perfil.empresa}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {/* --- CAMBIAR CONTRASEÑA --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-6">
          <h2 className="font-semibold text-white mb-1">
            Cambiar contraseña
          </h2>
          <p className="text-slate-400 text-xs mb-5">
            Usa al menos 8 caracteres.
          </p>

          <form onSubmit={handleCambiarPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Contraseña actual
              </label>
              <input
                type="password"
                required
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Contraseña nueva
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirmar contraseña nueva
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGuardando}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
            >
              {isGuardando ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PerfilPage;
