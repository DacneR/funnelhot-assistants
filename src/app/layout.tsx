import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O la fuente que prefieras
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestión Asistentes IA - Funnelhot",
  description: "Módulo de administración de asistentes virtuales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}