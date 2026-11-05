"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon, SearchIcon } from "lucide-react";
import MenuUsuario from "@/components/layout/MenuUsuario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUsuario } from "@/contexto/UsuarioContexto";

type LinkNavegacao = {
  texto: string;
  href: string;
};

function BuscaJogos({ aoEnviar }: { aoEnviar?: () => void }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");

  function buscar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const termo = titulo.trim();
    router.push(termo ? "/jogos?titulo=" + encodeURIComponent(termo) : "/jogos");
    if (aoEnviar) {
      aoEnviar();
    }
  }

  return (
    <form onSubmit={buscar} className="relative" role="search">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={titulo}
        onChange={(evento) => setTitulo(evento.target.value)}
        placeholder="Buscar jogos…"
        name="titulo"
        aria-label="Buscar jogos"
        className="h-9 w-full rounded-full bg-card pl-9 text-[13px] md:w-[220px]"
      />
    </form>
  );
}

export default function Navbar() {
  const { usuario, carregando } = useUsuario();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const links: LinkNavegacao[] = [
    { texto: "Início", href: "/" },
    { texto: "Jogos", href: "/jogos" },
  ];
  if (usuario !== null) {
    links.push({ texto: "Biblioteca", href: "/biblioteca" });
    links.push({ texto: "Amigos", href: "/amigos" });
  }

  function estaAtivo(href: string): boolean {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-3.5 md:px-8 md:py-[18px]">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-[28px] leading-none uppercase">
            Game<span className="text-primary">Log</span>
          </Link>
          <nav className="hidden items-center gap-2 font-medium md:flex" aria-label="Principal">
            {links.map((link, indice) => (
              <span key={link.href} className="flex items-center gap-2">
                {indice > 0 && <span className="text-border">/</span>}
                <Link
                  href={link.href}
                  className={estaAtivo(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
                >
                  {link.texto}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <BuscaJogos />
          </div>
          {!carregando && usuario === null && (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" className="h-9" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button className="h-9" asChild>
                <Link href="/cadastro">Criar conta</Link>
              </Button>
            </div>
          )}
          <MenuUsuario />
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="gap-0"
              onOpenAutoFocus={(evento) => evento.preventDefault()}
            >
              <SheetHeader>
                <SheetTitle className="font-display text-2xl uppercase">
                  Game<span className="text-primary">Log</span>
                </SheetTitle>
                <SheetDescription className="sr-only">Menu de navegação</SheetDescription>
              </SheetHeader>
              <div className="grid gap-5 px-4 pb-6">
                <BuscaJogos aoEnviar={() => setMenuAberto(false)} />
                <nav className="grid" aria-label="Principal">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuAberto(false)}
                      className={`border-b border-border py-3 font-medium ${
                        estaAtivo(link.href) ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {link.texto}
                    </Link>
                  ))}
                </nav>
                {!carregando && usuario === null && (
                  <div className="grid gap-2">
                    <Button variant="outline" asChild onClick={() => setMenuAberto(false)}>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button asChild onClick={() => setMenuAberto(false)}>
                      <Link href="/cadastro">Criar conta</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
