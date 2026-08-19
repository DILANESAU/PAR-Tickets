import * as signalR from "@microsoft/signalr";
import { HUB_URL } from "./ticketService";

// El backend acepta el JWT como query string "access_token" para conexiones
// de SignalR (los headers normales no aplican a WebSockets del navegador).
export function crearConexionTicketHub() {
  return new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => localStorage.getItem("token_soporte") || "",
    })
    .withAutomaticReconnect()
    .build();
}
