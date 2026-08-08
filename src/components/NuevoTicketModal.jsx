import React, { useState, useEffect } from "react";
import { crearTicket } from "../services/ticketService";
import { toast } from "sonner";

const catalogoIncidentes = [
  {
    asunto: "No hay conexión a Internet",
    categoria: "redes",
    prioridad: "Alta",
  },
  {
    asunto: "Olvido de contraseña / Cuenta bloqueada",
    categoria: "accesos",
    prioridad: "Alta",
  },
  {
    asunto: "Falla en impresora / Tóner vacío",
    categoria: "hardware",
    prioridad: "Media",
  },
  {
    asunto: "Solicitud de instalación de software",
    categoria: "software",
    prioridad: "Baja",
  },
  {
    asunto: "El equipo está muy lento o se congela",
    categoria: "hardware",
    prioridad: "Media",
  },
  {
    asunto: "Fallo general en el ERP",
    categoria: "software",
    prioridad: "Critica",
  },
  {
    asunto: "Otro problema (Especificar en descripción)",
    categoria: "software",
    prioridad: "Media",
  },
];

function NuevoTicketModal({ isOpen, onClose, onTicketCreado }) {
  const [asuntoSeleccionado, setAsuntoSeleccionado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NUEVO ESTADO PARA LA ANIMACIÓN ---
  const [isRendered, setIsRendered] = useState(false);

  // --- EFECTO PARA CONTROLAR EL RETARDO DE LA TRANSICIÓN ---
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsRendered(true), 10);
    } else {
      setIsRendered(false);
    }
  }, [isOpen]);

  // Modificamos el condicional de salida para esperar la animación
  if (!isOpen && !isRendered) return null;

  const handleSeleccionIncidente = (e) => {
    const asuntoElegido = e.target.value;
    setAsuntoSeleccionado(asuntoElegido);

    const incidente = catalogoIncidentes.find(
      (i) => i.asunto === asuntoElegido,
    );

    if (incidente) {
      setCategoria(incidente.categoria);
      setPrioridad(incidente.prioridad);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nuevoTicket = {
        asunto: asuntoSeleccionado,
        categoria,
        prioridad,
        descripcion: descripcion || "Sin descripción adicional",
      };

      await crearTicket(nuevoTicket);
      toast.success("Ticket reportado con exito");

      setAsuntoSeleccionado("");
      setCategoria("");
      setPrioridad("");
      setDescripcion("");

      if (onTicketCreado) onTicketCreado();
      onClose();
    } catch (error) {
      alert("Hubo un error al enviar el ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // CONTENEDOR PRINCIPAL: Animación de fondo difuminado y opacidad
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-all duration-300 ease-out
        ${isRendered ? "opacity-100 bg-black/80 backdrop-blur-sm" : "opacity-0 bg-transparent backdrop-blur-none"}
      `}
    >
      {/* FONDO CLICKABLE PARA CERRAR */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* CONTENEDOR DEL MODAL: Animación de escala y desplazamiento vertical */}
      <div
        className={`relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform
          ${isRendered ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}
        `}
      >
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">Reportar un Problema</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="ticketForm" onSubmit={handleSubmit} className="space-y-5">
            {/* MENÚ DESPLEGABLE DE INCIDENTES FIJOS */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                ¿Qué problema presentas?
              </label>
              <select
                required
                value={asuntoSeleccionado}
                onChange={handleSeleccionIncidente}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none transition-colors"
              >
                <option value="" disabled>
                  Selecciona una opción de la lista...
                </option>
                {catalogoIncidentes.map((incidente, idx) => (
                  <option key={idx} value={incidente.asunto}>
                    {incidente.asunto}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORÍA Y PRIORIDAD (AHORA ESTÁN BLOQUEADOS/DISABLED) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 opacity-70">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  Categoría (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value={categoria}
                  placeholder="-"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-400 rounded-xl px-4 py-2.5 cursor-not-allowed uppercase text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  Prioridad (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value={prioridad}
                  placeholder="-"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-400 rounded-xl px-4 py-2.5 cursor-not-allowed uppercase text-sm font-semibold"
                />
              </div>
            </div>

            {/* DESCRIPCIÓN (YA NO TIENE LA ETIQUETA 'REQUIRED') */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Detalles adicionales{" "}
                <span className="text-slate-500 text-xs font-normal">
                  (Opcional)
                </span>
              </label>
              <textarea
                rows="3"
                placeholder="Si necesitas agregar algo más, escríbelo aquí..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-600 resize-none transition-colors"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="ticketForm"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Procesando..." : "Crear Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NuevoTicketModal;
