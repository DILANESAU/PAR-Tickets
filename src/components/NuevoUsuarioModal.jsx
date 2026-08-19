import { useState } from "react";
import { toast } from "sonner";
import { registrarUsuario } from "../services/ticketService";

function NuevoUsuarioModal({ isOpen, onClose, onUsuarioCreado }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Cliente");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await registrarUsuario(nombre, correo, password, rol);
      toast.success("Usuario creado. Falta asignarle una sucursal.");

      setNombre("");
      setCorreo("");
      setPassword("");
      setRol("Cliente");

      if (onUsuarioCreado) onUsuarioCreado();
      onClose();
    } catch (error) {
      const mensaje = error.response?.data || "No se pudo crear el usuario.";
      toast.error(typeof mensaje === "string" ? mensaje : "Ocurrió un error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">Nuevo Usuario</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Correo
            </label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Contraseña temporal
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-400 mt-1">Mínimo 8 caracteres.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Cliente">Cliente</option>
              <option value="Tecnico">Técnico</option>
            </select>
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
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoUsuarioModal;
