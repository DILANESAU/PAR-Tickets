import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { iniciarSesion } from "../services/ticketService";

function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Si el interceptor de axios nos mandó para acá por un token vencido,
  // aquí explicamos por qué en vez de solo aparecer en el login sin razón.
  useEffect(() => {
    const mensaje = sessionStorage.getItem("mensaje_sesion_expirada");
    if (mensaje) {
      toast.info(mensaje);
      sessionStorage.removeItem("mensaje_sesion_expirada");
    }
  }, []);

  // Si RutaProtegida nos mandó para acá porque no había token, aquí viene
  // guardada la página a la que el usuario quería entrar originalmente.
  const destino = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await iniciarSesion(correo, password);

      toast.success("Bienvenido al sistema");
      navigate(destino, { replace: true });
    } catch (error) {
      // El backend ya manda mensajes específicos (credenciales inválidas,
      // cuenta bloqueada temporalmente, etc.) — se los mostramos tal cual.
      const mensaje =
        error.response?.data || "No se pudo iniciar sesión. Intenta de nuevo.";
      toast.error(
        typeof mensaje === "string"
          ? mensaje
          : "Correo o contraseña incorrectos",
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Portal de Soporte
          </h1>
          <p className="text-slate-400">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="juan@tienda2801.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50 mt-4"
          >
            {isSubmitting ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
