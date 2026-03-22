"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Upload, Info, X, File as FileIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDisputes } from "@/context/DisputeContext";

export default function NuevaDisputa() {
  const router = useRouter();
  const { addDispute } = useDisputes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [defendant, setDefendant] = useState("");
  const [description, setDescription] = useState("");
  const [votingMethod, setVotingMethod] = useState<"Simple" | "Cuadrática" | "Ponderada" | "Consenso">("Simple");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addDispute({
        title,
        status: "En Mediación",
        timeRemaining: "3 días",
        amount: "0.05 ETH",
        description,
        defendant: defendant || "0x???...???",
        votingMethod,
        objectives: ["Resolver disputa inmutable en cadena"],
        criteria: ["Análisis de evidencia por IA", "Voto de la gobernanza"],
        votingOptions: ["A Favor del Demandante", "A Favor del Demandado"],
        evidence: files.map(f => ({
          name: f.name,
          size: (f.size / 1024).toFixed(1) + " KB",
          time: "Subido justo ahora"
        }))
      });
      router.push("/");
    }, 2000); // Simulate transaction delay
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto animation-fade-in relative z-10">
      <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm w-fit transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
      </Link>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col gap-8 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Crear Nueva Disputa</h1>
          <p className="text-zinc-400 mt-2 text-sm">Registra una nueva disputa inmutable en el Smart Contract. Requerirá la firma con tu wallet.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Título de la Disputa</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Desarrollo web incompleto..." 
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Wallet del Demandado (Opcional)</label>
            <input 
              type="text" 
              value={defendant}
              onChange={(e) => setDefendant(e.target.value)}
              placeholder="0x..." 
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-all text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Descripción Detallada</label>
            <textarea 
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el acuerdo original y el motivo de la disputa..." 
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white resize-none"
            ></textarea>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-zinc-300">Método de Votación</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "Simple", desc: "1 Token = 1 Voto. El método más directo.", icon: "⚖️" },
                { id: "Cuadrática", desc: "El costo del voto aumenta al cuadrado. Protege minorías.", icon: "📈" },
                { id: "Ponderada", desc: "Votos basados en el score de reputación acumulado.", icon: "🌟" },
                { id: "Consenso", desc: "Requiere una super-mayoría (>75%) para ejecutarse.", icon: "🤝" }
              ].map((m) => (
                <div 
                  key={m.id}
                  onClick={() => setVotingMethod(m.id as any)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    votingMethod === m.id 
                      ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
                      : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-white">{m.id}</span>
                    <span className="text-lg">{m.icon}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Archivos Adjuntos (Evidencia)</label>
            
            <input 
              type="file" 
              multiple 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 bg-zinc-950/50 hover:bg-zinc-800/50 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
            >
              <Upload className="w-8 h-8 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
              <p className="text-sm text-zinc-400 font-medium group-hover:text-zinc-300">Haz clic para subir PDFs, Imágenes o archivos</p>
              <p className="text-xs text-zinc-600">Max 10MB. Se alojarán en IPFS.</p>
            </div>

            {files.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex flex-row justify-between items-center bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-zinc-300 overflow-hidden">
                      <FileIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeFile(idx)}
                      className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4 flex gap-3 mt-2">
            <Info className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="flex flex-col text-sm text-indigo-200/80">
              <strong className="text-indigo-300">Costo de Creación</strong>
              <p>Crear esta disputa requerirá bloquear 0.05 ETH como depósito de garantía contra disputas frívolas. Este depósito se devolverá si la resolución te favorece.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-zinc-800">
            <Link href="/" className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center">
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[160px] px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? "Firmando tx en wallet..." : "Crear Disputa en Cadena"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
