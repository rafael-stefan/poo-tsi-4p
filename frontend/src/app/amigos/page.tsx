"use client";

import { useEffect, useState } from "react";
import BuscaUsuarios from "@/components/amigos/BuscaUsuarios";
import ListaAmigos from "@/components/amigos/ListaAmigos";
import PedidosAmizade from "@/components/amigos/PedidosAmizade";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import TituloPagina from "@/components/comum/TituloPagina";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { Amigo, Amizade } from "@/lib/tipos";

function EsqueletoAmigos() {
  return (
    <EstadoCarregando>
      <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-4">
          {[0, 1, 2, 3].map((indice) => (
            <div key={indice} className="flex items-center gap-3.5">
              <Skeleton className="size-11 rounded-full" />
              <div className="grid gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid content-start gap-4 border-dashed border-border lg:border-l lg:pl-7">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </EstadoCarregando>
  );
}

type Listas = {
  amigos: Amigo[];
  recebidos: Amizade[];
  enviados: Amizade[];
};

async function buscarListas(): Promise<Listas> {
  const [amigos, recebidos, enviados] = await Promise.all([
    api<Amigo[]>("/amizades"),
    api<Amizade[]>("/amizades/pedidos/recebidos"),
    api<Amizade[]>("/amizades/pedidos/enviados"),
  ]);
  return { amigos, recebidos, enviados };
}

function mensagemDoErro(e: unknown): string {
  return e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.";
}

export default function PaginaAmigos() {
  const [listas, setListas] = useState<Listas>({ amigos: [], recebidos: [], enviados: [] });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    buscarListas()
      .then((dados) => {
        if (!cancelado) setListas(dados);
      })
      .catch((e) => {
        if (!cancelado) setErro(mensagemDoErro(e));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  async function recarregar() {
    try {
      setListas(await buscarListas());
      setErro(null);
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  }

  function tentarDeNovo() {
    setErro(null);
    setCarregando(true);
    setTentativa((valor) => valor + 1);
  }

  return (
    <div>
      <TituloPagina titulo="Amigos" />
      {carregando ? (
        <EsqueletoAmigos />
      ) : erro !== null ? (
        <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />
      ) : (
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_380px]">
          <ListaAmigos amigos={listas.amigos} />
          <div className="grid content-start gap-7 border-dashed border-border lg:border-l lg:pl-7">
            <PedidosAmizade recebidos={listas.recebidos} enviados={listas.enviados} aoMudar={recarregar} />
            <BuscaUsuarios
              idsAmigos={listas.amigos.map((item) => item.amigo.id)}
              idsEnviados={listas.enviados.map((item) => item.destinatario.id)}
              idsRecebidos={listas.recebidos.map((item) => item.solicitante.id)}
              aoMudar={recarregar}
            />
          </div>
        </div>
      )}
    </div>
  );
}
