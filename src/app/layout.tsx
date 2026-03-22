import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { DisputeProvider } from "@/context/DisputeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secugob",
  description: "Plataforma de resolución de disputas descentralizada impulsada por gobernanza Web3. Mediación asistida por IA, votación cuadrática, reputación on-chain y evidencias en IPFS.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
        <DisputeProvider>
          <Navbar />
          <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-4 py-8 md:px-6">
            {children}
          </main>
        </DisputeProvider>
      </body>
    </html>
  );
}
