"use client";

import Link from "next/link";
import NavAdmin from "@/components/admin/NavAdmin";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "@/contexto/UsuarioContexto";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { usuario, carregando } = useUsuario();

  if (carregando) {
    return (
      <EstadoCarregando>
        <Skeleton className="mb-6 h-16 w-72" />
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </EstadoCarregando>
    );
  }

  if (usuario === null || !usuario.admin) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-border px-6 py-20 text-center">
        <h1 className="font-display text-5xl uppercase">Acesso restrito</h1>
        <p className="max-w-md text-muted-foreground">
          Esta área é só para administradores do GameLog.
        </p>
        <Button asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <NavAdmin />
      {children}
    </div>
  );
}
