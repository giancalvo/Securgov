"use client";

import { ArrowRight, Clock, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDisputes } from "@/context/DisputeContext";

export default function Home() {
  const { disputes, removeDispute, isLoaded } = useDisputes();

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-zinc-500 animate-pulse font-medium">Cargando protocolos de gobernanza...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animation-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Disputas Activas</h1>
          <p className="text-zinc-400 mt-1 text-sm font-medium">Gestiona y participa en la resolución de conflictos con tecnología de gobernanza avanzada.</p>
        </div>
        <Link href="/nueva" className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer text-center shadow-[0_0_20px_rgba(255,255,255,0.3)] shimmer-effect active:scale-95">
          Nueva Disputa
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-100">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-2 shadow-xl animate-float glass-morphism hover:border-indigo-500/30 transition-all spring-hover">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Disputas</span>
          <span className="text-4xl font-extrabold text-white">{disputes.length + 121}</span>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-2 shadow-xl animate-float glass-morphism [animation-delay:0.5s] hover:border-purple-500/30 transition-all">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">En Proceso</span>
          <span className="text-3xl font-bold text-indigo-300">{disputes.filter(d => d.status === 'En Mediación').length + 10}</span>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-2 shadow-xl animate-float glass-morphism [animation-delay:1s] hover:border-emerald-500/30 transition-all">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Valor en Custodia</span>
          <span className="text-3xl font-bold text-emerald-400">45.2 ETH</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4 animate-slide-up delay-200">
        <h2 className="text-xl font-semibold">Tus Casos Recientes</h2>
        
        {disputes.length === 0 ? (
          <div className="text-center py-10 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed text-zinc-500">
            No tienes disputas recientes. Crea una nueva para empezar.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {disputes.map((disputa) => (
              <div key={disputa.id} className="relative group/card cursor-pointer spring-hover">
                <Link href={`/disputa/${disputa.id}`} className="block">
                  <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:border-indigo-500/50 p-5 rounded-2xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{disputa.title}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 font-mono`}>
                          {disputa.votingMethod || "Simple"}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          disputa.status === 'En Mediación' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                          disputa.status === 'Votación Activa' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                          {disputa.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {disputa.amount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {disputa.timeRemaining}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-indigo-400 font-medium group-hover/card:translate-x-1 transition-transform pr-16 sm:pr-0">
                      Ver Detalles <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>

                {/* Trash Button - Absolute positioned to not trigger the Link */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm("¿Estás seguro de que deseas eliminar esta disputa finalizada?")) {
                      removeDispute(disputa.id);
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-zinc-800 hover:bg-rose-500 hover:text-white text-zinc-400 rounded-full transition-colors opacity-0 group-hover/card:opacity-100 z-10"
                  title="Eliminar Disputa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
