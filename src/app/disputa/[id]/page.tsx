"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip, Bot, ThumbsUp, ThumbsDown, Clock, MonitorUp, MonitorOff, Eye, Zap, ScanSearch, Target, Scale, Info, MessageSquare, ShieldCheck, Activity, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDisputes } from "@/context/DisputeContext";

export default function DisputaDetalle() {
  const params = useParams();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { disputes, isLoaded } = useDisputes();
  
  // Encontrar la disputa creada
  const disputaInfo = disputes.find(d => d.id === idStr);

  const isVotingPhase = disputaInfo?.status === "Votación Activa" || disputaInfo?.status === "Resuelto"; 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [visionLogs, setVisionLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>("Iniciando mediación...");
  const [messageType, setMessageType] = useState<"argumento" | "evidencia" | "pregunta" | "refutación">("argumento");
  
  // Simulated AI Summarization (Requirement #4)
  useEffect(() => {
    const summaries = [
      "AI: Detectado punto de acuerdo en el presupuesto. Conflicto persiste en entregables técnicos.",
      "AI: Demandante solicita archivos fuente. Demandado argumenta exclusión contractual.",
      "AI: Evidencia visual procesada. Se detecta inconsistencia en la resolución del archivo entregado.",
      "AI: El debate se está desviando. Por favor, centrarse en el Hito 2 del contrato."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setAiSummary(summaries[i % summaries.length]);
      i++;
    }, 60000); // 1 minute for prototype demonstration (Requirement says 5m)
    return () => clearInterval(interval);
  }, []);

  // Safe initial messages
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  useEffect(() => {
    if (disputaInfo) {
      const messages = (disputaInfo.initialMessages || []).map((msg, i) => ({
        id: `initial-${i}`,
        sender: msg.role === "Demandante" ? "0x123...456" : msg.role === "Demandado" ? (disputaInfo.defendant || "0xABC...DEF") : "IA Mediadora",
        role: msg.role,
        type: msg.type,
        content: msg.content,
        time: "10:30",
        hash: "0x" + Math.random().toString(16).slice(2, 6) + "...init"
      }));

      // If no initial messages, fallback to description
      if (messages.length === 0) {
        messages.push({
          id: "fallback-1",
          sender: "0x123...456",
          role: "Demandante",
          type: "argumento",
          content: disputaInfo.description || "Iniciando disputa...",
          time: "10:30",
          hash: "0x7d2a...4b12"
        });
      }
      setChatMessages(messages);
    }
  }, [disputaInfo?.id]);

  // Simulated AI Vision Analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScreenSharing) {
      setIsScanning(true);
      const possibleLogs = [
        "Analizando estructura de archivos compartidos...",
        "Detectada discrepancia en montos del contrato.",
        "Procesando captura de pantalla: 0x123... vs 0xABC...",
        "Validando firma digital en la evidencia visual.",
        "OCR: Extraído texto de 'Condiciones de Entrega'.",
        "Meta-datos de la ventana: Coincidencia con historial de chat.",
        "AI: Verificando autenticidad de la captura visual."
      ];

      interval = setInterval(() => {
        const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
        setVisionLogs(prev => [randomLog, ...prev].slice(0, 3));
      }, 4000);
    } else {
      setIsScanning(false);
      setVisionLogs([]);
    }
    return () => clearInterval(interval);
  }, [isScreenSharing]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(mediaStream);
      setIsScreenSharing(true);

      // Detect when user stops sharing via browser UI
      mediaStream.getVideoTracks()[0].onended = () => {
        stopScreenShare(mediaStream);
      };
    } catch (error) {
      console.error("Error sharing screen: ", error);
    }
  };

  const stopScreenShare = (activeStream = stream) => {
    if (activeStream) {
      activeStream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsScreenSharing(false);
  };

  const [evidencias, setEvidencias] = useState<any[]>([]);

  useEffect(() => {
    if (disputaInfo?.evidence) {
      setEvidencias(disputaInfo.evidence);
    } else if (!disputaInfo) {
      // Default initial evidence for mock disputes if they don't have it
      setEvidencias([
        { id: 1, name: "contrato_inicial.pdf", time: "Subido hace 2 días", size: "2.4 MB" },
        { id: 2, name: "captura_chatbot.png", time: "Subido hace 1 hora", size: "850 KB" }
      ]);
    }
  }, [disputaInfo?.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newEvidencia = {
        id: Date.now(),
        name: file.name,
        time: "Subido justo ahora",
        size: (file.size / 1024).toFixed(1) + " KB"
      };
      setEvidencias([...evidencias, newEvidencia]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!disputaInfo) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h2 className="text-xl font-bold">Disputa no encontrada</h2>
        <p className="text-zinc-400">El ID de la disputa que buscas no existe o ha sido eliminada.</p>
        <Link href="/" className="bg-indigo-600 px-6 py-2 rounded-lg text-white font-medium">
          Volver al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up max-w-6xl mx-auto relative z-10">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
      />

      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex flex-col gap-2 relative z-10 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">{disputaInfo.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      disputaInfo.status === 'En Mediación' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                      disputaInfo.status === 'Votación Activa' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                {disputaInfo.status}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">Demandante: 0x123...456 | Demandado: {disputaInfo.defendant || "0xABC...DEF"}</p>
            
            {disputaInfo.description && (
              <div className="mt-4 p-4 glass-morphism border border-zinc-800/40 rounded-xl text-zinc-300 text-sm leading-relaxed max-w-2xl border-l-4 border-l-indigo-500 shadow-lg animate-slide-up delay-100 neon-border">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1 tracking-wider">Resumen del Conflicto ✨</span>
                {disputaInfo.description}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 relative z-10">
            <span className="text-sm text-zinc-400">Fondos en Disputa</span>
            <span className="text-3xl font-bold text-emerald-400">{disputaInfo.amount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Context (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-8 animate-slide-up delay-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="font-bold text-sm text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
              <Target className="w-4 h-4 text-indigo-400" /> Objetivos del Debate
            </h3>
            <div className="flex flex-col gap-2">
              {(disputaInfo.objectives || ["Llegar a un acuerdo mutuo", "Verificar evidencia técnica"]).map((obj: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-zinc-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                  {obj}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="font-bold text-sm text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
              <Scale className="w-4 h-4 text-amber-400" /> Criterios de Decisión
            </h3>
            <div className="flex flex-col gap-2">
              {(disputaInfo.criteria || ["Consistencia de pruebas", "Cumplimiento de plazos"]).map((crit: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-zinc-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/50">
                  <Info className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                  {crit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Chat / Mediation Area (50%) */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl h-[750px] overflow-hidden shadow-2xl relative animate-slide-up delay-300">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex justify-between items-center z-10 shrink-0">
            <h2 className="font-semibold flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-indigo-400" /> Sala de Mediación
            </h2>
            {disputaInfo.status === "En Mediación" && (
              <div className="flex items-center gap-2">
                {isScreenSharing ? (
                  <button onClick={() => stopScreenShare()} className="flex items-center gap-2 text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-full border border-rose-500/20 transition-all hover:scale-105 cursor-pointer relative overflow-hidden group">
                    <span className="absolute inset-0 bg-rose-500/10 animate-pulse group-hover:bg-transparent transition-colors"></span>
                    <MonitorOff className="w-4 h-4 relative z-10" /> <span className="relative z-10">Detener Transmisión</span>
                  </button>
                ) : (
                  <button onClick={startScreenShare} className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-500/20 transition-all hover:scale-105 cursor-pointer">
                    <MonitorUp className="w-4 h-4" /> Compartir Pantalla
                  </button>
                )}
                <button className="flex items-center gap-2 text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/20 transition-all hover:scale-105 cursor-pointer">
                  <Bot className="w-4 h-4" /> Invocar IA Mediadora
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 relative">
            {isScreenSharing && (
              <div className="sticky top-0 z-20 w-full mb-2 rounded-xl overflow-hidden border border-emerald-500/30 bg-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col transition-all">
                <div className="bg-zinc-900/80 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-emerald-400">EN VIVO: Transmitiendo contexto visual a los jurados y a la IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <MonitorUp className="w-4 h-4 text-emerald-500/70" />
                  </div>
                </div>
                <div className="relative group">
                  {/* AI Scanning Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
                    <div className="absolute top-4 left-4 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 px-2 py-1 rounded text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
                      <ScanSearch className="w-3 h-3" /> AI Vision Engine Active
                    </div>
                  </div>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full max-h-[350px] object-contain bg-black"
                  />
                </div>
              </div>
            )}
            
            {/* Live Message History */}
            <div className="flex flex-col gap-6">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === "Demandante" ? "items-start" : "items-end"} w-full group/msg`}>
                  <div className={`flex items-center gap-2 mb-1 ${msg.role === "Demandante" ? "flex-row" : "flex-row-reverse"}`}>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{msg.role}: {msg.sender}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${
                      msg.type === 'argumento' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      msg.type === 'evidencia' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      msg.type === 'pregunta' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {msg.type}
                    </span>
                    {msg.type === 'evidencia' && (
                      <span className="flex items-center gap-1 text-[8px] bg-emerald-500/20 text-emerald-400 px-1 rounded-full font-bold">
                        <ShieldCheck className="w-2.5 h-2.5" /> VERIFICADA
                      </span>
                    )}
                  </div>
                  <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm transition-all border ${
                    msg.role === "Sistema"
                      ? "bg-rose-950/20 border-rose-500/30 text-rose-100 italic"
                      : msg.role === "Demandante" 
                        ? "bg-zinc-800/80 border-zinc-700/50 rounded-tl-sm group-hover/msg:border-zinc-600" 
                        : "bg-indigo-600/90 border-indigo-500/50 text-white rounded-tr-sm group-hover/msg:bg-indigo-600"
                  }`}>
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-zinc-600">{msg.time}</span>
                    <span className="text-[8px] font-mono text-zinc-700 group-hover/msg:text-indigo-500/50 transition-colors">ID: {msg.hash}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Message - solo si esta en mediacion o resolucion */}
            <div className="flex flex-col gap-2 items-center my-6 relative w-full pt-10">
              <div className="absolute top-10 left-0 right-0 h-px bg-indigo-500/20"></div>
              <span className="bg-zinc-900 px-4 text-xs text-indigo-400 font-semibold flex items-center gap-1.5 relative z-10 py-1 rounded-full border border-indigo-500/20">
                <Bot className="w-3.5 h-3.5" /> Mediador IA Analizando...
              </span>
              
              <div className="mt-2 bg-indigo-950/40 border border-indigo-500/30 px-6 py-4 rounded-xl w-full text-sm text-indigo-100 shadow-[0_0_30px_rgba(79,70,229,0.1)] backdrop-blur-md relative overflow-hidden">
                {/* Fixed Summary Panel (Requirement #10) */}
                <div className="absolute top-0 right-0 bg-indigo-500/20 px-3 py-1 rounded-bl-lg border-b border-l border-indigo-500/30 text-[9px] font-bold uppercase tracking-tighter text-indigo-300">
                  Resumen cada 5m
                </div>
                {isScanning && (
                  <div className="mb-4 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg flex flex-col gap-2 animation-fade-in">
                    <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2 mb-1">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-tighter">
                        <Zap className="w-3 h-3 fill-emerald-400" /> Live Visual Analysis (AI Expert)
                      </span>
                      <span className="text-[9px] font-mono text-emerald-500/60 transition-all">{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 min-h-[60px]">
                      {visionLogs.length > 0 ? visionLogs.map((log, i) => (
                        <div key={i} className={`text-[11px] font-mono flex items-start gap-2 ${i === 0 ? 'text-emerald-300' : 'text-emerald-500/70'}`}>
                          <span className="text-emerald-500 mt-1">›</span> 
                          <span className={`px-1 rounded text-[9px] ${
                            log.includes('discrepancia') ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {log.includes('discrepancia') ? 'DUDOSA' : 'VERIFICADA'}
                          </span>
                          {log}
                        </div>
                      )) : (
                        <div className="text-[11px] font-mono text-emerald-500/40 italic">Iniciando reconocimiento visual...</div>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="mb-2"><strong className="text-indigo-300">Resumen AI Mediador:</strong> {aiSummary}</p>
                <div className="grid grid-cols-2 gap-3 mt-4 text-[11px]">
                  <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                    <strong className="text-emerald-400 block mb-1">Puntos en Común:</strong> Ambas partes aceptan el monto de 0.5 ETH.
                  </div>
                  <div className="p-2 rounded bg-rose-500/5 border border-rose-500/10">
                    <strong className="text-rose-400 block mb-1">Conflictos Claves:</strong> Interpretación de "archivos de diseño finales".
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md z-10 shrink-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {(["argumento", "evidencia", "pregunta", "refutación"] as const).map((type) => (
                  <button 
                    key={type}
                    onClick={() => setMessageType(type)}
                    className={`text-[10px] whitespace-nowrap px-3 py-1 rounded-full border transition-all uppercase font-bold tracking-tight ${
                      messageType === type 
                        ? 'bg-indigo-500 text-white border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20' 
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-full px-4 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  title="Subir evidencia"
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                  disabled={isVotingPhase}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder={isVotingPhase ? "Fase de chat cerrada." : `Escribir ${messageType}...`}
                  disabled={isVotingPhase}
                  className="bg-transparent flex-1 outline-none text-sm px-2 text-zinc-100 placeholder:text-zinc-500 w-full disabled:opacity-50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (!val) return;
                      setChatMessages([...chatMessages, {
                        id: Date.now(),
                        sender: "0x123...456",
                        role: "Demandante",
                        type: messageType,
                        content: val,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        hash: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6)
                      }]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <button 
                  disabled={isVotingPhase} 
                  onClick={() => {
                    const input = fileInputRef.current?.parentElement?.querySelector('input[type="text"]') as HTMLInputElement;
                    const val = input?.value;
                    if (!val) return;
                    setChatMessages([...chatMessages, {
                      id: Date.now(),
                      sender: "0x123...456",
                      role: "Demandante",
                      type: messageType,
                      content: val,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      hash: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6)
                    }]);
                    input.value = "";
                  }}
                  className="text-white transition-all cursor-pointer p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg disabled:opacity-50 shimmer-effect spring-hover active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Voting, Reputation & Dashboard (25%) */}
        <div className="lg:col-span-1 flex flex-col gap-6 animate-slide-up delay-400">
          {/* Reputation System (#6) */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 shadow-xl flex flex-col gap-4 glass-morphism neon-border">
            <h3 className="font-bold text-[11px] text-zinc-400 flex items-center justify-between uppercase tracking-widest">
              <span>Sistemas de Reputación</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500/80 animate-pulse" />
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-500">Calidad de Argumentos</span>
                  <span className="text-white font-mono">92/100</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                  <div className="h-full dopamine-gradient w-[92%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-500">Participación Activa</span>
                  <span className="text-white font-mono">75%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[75%] shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Modes (#7) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
            <h3 className="font-bold text-sm text-zinc-400 flex items-center justify-between uppercase tracking-wider">
              <span>Modos de Votación</span>
              <Activity className="w-4 h-4 text-indigo-400" />
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2 rounded-lg border text-[10px] text-center transition-all ${disputaInfo.votingMethod === "Simple" ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold" : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"}`}>Simple</div>
              <div className={`p-2 rounded-lg border text-[10px] text-center transition-all ${disputaInfo.votingMethod === "Cuadrática" ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold" : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"}`}>Cuadrática</div>
              <div className={`p-2 rounded-lg border text-[10px] text-center transition-all ${disputaInfo.votingMethod === "Ponderada" ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold" : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"}`}>Ponderada</div>
              <div className={`p-2 rounded-lg border text-[10px] text-center transition-all ${disputaInfo.votingMethod === "Consenso" ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold" : "bg-zinc-800/50 border-zinc-700/50 text-zinc-400"}`}>Consenso</div>
            </div>
          </div>

          {/* Dynamic Voting Dashboard (#8) */}
          <div className="bg-zinc-900 border border-indigo-500/20 rounded-xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(79,70,229,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
            <h3 className="font-semibold text-lg border-b border-zinc-800 pb-3 flex items-center justify-between relative z-10">
              Votación Dinámica
              <span className="text-[10px] font-mono text-zinc-500">{disputaInfo.timeRemaining}</span>
            </h3>

            <div className="flex flex-col gap-4 relative z-10">
              {(disputaInfo.votingOptions || ["Opción A", "Opción B"]).map((opt: string, i: number) => (
                <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-zinc-800/50 bg-zinc-950/30 hover-lift hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-semibold text-zinc-300">{opt}</span>
                    <span className="text-[10px] font-mono dopamine-text-gradient font-bold">{i === 0 ? "65%" : "35%"}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full dopamine-gradient transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] ${i === 0 ? "w-[65%]" : "w-[35%]"}`}></div>
                  </div>

                  {/* Dynamic Voting Button based on Method (Fallback to Simple if undefined) */}
                  {(disputaInfo.votingMethod === "Simple" || !disputaInfo.votingMethod) && (
                    <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-indigo-500/10 shimmer-effect spring-hover active:scale-95">
                      Votar (1 Token)
                    </button>
                  )}
                  {disputaInfo.votingMethod === "Cuadrática" && (
                    <div className="flex gap-2">
                      <input type="number" defaultValue={1} className="w-16 bg-zinc-950/50 border border-zinc-800 rounded-lg px-2 text-[10px] text-white focus:outline-none focus:border-indigo-500 font-bold" />
                      <button className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-tighter shimmer-effect spring-hover active:scale-95">
                        Votación Cuadrática
                      </button>
                    </div>
                  )}
                  {disputaInfo.votingMethod === "Ponderada" && (
                    <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest shimmer-effect spring-hover active:scale-95">
                      Votar x1.5 Rep
                    </button>
                  )}
                  {disputaInfo.votingMethod === "Consenso" && (
                    <button className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest shimmer-effect spring-hover active:scale-95">
                      Firmar Consenso
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 border-dashed text-center">
              <span className="text-[10px] text-zinc-500 block mb-1">Tu Poder de Voto</span>
              <span className="text-xl font-bold text-white font-mono leading-none">1,250 <span className="text-[10px] font-normal text-indigo-400 uppercase tracking-tighter">Tokens</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
