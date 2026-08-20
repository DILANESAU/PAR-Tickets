import React, { useState } from "react";
import { GUIAS, PREGUNTAS_FRECUENTES, VIDEOS } from "../constants/wikiContent";

const PESTAÑAS = [
  { valor: "instructivo", label: "Instructivo", icono: "📖" },
  { valor: "faq", label: "Preguntas Frecuentes", icono: "❓" },
  { valor: "videos", label: "Videos", icono: "🎬" },
];

function EstadoVacio({ mensaje }) {
  return (
    <div className="p-10 text-center text-slate-400 text-sm bg-slate-900 rounded-2xl border border-slate-800">
      {mensaje}
    </div>
  );
}

function WikiPage() {
  const [pestañaActiva, setPestañaActiva] = useState("instructivo");
  const [busqueda, setBusqueda] = useState("");
  const texto = busqueda.trim().toLowerCase();

  const guiasFiltradas = GUIAS.filter(
    (g) =>
      !texto ||
      g.titulo.toLowerCase().includes(texto) ||
      g.resumen.toLowerCase().includes(texto),
  );

  const preguntasFiltradas = PREGUNTAS_FRECUENTES.filter(
    (p) =>
      !texto ||
      p.pregunta.toLowerCase().includes(texto) ||
      p.respuesta.toLowerCase().includes(texto),
  );

  const videosFiltrados = VIDEOS.filter(
    (v) => !texto || v.titulo.toLowerCase().includes(texto),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <main className="max-w-4xl mx-auto p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Base de Conocimientos
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Guías de uso, dudas frecuentes y videos para resolver cosas sin
            tener que abrir un ticket.
          </p>
        </div>

        {/* BÚSQUEDA */}
        <div className="relative mb-6">
          <span
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
          >
            🔍
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en la base de conocimientos..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* PESTAÑAS */}
        <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-fit mb-6">
          {PESTAÑAS.map(({ valor, label, icono }) => (
            <button
              key={valor}
              onClick={() => setPestañaActiva(valor)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                pestañaActiva === valor
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <span aria-hidden="true">{icono}</span>
              {label}
            </button>
          ))}
        </div>

        {/* INSTRUCTIVO */}
        {pestañaActiva === "instructivo" &&
          (guiasFiltradas.length === 0 ? (
            <EstadoVacio
              mensaje={
                texto
                  ? `Ninguna guía coincide con "${busqueda}".`
                  : "Todavía no hay guías publicadas."
              }
            />
          ) : (
            <div className="space-y-3">
              {guiasFiltradas.map((guia) => (
                <details
                  key={guia.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
                >
                  <summary className="cursor-pointer select-none list-none p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div>
                      <h3 className="font-medium text-white text-base">
                        {guia.titulo}
                      </h3>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {guia.resumen}
                      </p>
                    </div>
                    <span className="text-slate-500 transition-transform group-open:rotate-90 shrink-0">
                      ›
                    </span>
                  </summary>
                  <div className="px-5 pb-5 space-y-3 border-t border-slate-800 pt-4">
                    {guia.contenido.map((parrafo, idx) => (
                      <p key={idx} className="text-sm text-slate-300">
                        {parrafo}
                      </p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ))}

        {/* PREGUNTAS FRECUENTES */}
        {pestañaActiva === "faq" &&
          (preguntasFiltradas.length === 0 ? (
            <EstadoVacio
              mensaje={
                texto
                  ? `Ninguna pregunta coincide con "${busqueda}".`
                  : "Todavía no hay preguntas frecuentes publicadas."
              }
            />
          ) : (
            <div className="space-y-3">
              {preguntasFiltradas.map((p) => (
                <details
                  key={p.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
                >
                  <summary className="cursor-pointer select-none list-none p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <h3 className="font-medium text-white text-base">
                      {p.pregunta}
                    </h3>
                    <span className="text-slate-500 transition-transform group-open:rotate-90 shrink-0">
                      ›
                    </span>
                  </summary>
                  <div className="px-5 pb-5 border-t border-slate-800 pt-4">
                    <p className="text-sm text-slate-300">{p.respuesta}</p>
                  </div>
                </details>
              ))}
            </div>
          ))}

        {/* VIDEOS */}
        {pestañaActiva === "videos" &&
          (videosFiltrados.length === 0 ? (
            <EstadoVacio
              mensaje={
                texto
                  ? `Ningún video coincide con "${busqueda}".`
                  : "Todavía no hay videos publicados."
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videosFiltrados.map((video) => (
                <div
                  key={video.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
                >
                  {video.url ? (
                    <div className="aspect-video">
                      <iframe
                        src={video.url}
                        title={video.titulo}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-950/60 flex flex-col items-center justify-center gap-2 text-slate-600">
                      <span className="text-3xl" aria-hidden="true">
                        🎬
                      </span>
                      <span className="text-xs font-medium">
                        Próximamente
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-white text-sm">
                      {video.titulo}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      {video.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </main>
    </div>
  );
}

export default WikiPage;
