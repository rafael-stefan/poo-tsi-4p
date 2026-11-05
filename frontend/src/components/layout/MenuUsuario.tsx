"use client";

import Link from "next/link";
import Avatar from "@/components/comum/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsuario } from "@/contexto/UsuarioContexto";

export default function MenuUsuario() {
  const { usuario, sair } = useUsuario();

  if (usuario === null) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Menu do usuário"
      >
        <Avatar nome={usuario.nome} fotoPerfil={usuario.fotoPerfil} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="truncate">{usuario.nome}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil/me">Meu perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/biblioteca">Biblioteca</Link>
        </DropdownMenuItem>
        {usuario.admin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Administração</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={sair}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
