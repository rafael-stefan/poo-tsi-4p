"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Jogo, Plataforma } from "@/lib/tipos";

type FiltrosCatalogoProps = {
  genero: string;
  plataforma: string;
  aoFiltrar: (chave: string, valor: string) => void;
};

function Pilula({
  ativa,
  aoClicar,
  children,
}: {
  ativa: boolean;
  aoClicar: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-pressed={ativa}
      className={`rounded-full border px-3.5 py-[7px] text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        ativa
          ? "border-foreground bg-foreground font-semibold text-background"
          : "border-border bg-card font-medium text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function FiltrosCatalogo({ genero, plataforma, aoFiltrar }: FiltrosCatalogoProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [generos, setGeneros] = useState<string[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

  useEffect(() => {
    api<Jogo[]>("/jogos")
      .then((jogos) => setTotal(jogos.length))
      .catch(() => setTotal(null));
    api<string[]>("/jogos/generos")
      .then(setGeneros)
      .catch(() => setGeneros([]));
    api<Plataforma[]>("/jogos/plataformas")
      .then(setPlataformas)
      .catch(() => setPlataformas([]));
  }, []);

  const semFiltro = genero === "" && plataforma === "";

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros do catálogo">
      <Pilula ativa={semFiltro} aoClicar={() => aoFiltrar("", "")}>
        Todos
        {total !== null && <em className="ml-1.5 font-meta text-[11px] not-italic opacity-70">{total}</em>}
      </Pilula>
      {generos.map((nome) => (
        <Pilula key={nome} ativa={genero === nome} aoClicar={() => aoFiltrar("genero", nome)}>
          {nome}
        </Pilula>
      ))}
      {plataformas.map((item) => (
        <Pilula
          key={item.codigo}
          ativa={plataforma === item.codigo}
          aoClicar={() => aoFiltrar("plataforma", item.codigo)}
        >
          {item.nome}
        </Pilula>
      ))}
    </div>
  );
}
