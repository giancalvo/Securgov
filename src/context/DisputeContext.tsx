"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Disputa = {
  id: string;
  title: string;
  status: string;
  timeRemaining: string;
  amount: string;
  description?: string;
  defendant?: string;
  objectives?: string[];
  criteria?: string[];
  votingOptions?: string[];
  evidence?: { name: string; size: string; time: string }[];
  votingMethod?: "Simple" | "Cuadrática" | "Ponderada" | "Consenso";
  initialMessages?: { role: "Demandante" | "Demandado" | "Sistema"; type: string; content: string }[];
};

type DisputeContextType = {
  disputes: Disputa[];
  addDispute: (d: Omit<Disputa, "id">) => void;
  removeDispute: (id: string) => void;
  isLoaded: boolean;
};

const initialMockDisputes: Disputa[] = [
  {
    id: "1",
    title: "Trabajo de diseño no entregado",
    status: "En Mediación",
    timeRemaining: "2 horas",
    amount: "0.5 ETH",
    description: "El diseñador no entregó los archivos fuente prometidos. Solo me envió un PNG en baja resolución.",
    defendant: "0xABC...DEF",
    objectives: ["Obtener archivos fuente (.fig, .ai)", "Verificar contrato original"],
    criteria: ["Entrega técnica comprobable"],
    votingOptions: ["Reembolso total", "Entrega forzada"],
    evidence: [
      { name: "contrato_inicial.pdf", time: "Subido hace 2 días", size: "2.4 MB" },
      { name: "captura_chatbot.png", time: "Subido hace 1 hora", size: "850 KB" }
    ],
    votingMethod: "Simple",
    initialMessages: [
      { role: "Demandante", type: "argumento", content: "El diseñador no entregó los archivos fuente prometidos. Solo recibí un PNG." },
      { role: "Demandado", type: "refutación", content: "El acuerdo base solo mencionaba 'activos visuales', no archivos editables." },
      { role: "Sistema", type: "pregunta", content: "IA: ¿Existe algún correo o chat previo donde se especifiquen los formatos?" }
    ]
  },
  {
    id: "2",
    title: "Desacuerdo en código entregado",
    status: "Votación Activa",
    timeRemaining: "1 día",
    amount: "1.2 ETH",
    description: "El código entregado no cumple con todos los requerimientos de la auditoría.",
    objectives: ["Corregir vulnerabilidades críticas"],
    criteria: ["Paso de tests unitarios"],
    votingOptions: ["Liberar fondos", "Ejecutar slashing"],
    votingMethod: "Cuadrática",
    initialMessages: [
      { role: "Demandante", type: "evidencia", content: "Informe de auditoría adjunto: 3 vulnerabilidades críticas encontradas." },
      { role: "Demandado", type: "refutación", content: "Esas vulnerabilidades son del framework utilizado, no de mi lógica de negocio." },
      { role: "Sistema", type: "argumento", content: "IA: El contrato especificaba 'Zero Critical Vulnerabilities' independientemente del origen." }
    ]
  },
  {
    id: "3",
    title: "Falla en Servicio de Hosting",
    status: "En Mediación",
    timeRemaining: "5 horas",
    amount: "0.15 ETH",
    description: "El servidor estuvo caído durante 48 horas sin aviso previo.",
    objectives: ["Crédito por downtime"],
    criteria: ["Logs de disponibilidad"],
    votingOptions: ["Reembolso parcial", "Crédito 1 mes"],
    votingMethod: "Ponderada",
    initialMessages: [
      { role: "Demandante", type: "argumento", content: "Mi tienda online estuvo offline 2 días completos perdiendo ventas." },
      { role: "Demandado", type: "refutación", content: "Fue un mantenimiento de emergencia por un fallo de hardware global." },
      { role: "Sistema", type: "pregunta", content: "IA: ¿Hubo notificación por correo según la sección 4 de políticas de SLA?" }
    ]
  },
  {
    id: "4",
    title: "Incumplimiento de SLA en API",
    status: "Nueva",
    timeRemaining: "3 días",
    amount: "2.1 ETH",
    description: "La API de pagos falló en el 20% de las transacciones durante el CyberDay.",
    objectives: ["Compensación por pérdida de ventas"],
    criteria: ["Reportes de error HTTP 5xx"],
    votingOptions: ["Sanción contractual", "Mediación técnica"],
    votingMethod: "Consenso",
    initialMessages: [
      { role: "Demandante", type: "evidencia", content: "Logs de servidor muestran 25,000 requests fallidas con código 503." },
      { role: "Demandado", type: "argumento", content: "El tráfico superó los 50.000 req/s, rompiendo los límites del Tier 1." },
      { role: "Sistema", type: "pregunta", content: "IA: ¿Se activó el auto-scaling acordado en el anexo técnico?" }
    ]
  }
];

const DisputeContext = createContext<DisputeContextType | undefined>(undefined);

export function DisputeProvider({ children }: { children: React.ReactNode }) {
  const [disputes, setDisputes] = useState<Disputa[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("alephgov_disputes_v5");
    if (stored) {
      try {
        setDisputes(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored disputes:", e);
        setDisputes(initialMockDisputes);
      }
    } else {
      setDisputes(initialMockDisputes);
    }
    setIsLoaded(true);
  }, []);

  const addDispute = (d: Omit<Disputa, "id">) => {
    const newDispute = { ...d, id: Date.now().toString() };
    setDisputes((prev) => {
      const updated = [newDispute, ...prev];
      localStorage.setItem("alephgov_disputes_v5", JSON.stringify(updated));
      return updated;
    });
  };

  const removeDispute = (id: string) => {
    setDisputes((prev) => {
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem("alephgov_disputes_v5", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <DisputeContext.Provider value={{ disputes, addDispute, removeDispute, isLoaded }}>
      {children}
    </DisputeContext.Provider>
  );
}

export function useDisputes() {
  const context = useContext(DisputeContext);
  if (!context) throw new Error("useDisputes must be used within DisputeProvider");
  return context;
}

