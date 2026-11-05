"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const abas = [
  { texto: "Jogos", href: "/admin/jogos" },
  { texto: "Usuários", href: "/admin/usuarios" },
];

export default function NavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex gap-6 border-b border-border" aria-label="Administração">
      {abas.map((aba) => {
        const ativa = pathname === aba.href;
        return (
          <Link
            key={aba.href}
            href={aba.href}
            aria-current={ativa ? "page" : undefined}
            className={`-mb-px border-b-2 py-2.5 font-mono text-xs font-medium tracking-wider uppercase ${
              ativa
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {aba.texto}
          </Link>
        );
      })}
    </nav>
  );
}
