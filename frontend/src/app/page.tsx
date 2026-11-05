"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import DestaquesLista from "@/components/home/DestaquesLista";
import Manchete from "@/components/home/Manchete";
import MaisBemAvaliados from "@/components/home/MaisBemAvaliados";
import NovosNoCatalogo from "@/components/home/NovosNoCatalogo";
import TrilhoFeed from "@/components/home/TrilhoFeed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";
import type { Destaques, Jogo } from "@/lib/tipos";

export default function Home() {
  const { usuario, carregando } = useUsuario();
  const [destaques, setDestaques] = useState<Destaques | null>(null);
  const [novos, setNovos] = useState<Jogo[]>([]);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    Promise.all([api<Destaques>("/destaques"), api<Jogo[]>("/jogos?ordem=recentes")])
      .then(([dadosDestaques, dadosJogos]) => {
        if (cancelado) return;
        setDestaques(dadosDestaques);
        setNovos(dadosJogos.slice(0, 6));
      })
      .catch((falha) => {
        if (cancelado) return;
        setErro(falha instanceof ErroApi ? falha.mensagem : "Algo deu errado. Tente de novo.");
      });
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function tentarDeNovo() {
    setErro("");
    setDestaques(null);
    setTentativa(tentativa + 1);
  }

  let conteudo: React.ReactNode;

  if (erro !== "") {
    conteudo = <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />;
  } else if (destaques === null) {
    conteudo = (
      <EstadoCarregando>
        <div className="grid items-end gap-6 border-b border-border pb-[26px] max-[700px]:grid-cols-1 min-[701px]:grid-cols-[220px_minmax(0,1fr)]">
          <Skeleton className="aspect-[3/4] w-full max-w-[200px] rounded-[6px] min-[701px]:max-w-none" />
          <div className="grid gap-3">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-3/4" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-[18px] gap-y-[22px] min-[1101px]:grid-cols-6">
          {Array.from({ length: 6 }, (_, indice) => (
            <div key={indice} className="grid content-start gap-1.5">
              <Skeleton className="aspect-[3/4] w-full rounded-[6px]" />
              <Skeleton className="mt-1 h-4 w-3/4" />
            </div>
          ))}
        </div>
      </EstadoCarregando>
    );
  } else {
    conteudo = (
      <>
        <Manchete destaque={destaques.manchete} />
        <DestaquesLista destaques={destaques} />
        <NovosNoCatalogo jogos={novos} />
      </>
    );
  }

  let trilho: React.ReactNode;

  if (carregando) {
    trilho = (
      <EstadoCarregando>
        <Skeleton className="mb-[18px] h-10 w-52 rounded-full" />
        {Array.from({ length: 4 }, (_, indice) => (
          <div key={indice} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-border py-4">
            <Skeleton className="size-[34px] rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </EstadoCarregando>
    );
  } else if (usuario !== null) {
    trilho = <TrilhoFeed />;
  } else {
    trilho = (
      <div className="grid gap-6">
        {destaques !== null && <MaisBemAvaliados jogos={destaques.maisBemAvaliados} />}
        <div className="grid gap-3 rounded-[10px] border border-border bg-card p-5">
          <h2 className="font-display text-2xl uppercase">Crie sua conta para acompanhar seus amigos</h2>
          <p className="text-muted-foreground">
            Registre suas runs, avalie jogos e veja o que seus amigos estão jogando.
          </p>
          <Button asChild className="justify-self-start">
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 min-[1101px]:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">{conteudo}</div>
      <aside
        aria-label="Trilho lateral"
        className="min-w-0 border-t border-dashed border-border pt-[22px] min-[1101px]:border-t-0 min-[1101px]:border-l min-[1101px]:pt-0 min-[1101px]:pl-7"
      >
        {trilho}
      </aside>
    </div>
  );
}
