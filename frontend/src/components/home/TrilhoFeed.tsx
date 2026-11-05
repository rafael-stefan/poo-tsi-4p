"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import ItemFeed from "@/components/home/ItemFeed";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { ItemFeed as ItemFeedTipo } from "@/lib/tipos";

type Escopo = "amigos" | "comunidade";

const chaveEscopo = "gamelog.feed.escopo";

const opcoes: { valor: Escopo; rotulo: string }[] = [
  { valor: "amigos", rotulo: "Amigos" },
  { valor: "comunidade", rotulo: "Comunidade" },
];

function lerEscopoSalvo(): Escopo {
  try {
    return localStorage.getItem(chaveEscopo) === "comunidade" ? "comunidade" : "amigos";
  } catch {
    return "amigos";
  }
}

function salvarEscopo(escopo: Escopo) {
  try {
    localStorage.setItem(chaveEscopo, escopo);
  } catch {
    return;
  }
}

export default function TrilhoFeed() {
  const [escopo, setEscopo] = useState<Escopo | null>(null);
  const [itens, setItens] = useState<ItemFeedTipo[] | null>(null);
  const [limite, setLimite] = useState(10);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const salvo = lerEscopoSalvo();
    const temporizador = setTimeout(() => setEscopo(salvo), 0);
    return () => clearTimeout(temporizador);
  }, []);

  useEffect(() => {
    if (escopo === null) return;
    let cancelado = false;
    api<ItemFeedTipo[]>("/feed?escopo=" + escopo)
      .then((dados) => {
        if (!cancelado) setItens(dados);
      })
      .catch((falha) => {
        if (cancelado) return;
        setErro(falha instanceof ErroApi ? falha.mensagem : "Algo deu errado. Tente de novo.");
      });
    return () => {
      cancelado = true;
    };
  }, [escopo, tentativa]);

  function trocarEscopo(novo: Escopo) {
    if (novo === escopo) return;
    salvarEscopo(novo);
    setErro("");
    setItens(null);
    setLimite(10);
    setEscopo(novo);
  }

  function tentarDeNovo() {
    setErro("");
    setItens(null);
    setTentativa(tentativa + 1);
  }

  let conteudo: React.ReactNode;

  if (erro !== "") {
    conteudo = <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />;
  } else if (itens === null) {
    conteudo = (
      <EstadoCarregando>
        {Array.from({ length: 4 }, (_, indice) => (
          <div key={indice} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-border py-4">
            <Skeleton className="size-[34px] rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </EstadoCarregando>
    );
  } else if (itens.length === 0) {
    conteudo =
      escopo === "amigos" ? (
        <div className="flex flex-col items-start gap-3 rounded-[10px] border border-dashed border-border px-5 py-8">
          <h3 className="font-display text-2xl uppercase">Seus amigos ainda não registraram nada</h3>
          <p className="text-muted-foreground">
            Quando eles começarem, zerarem ou avaliarem um jogo, vai aparecer aqui.
          </p>
          <Button variant="outline" asChild>
            <Link href="/amigos">Encontrar amigos</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-[10px] border border-dashed border-border px-5 py-8">
          <h3 className="font-display text-2xl uppercase">Ainda não há atividade</h3>
        </div>
      );
  } else {
    conteudo = (
      <div>
        <ul>
          {itens.slice(0, limite).map((item, indice) => (
            <ItemFeed key={indice} item={item} linkarPerfil={escopo === "amigos"} />
          ))}
        </ul>
        {itens.length > limite && (
          <Button variant="outline" className="mt-4 w-full" onClick={() => setLimite(limite + 10)}>
            Mostrar mais
          </Button>
        )}
      </div>
    );
  }

  return (
    <section aria-label="Feed de atividade">
      <div role="group" aria-label="Escopo do feed" className="mb-[18px] inline-flex rounded-full bg-card p-1">
        {opcoes.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={escopo === opcao.valor}
            onClick={() => trocarEscopo(opcao.valor)}
            className={`rounded-full px-4 py-[7px] font-meta text-xs font-semibold tracking-[0.06em] uppercase transition-colors ${
              escopo === opcao.valor ? "bg-primary text-[#14040a]" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>
      {conteudo}
    </section>
  );
}
