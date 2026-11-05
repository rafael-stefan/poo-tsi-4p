"use client";

import { useState } from "react";
import CardJogo from "@/components/comum/CardJogo";
import EstadoVazio from "@/components/comum/EstadoVazio";
import { nomeStatus } from "@/lib/formato";
import type { Registro, StatusJogo } from "@/lib/tipos";

type JogosPorStatusProps = {
  jogosPorStatus: Partial<Record<StatusJogo, Registro[]>>;
};

const ordem: StatusJogo[] = ["ZERADO", "JOGANDO", "REJOGANDO", "DESISTIDO"];

export default function JogosPorStatus({ jogosPorStatus }: JogosPorStatusProps) {
  const primeiroComItens = ordem.find((status) => (jogosPorStatus[status] ?? []).length > 0);
  const [selecionado, setSelecionado] = useState<StatusJogo>(primeiroComItens ?? "ZERADO");
  const registros = jogosPorStatus[selecionado] ?? [];

  return (
    <section aria-label="Jogos por status">
      <div className="mb-[18px] flex flex-wrap gap-2">
        {ordem.map((status) => {
          const ativo = status === selecionado;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={ativo}
              onClick={() => setSelecionado(status)}
              className={`cursor-pointer rounded-full border px-3.5 py-[7px] text-[13px] transition-colors ${
                ativo
                  ? "border-foreground bg-foreground font-semibold text-background"
                  : "border-border bg-card font-medium text-muted-foreground hover:text-foreground"
              }`}
            >
              {nomeStatus(status)}
              <em className="ml-1.5 font-meta text-[11px] not-italic opacity-70">
                {(jogosPorStatus[status] ?? []).length}
              </em>
            </button>
          );
        })}
      </div>
      {registros.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum jogo aqui"
          texto={"Nenhuma run com o status " + nomeStatus(selecionado).toLowerCase() + "."}
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] md:grid-cols-4 lg:grid-cols-6">
          {registros.map((registro) => (
            <CardJogo
              key={registro.id}
              id={registro.jogoId}
              titulo={registro.tituloJogo}
              capa={registro.capaJogo}
              nota={registro.nota}
            />
          ))}
        </div>
      )}
    </section>
  );
}
