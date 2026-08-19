// Aviso de escritorio (API Notification del navegador). Solo funciona
// mientras el navegador esté abierto (aunque sea minimizado o en otra
// pestaña) — no es push real, así que no llega si el navegador está cerrado.

export const notificacionesSoportadas = () => "Notification" in window;

export const permisoNotificaciones = () =>
  notificacionesSoportadas() ? Notification.permission : "unsupported";

// Debe llamarse desde un gesto del usuario (click de un botón) — la mayoría
// de navegadores ignora o bloquea la solicitud si se dispara sola al cargar.
export const pedirPermisoNotificaciones = async () => {
  if (!notificacionesSoportadas()) return "unsupported";
  return await Notification.requestPermission();
};

export const mostrarNotificacion = (titulo, opciones = {}, onClick) => {
  if (!notificacionesSoportadas() || Notification.permission !== "granted") {
    return;
  }

  const notificacion = new Notification(titulo, {
    icon: "/favicon.svg",
    ...opciones,
  });

  if (onClick) {
    notificacion.onclick = () => {
      window.focus();
      onClick();
      notificacion.close();
    };
  }
};
