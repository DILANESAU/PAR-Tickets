// src/services/ticketService.js
import axios from "axios";

// VITE_API_URL se define en .env (desarrollo) o .env.production (build real).
// Si no está definida, cae en localhost para no romper el arranque en dev.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5250/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token_soporte");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Si el backend responde 401, el token ya no sirve (expiró, o el usuario fue
// deshabilitado). Excepción: el propio POST /auth/login también puede devolver
// 401 cuando la contraseña es incorrecta, y eso NO es una sesión expirada
// — ese caso lo maneja LoginPage mostrando el mensaje, no aquí.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esPeticionDeLogin = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !esPeticionDeLogin) {
      localStorage.removeItem("token_soporte");
      localStorage.removeItem("usuario_nombre");

      if (window.location.pathname !== "/login") {
        // LoginPage lo lee al montar, para explicarle al usuario por qué
        // terminó aquí en vez de simplemente aparecer sin dar razón.
        sessionStorage.setItem(
          "mensaje_sesion_expirada",
          "Tu sesión expiró. Inicia sesión de nuevo.",
        );
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// --- FUNCIONES DE AUTENTICACIÓN ---
export const iniciarSesion = async (correo, password) => {
  try {
    const respuesta = await api.post("/auth/login", { correo, password });
    if (respuesta.data.token) {
      localStorage.setItem("token_soporte", respuesta.data.token);
      localStorage.setItem("usuario_nombre", respuesta.data.usuario.nombre);
      localStorage.setItem("usuario_rol", respuesta.data.usuario.rol);
    }
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem("token_soporte");
  localStorage.removeItem("usuario_nombre");
  localStorage.removeItem("usuario_rol");
};

// El sidebar y las rutas de gestión lo usan para decidir qué mostrarle a
// un Técnico vs. un Cliente, sin tener que decodificar el JWT en el front.
export const esTecnico = () => localStorage.getItem("usuario_rol") === "Tecnico";

export const obtenerPerfil = async () => {
  try {
    const respuesta = await api.get("/auth/perfil");
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cambiarPassword = async (passwordActual, passwordNueva) => {
  try {
    const respuesta = await api.put("/auth/password", {
      passwordActual,
      passwordNueva,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

// --- FUNCIONES DE GESTIÓN (solo Técnico) ---
export const obtenerUsuarios = async () => {
  try {
    const respuesta = await api.get("/usuarios");
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const asignarSucursal = async (usuarioId, sucursalId) => {
  try {
    const respuesta = await api.put(`/usuarios/${usuarioId}/sucursal`, {
      sucursalId,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerSucursales = async (incluirInactivas = false) => {
  try {
    const respuesta = await api.get("/sucursales", {
      params: { incluirInactivas },
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const crearSucursal = async (numeroTienda, nombre, seccion, empresaId) => {
  try {
    const respuesta = await api.post("/sucursales", {
      numeroTienda,
      nombre,
      seccion: seccion || null,
      empresaId,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const editarSucursal = async (
  id,
  numeroTienda,
  nombre,
  seccion,
  empresaId,
) => {
  try {
    const respuesta = await api.put(`/sucursales/${id}`, {
      numeroTienda,
      nombre,
      seccion: seccion || null,
      empresaId,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cambiarEstadoSucursal = async (id, activa) => {
  try {
    const respuesta = await api.put(`/sucursales/${id}/estado`, { activa });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerEmpresas = async () => {
  try {
    const respuesta = await api.get("/empresas");
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const registrarUsuario = async (nombre, correo, password, rol) => {
  try {
    const respuesta = await api.post("/auth/registro", {
      nombre,
      correo,
      password,
      rol,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const editarUsuario = async (id, nombre, rol) => {
  try {
    const respuesta = await api.put(`/usuarios/${id}`, { nombre, rol });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const resetearPasswordUsuario = async (id, passwordNueva) => {
  try {
    const respuesta = await api.put(`/usuarios/${id}/password`, {
      passwordNueva,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cambiarEstadoUsuario = async (id, activo) => {
  try {
    const respuesta = await api.put(`/usuarios/${id}/estado`, { activo });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerAuditoria = async (limite = 100) => {
  try {
    const respuesta = await api.get("/auditoria", { params: { limite } });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerMetricas = async () => {
  try {
    const respuesta = await api.get("/tickets/metricas");
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

// --- FUNCIONES DE TICKETS ---
export const obtenerTickets = async () => {
  try {
    const respuesta = await api.get("/tickets");
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerMisTickets = async () => {
  try {
    const respuesta = await api.get("/tickets", {
      params: { soloMios: true },
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerTicketPorId = async (id) => {
  try {
    const respuesta = await api.get(`/tickets/${id}`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const crearTicket = async (datosTicket) => {
  try {
    const respuesta = await api.post("/tickets", datosTicket);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cerrarTicketApi = async (id) => {
  try {
    const respuesta = await api.put(`/tickets/${id}/cerrar`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

// El backend espera el nombre del técnico como string plano en el body
// (no un objeto), así que se manda ya serializado con el content-type
// explícito para que ASP.NET lo lea como [FromBody] string.
export const asignarTicket = async (id, tecnicoAsignado) => {
  try {
    const respuesta = await api.put(
      `/tickets/${id}/asignar`,
      JSON.stringify(tecnicoAsignado),
      { headers: { "Content-Type": "application/json" } },
    );
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

// --- FUNCIONES DE MENSAJES (chat del ticket) ---
export const obtenerMensajes = async (ticketId) => {
  try {
    const respuesta = await api.get(`/tickets/${ticketId}/mensajes`);
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const enviarMensaje = async (ticketId, texto) => {
  try {
    const respuesta = await api.post(`/tickets/${ticketId}/mensajes`, {
      texto,
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

// La URL del Hub de SignalR vive en el mismo servidor que la API,
// solo sin el prefijo /api.
export const HUB_URL = API_BASE_URL.replace(/\/api\/?$/, "") + "/ticketHub";
