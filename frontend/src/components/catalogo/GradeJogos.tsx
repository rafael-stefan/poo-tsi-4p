"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardJogo from "@/components/comum/CardJogo";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import EstadoVazio from "@/components/comum/EstadoVazio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { Jogo } from "@/lib/tipos";

type GradeJogosProps = {
  titulo: string;
  genero: string;
  plataforma: string;
};

const classeGrade =
  "grid grid-cols-2 gap-x-[18px] gap-y-[22px] min-[701px]:grid-cols-4 min-[1101px]:grid-cols-6";

function montarCaminho(titulo: string, genero: string, plataforma: string): string {
  const consulta = new URLSearchParams();
  if (titulo !== "") consulta.set("titulo", titulo);
  if (genero !== "") consulta.set("genero", genero);
  if (plataforma !== "") consulta.set("plataforma", plataforma);
  return "/jogos?" + consulta.toString();
}

export default function GradeJogos({ titulo, genero, plataforma }: GradeJogosProps) {
  const [jogos, setJogos] = useState<Jogo[] | null>(null);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    api<Jogo[]>(montarCaminho(titulo, genero, plataforma))
      .then((dados) => {
        if (!cancelado) setJogos(dados);
      })
      .catch((falha) => {
        if (cancelado) return;
        setErro(falha instanceof ErroApi ? falha.mensagem : "Algo deu errado. Tente de novo.");
      });
    return () => {
      cancelado = true;
    };
  }, [titulo, genero, plataforma, tentativa]);

  function tentarDeNovo() {
    setErro("");
    setJogos(null);
    setTentativa(tentativa + 1);
  }

  const aviso = titulo !== "" && (
    <p className="mb-5 flex flex-wrap items-baseline gap-x-3 text-[15px]">
      <span>Resultados para &ldquo;{titulo}&rdquo;</span>
      <Link href="/jogos" className="font-meta text-[11px] tracking-[0.06em] text-primary uppercase hover:underline">
        limpar busca
      </Link>
    </p>
  );

  if (erro !== "") {
    return (
      <>
        {aviso}
        <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />
      </>
    );
  }

  if (jogos === null) {
    return (
      <>
        {aviso}
        <EstadoCarregando>
          <div className={classeGrade}>
            {Array.from({ length: 12 }, (_, indice) => (
              <div key={indice} className="grid content-start gap-1.5">
                <Skeleton className="aspect-[3/4] w-full rounded-[6px]" />
                <Skeleton className="mt-1 h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </EstadoCarregando>
      </>
    );
  }

  if (jogos.length === 0) {
    return (
      <>
        {aviso}
        <EstadoVazio
          titulo="Nenhum jogo encontrado"
          texto="Tente outra busca ou tire os filtros para ver o catálogo inteiro."
          acao={
            <Button variant="outline" asChild>
              <Link href="/jogos">Limpar filtros</Link>
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      {aviso}
      <div className={classeGrade}>
        {jogos.map((jogo) => (
          <CardJogo
            key={jogo.id}
            id={jogo.id}
            titulo={jogo.titulo}
            capa={jogo.capa}
            nota={jogo.totalAvaliacoes === 0 ? null : jogo.notaMedia}
          >
            <div className="flex items-center justify-between gap-2 font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
              <span className="truncate">{jogo.genero ?? "Sem gênero"}</span>
              <span>{jogo.totalAvaliacoes}</span>
            </div>
          </CardJogo>
        ))}
      </div>
    </>
  );
}
