// Contenido de la Base de Conocimientos (Wiki). No hay UI de administración
// a propósito (ver catalogoIncidentes.js) — para agregar o editar contenido
// se modifica este archivo directamente.
//
// Cada arreglo es independiente y se puede crecer libremente agregando
// objetos con la misma forma que los de ejemplo de abajo.

// INSTRUCTIVO: guías de uso del sistema. `contenido` es un arreglo de
// párrafos (strings) — uno por elemento para que el WikiPage los renderice
// como bloques separados en vez de un solo texto corrido.
export const GUIAS = [
  {
    id: "crear-ticket",
    titulo: "Cómo crear un ticket",
    resumen: "Pasos para levantar una solicitud de soporte nueva.",
    contenido: [
      'Desde el Panel de Tickets, presiona el botón "+ Nuevo Ticket".',
      "Elige la categoría y el incidente que mejor describa tu problema — el formulario se ajusta automáticamente según lo que elijas.",
      "Completa los datos solicitados y envía el ticket. Vas a poder darle seguimiento desde Mis Tickets.",
    ],
  },
  {
    id: "seguimiento-chat",
    titulo: "Cómo dar seguimiento a un ticket",
    resumen: "Usar el chat del ticket para comunicarte con soporte.",
    contenido: [
      "Entra al ticket desde Mis Tickets o el Panel de Tickets.",
      "En la parte inferior del detalle vas a encontrar un chat en tiempo real con el técnico asignado.",
      "Vas a recibir una notificación cuando haya un mensaje nuevo, aunque no tengas el ticket abierto.",
    ],
  },
];

// PREGUNTAS FRECUENTES
export const PREGUNTAS_FRECUENTES = [
  {
    id: "cuanto-tarda",
    pregunta: "¿Cuánto tarda en atenderse un ticket?",
    respuesta:
      "Depende de la prioridad asignada. Los tickets de prioridad Crítica y Alta se atienden primero.",
  },
  {
    id: "cambiar-prioridad",
    pregunta: "¿Puedo cambiar la prioridad de mi ticket?",
    respuesta:
      "La prioridad la determina el tipo de incidente seleccionado. Si consideras que tu caso es más urgente, coméntalo en el chat del ticket.",
  },
];

// VIDEOS: `url` debe ser un link de embed de YouTube
// (https://www.youtube.com/embed/XXXXXXXXXXX). Mientras no haya un video
// real, deja `url` en null y la tarjeta se muestra como "Próximamente".
export const VIDEOS = [
  {
    id: "recorrido-sistema",
    titulo: "Recorrido general del sistema",
    descripcion: "Introducción a las secciones principales del portal.",
    url: null,
  },
  {
    id: "como-crear-ticket",
    titulo: "Cómo crear un ticket paso a paso",
    descripcion: "Video guía del flujo completo de creación de tickets.",
    url: null,
  },
];
