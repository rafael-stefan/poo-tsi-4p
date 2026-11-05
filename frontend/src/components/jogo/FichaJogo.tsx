"use client";

import Link from "next/link";
import DialogoAdicionarRun from "@/components/jogo/DialogoAdicionarRun";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { nomePlataforma } from "@/lib/formato";
import type { Jogo, Registro } from "@/lib/tipos";

type FichaJogoProps = {
  jogo: Jogo;
  registros: Registro[];
  aoAdicionarRun: () => void;
};

export default function FichaJogo({ jogo, registros, aoAdicionarRun }: FichaJogoProps) {
  const { usuario, carregando } = useUsuario();

  const detalhes = [jogo.genero, jogo.anoLancamento].filter((item) => item !== null && item !== "");

  return (
    <div>
      {detalhes.length > 0 && (
        <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
          {detalhes.join(" · ")}
        </span>
      )}
      <h1 className="mt-1.5 mb-3.5 font-display text-5xl leading-[0.9] [overflow-wrap:anywhere] uppercase min-[701px]:text-[76px]">
        {jogo.titulo}
      </h1>
      <dl className="mb-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="pt-0.5 font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
          Desenvolvedora
        </dt>
        <dd>{jogo.desenvolvedora ?? "Não informada"}</dd>
        <dt className="pt-0.5 font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
          Plataformas
        </dt>
        <dd className="flex flex-wrap gap-1.5">
          {jogo.plataformas.length === 0 && <span>Não informadas</span>}
          {jogo.plataformas.map((plataforma) => (
            <span key={plataforma} className="rounded-[4px] border border-border px-2 py-0.5 text-xs font-semibold">
              {nomePlataforma(plataforma)}
            </span>
          ))}
        </dd>
      </dl>
      <div className="flex flex-wrap gap-2.5">
        {carregando && <Skeleton className="h-10 w-56" />}
        {!carregando && usuario === null && (
          <Button asChild>
            <Link href={"/login?voltar=/jogos/" + jogo.id}>Entre para adicionar à biblioteca</Link>
          </Button>
        )}
        {!carregando && usuario !== null && (
          <>
            <DialogoAdicionarRun jogo={jogo} registros={registros} aoAdicionar={aoAdicionarRun} />
            {registros.length > 0 && (
              <Button variant="outline" asChild>
                <Link href={"/biblioteca?jogo=" + jogo.id}>Ver minhas runs ({registros.length})</Link>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
