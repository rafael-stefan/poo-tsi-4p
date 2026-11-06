"use client";

import Link from "next/link";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import TituloPagina from "@/components/comum/TituloPagina";
import FormularioDadosPerfil from "@/components/perfil/FormularioDadosPerfil";
import FormularioSenha from "@/components/perfil/FormularioSenha";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "@/contexto/UsuarioContexto";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="grid content-start gap-5">
      <h2 className="font-meta text-xs tracking-[0.08em] text-muted-foreground uppercase">{titulo}</h2>
      {children}
    </section>
  );
}

export default function PaginaEditarPerfil() {
  const { usuario, carregando } = useUsuario();

  return (
    <div>
      <TituloPagina titulo="Editar perfil">
        <Button asChild variant="outline">
          <Link href="/perfil/me">Voltar ao perfil</Link>
        </Button>
      </TituloPagina>
      {carregando || usuario === null ? (
        <EstadoCarregando>
          <div className="grid max-w-md gap-4">
            <Skeleton className="h-16 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </EstadoCarregando>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <Secao titulo="Dados do perfil">
            <FormularioDadosPerfil usuario={usuario} />
          </Secao>
          <Secao titulo="Trocar senha">
            <FormularioSenha />
          </Secao>
        </div>
      )}
    </div>
  );
}
