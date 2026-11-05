"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import Capa from "@/components/comum/Capa";
import EstadoVazio from "@/components/comum/EstadoVazio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatarNota, nomePlataforma } from "@/lib/formato";
import type { Jogo } from "@/lib/tipos";

type TabelaJogosProps = {
  jogos: Jogo[];
  aoEditar: (jogo: Jogo) => void;
  aoRemover: (jogo: Jogo) => void;
};

export default function TabelaJogos({ jogos, aoEditar, aoRemover }: TabelaJogosProps) {
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLowerCase();
  const filtrados = jogos.filter((jogo) => jogo.titulo.toLowerCase().includes(termo));

  return (
    <div className="grid gap-4">
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="busca"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar por título"
          aria-label="Buscar jogo por título"
          className="h-10 bg-card pl-9"
        />
      </div>

      {filtrados.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum jogo"
          texto={
            jogos.length === 0
              ? "O catálogo ainda está vazio. Cadastre o primeiro jogo."
              : "Nenhum jogo com esse título no catálogo."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-border">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="w-16 px-3 py-3 font-medium">Capa</th>
                <th className="px-3 py-3 font-medium">Título</th>
                <th className="px-3 py-3 font-medium">Gênero</th>
                <th className="px-3 py-3 font-medium">Plataformas</th>
                <th className="px-3 py-3 font-medium">Ano</th>
                <th className="px-3 py-3 font-medium">Nota</th>
                <th className="px-3 py-3 font-medium">Avaliações</th>
                <th className="px-3 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((jogo) => (
                <tr key={jogo.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5">
                    <div className="w-10">
                      <Capa titulo={jogo.titulo} capa={jogo.capa} tamanho="pequeno" />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-semibold">{jogo.titulo}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{jogo.genero ?? "–"}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {jogo.plataformas.length > 0
                      ? jogo.plataformas.map(nomePlataforma).join(", ")
                      : "–"}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {jogo.anoLancamento ?? "–"}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">{formatarNota(jogo.totalAvaliacoes > 0 ? jogo.notaMedia : null)}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {jogo.totalAvaliacoes}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => aoEditar(jogo)}
                        aria-label={"Editar " + jogo.titulo}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => aoRemover(jogo)}
                        aria-label={"Remover " + jogo.titulo}
                      >
                        Remover
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
