import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono, Newsreader } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Rodape from "@/components/layout/Rodape";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UsuarioProvider } from "@/contexto/UsuarioContexto";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameLog",
  description: "Registre os jogos que você joga, avalie e veja o que seus amigos estão jogando.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${anton.variable} ${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <UsuarioProvider>
          <TooltipProvider>
            <Navbar />
            <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 pt-5 pb-7 md:px-8 md:pt-7 md:pb-9">
              {children}
            </main>
            <Rodape />
          </TooltipProvider>
          <Toaster theme="dark" />
        </UsuarioProvider>
      </body>
    </html>
  );
}
