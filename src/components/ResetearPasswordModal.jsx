import { useState } from "react";
import { toast } from "sonner";
import { resetearPasswordUsuario } from "../services/ticketService";

function ResetearPasswordModal({ isOpen, onClose, usuario }) {
  const [passwordNueva, setPasswordNueva] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !usuario) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetearPasswordUsuario(usuario.id, passwordNueva);
      toast.success(`Contraseña de ${usuario.nombre} restablecida.`);
      setPasswordNueva("");
      onClose();
    } catch (error) {
      const mensaje =
        error.response?.data || "No se pudo restablecer la contraseña.";
      toast.error(typeof mensaje === "string" ? mensaje : "Ocurrió un error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">
            Resetear Contraseña
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-400">
            Nueva contraseña temporal para{" "}
            <span className="text-slate-200 font-medium">
              {usuario.nombre}
            </span>{" "}
            ({usuario.correo}). No se le pide su contraseña actual.
          </p>

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
            <p className="text-xs text-slate-400 mt-1">Mínimo 8 caracteres.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Restablecer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetearPasswordModal;
