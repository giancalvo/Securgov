"use client";

import { useState } from "react";
import { Wallet, Scale, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500); // Simulate MetaMask delay
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center flex-row justify-between px-4 md:px-6 max-w-6xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer">
          <Scale className="h-6 w-6 text-indigo-500" />
          <span>Segcur<span className="text-zinc-500 font-light">Gov</span></span>
        </Link>
        <nav className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 px-4 py-2 text-sm font-medium text-indigo-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              0x123...456
            </div>
          ) : (
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer disabled:opacity-70 shimmer-effect spring-hover active:scale-90 border-none"
            >
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              {isConnecting ? "Conectando..." : "Conectar Wallet"}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
