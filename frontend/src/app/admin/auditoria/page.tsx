"use client";

import { useEffect, useState } from "react";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import EstadoVazio from "@/components/comum/EstadoVazio";
import TituloPagina from "@/components/comum/TituloPagina";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { LogAuditoria } from "@/lib/tipos";

function formatarDataHora(dataHora: string): string {
  return new Date(dataHora).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
}

export default function PaginaAdminAuditoria() {
  const [registros, setRegistros] = useState<LogAuditoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    api<LogAuditoria[]>("/admin/auditoria")
      .then((dados) => {
        if (!cancelado) setRegistros(dados);
      })
      .catch((e) => {
        if (!cancelado) setErro(e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.");
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function tentarDeNovo() {
    setErro("");
    setCarregando(true);
    setTentativa((valor) => valor + 1);
  }

  return (
    <div>
      <TituloPagina titulo="Auditoria" />
      <p className="mb-4 text-[13px] text-muted-foreground">
        Últimas 200 operações de criação, alteração e exclusão, da mais recente para a mais antiga.
      </p>

      {carregando && (
        <EstadoCarregando>
          <div className="grid gap-2">
            {[0, 1, 2, 3, 4, 5].map((indice) => (
              <Skeleton key={indice} className="h-10 w-full" />
            ))}
          </div>
        </EstadoCarregando>
      )}

      {!carregando && erro !== "" && <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />}

      {!carregando && erro === "" && registros.length === 0 && (
        <EstadoVazio titulo="Nenhum registro" texto="Ainda não houve operações registradas." />
      )}

      {!carregando && erro === "" && registros.length > 0 && (
        <div className="overflow-x-auto rounded-[10px] border border-border">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-3 py-3 font-medium">Data e hora</th>
                <th className="px-3 py-3 font-medium">Usuário</th>
                <th className="px-3 py-3 font-medium">Operação</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {formatarDataHora(registro.dataHora)}
                  </td>
                  <td className="px-3 py-2.5">
                    {registro.usuarioId === null ? (
                      <span className="text-muted-foreground">Visitante</span>
                    ) : (
                      <span className="font-semibold">
                        {registro.nomeUsuario ?? "Usuário removido"}
                        <span className="ml-1.5 font-mono text-[11px] font-normal text-muted-foreground">
                          #{registro.usuarioId}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">
                    <span className="mr-2 font-semibold">{registro.metodo}</span>
                    <span className="text-muted-foreground">{registro.rota}</span>
                  </td>
                  <td
                    className={`px-3 py-2.5 font-mono text-xs ${
                      registro.status < 400 ? "text-zerado" : "text-destructive"
                    }`}
                  >
                    {registro.status}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{registro.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
