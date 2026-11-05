"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import AvaliacoesPerfil from "@/components/perfil/AvaliacoesPerfil";
import CabecalhoPerfil from "@/components/perfil/CabecalhoPerfil";
import JogosPorStatus from "@/components/perfil/JogosPorStatus";
import NumerosPerfil from "@/components/perfil/NumerosPerfil";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { Perfil } from "@/lib/tipos";

function EsqueletoPerfil() {
  return (
    <EstadoCarregando>
      <div className="flex items-center gap-[22px] border-b border-border pb-[22px]">
        <Skeleton className="size-[84px] rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
      <div className="mb-[22px] grid grid-cols-2 border-b border-border md:grid-cols-3 lg:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((indice) => (
          <div key={indice} className="grid gap-2 px-4 py-[18px]">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] md:grid-cols-4 lg:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((indice) => (
          <Skeleton key={indice} className="aspect-[3/4] w-full" />
        ))}
      </div>
    </EstadoCarregando>
  );
}

function ConteudoPerfil({ id }: { id: string }) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<ErroApi | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    const caminho = id === "me" ? "/usuarios/me/perfil" : "/usuarios/" + id + "/perfil";
    api<Perfil>(caminho)
      .then((dados) => {
        if (!cancelado) setPerfil(dados);
      })
      .catch((e) => {
        if (!cancelado) setErro(e instanceof ErroApi ? e : new ErroApi(0, "Algo deu errado. Tente de novo."));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [id, tentativa]);

  function tentarDeNovo() {
    setErro(null);
    setCarregando(true);
    setTentativa((valor) => valor + 1);
  }

  if (carregando) {
    return <EsqueletoPerfil />;
  }

  if (erro !== null && erro.status === 404) {
    return (
      <div className="flex flex-col items-start gap-5 py-10">
        <span className="font-meta text-xs tracking-[0.08em] text-muted-foreground uppercase">Perfil</span>
        <h1 className="font-display text-[clamp(42px,8vw,96px)] leading-[0.9] uppercase">Perfil não disponível</h1>
        <p className="max-w-xl font-texto text-xl text-muted-foreground">Só amigos podem ver o perfil.</p>
        <Button asChild>
          <Link href="/amigos">Ir para amigos</Link>
        </Button>
      </div>
    );
  }

  if (erro !== null || perfil === null) {
    return <EstadoErro mensagem={erro?.mensagem ?? "Algo deu errado. Tente de novo."} aoTentarDeNovo={tentarDeNovo} />;
  }

  return (
    <div>
      <CabecalhoPerfil usuario={perfil.usuario} amizade={perfil.amizade} />
      <NumerosPerfil estatisticas={perfil.estatisticas} totalAvaliacoes={perfil.avaliacoes.length} />
      <JogosPorStatus jogosPorStatus={perfil.jogosPorStatus} />
      <AvaliacoesPerfil avaliacoes={perfil.avaliacoes} />
    </div>
  );
}

export default function PaginaPerfil() {
  const parametros = useParams<{ id: string }>();
  return <ConteudoPerfil key={parametros.id} id={parametros.id} />;
}
