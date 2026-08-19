import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { esTecnico } from "../services/ticketService";

// Va anidada dentro de RutaProtegida (así que ya sabemos que hay sesión) —
// aquí solo se filtra por rol. Las pantallas de Gestión llaman al backend
// con [Authorize(Roles = "Tecnico")], así que esto es nada más para que un
// Cliente no vea el enlace ni caiga en una pantalla que le va a dar 403.
function RutaTecnico() {
  if (!esTecnico()) {
    toast.error("Esa sección es solo para técnicos.");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RutaTecnico;
