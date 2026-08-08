// src/services/ticketService.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5250/api",
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

// --- FUNCIONES DE AUTENTICACIÓN ---
export const iniciarSesion = async (correo, password) => {
  try {
    const respuesta = await api.post("/auth/login", { correo, password });
    if (respuesta.data.token) {
      localStorage.setItem("token_soporte", respuesta.data.token);
      localStorage.setItem("usuario_nombre", respuesta.data.usuario.nombre);
    }
    return respuesta.data;
  } catch (error) {
    throw error;
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem("token_soporte");
  localStorage.removeItem("usuario_nombre");
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
