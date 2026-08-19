import React from "react";

function WikiPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600/10 border border-blue-900/50 flex items-center justify-center text-3xl">
          📚
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Base de Conocimientos
        </h1>
        <p className="text-slate-400 text-sm">
          Todavía estamos armando esta sección. Pronto vas a encontrar aquí
          guías y respuestas a las dudas más comunes, para resolver algunas
          cosas sin tener que abrir un ticket.
        </p>
      </div>
    </div>
  );
}

export default WikiPage;
