// Fuente única de verdad para los colores de estado y prioridad de un
// ticket. Antes esta lógica estaba copiada en Dashboard, Historial y el
// detalle del ticket, y se desincronizó (ej. "Media" se veía ámbar en unas
// pantallas y naranja en otras) — de ahí que viva en un solo lugar.
//
// Los 4 niveles de prioridad usan colores distintos entre sí (no solo dos
// tonos repetidos) para que la severidad se distinga de un vistazo incluso
// por quien tiene dificultad para diferenciar tonos parecidos; el texto de
// la etiqueta siempre acompaña al color, nunca es la única señal.
const ESTILOS_PRIORIDAD = {
  Critica: "bg-red-950/40 text-red-400 border-red-900/50",
  Alta: "bg-orange-950/40 text-orange-400 border-orange-900/50",
  Media: "bg-amber-950/40 text-amber-400 border-amber-900/50",
  Baja: "bg-slate-800 text-slate-400 border-slate-700",
};

const ESTILOS_ESTADO = {
  Cerrado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Default: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function PrioridadBadge({ prioridad, prefijo = "", className = "" }) {
  const estilo = ESTILOS_PRIORIDAD[prioridad] ?? ESTILOS_PRIORIDAD.Baja;
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-md font-medium border ${estilo} ${className}`}
    >
      {prefijo}
      {prioridad}
    </span>
  );
}

export function EstadoBadge({ estado, className = "" }) {
  const estilo = ESTILOS_ESTADO[estado] ?? ESTILOS_ESTADO.Default;
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-semibold border ${estilo} ${className}`}
    >
      {estado}
    </span>
  );
}
