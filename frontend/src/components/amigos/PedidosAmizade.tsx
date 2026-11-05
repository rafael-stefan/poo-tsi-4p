"use client";

import { useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/comum/Avatar";
import { Button } from "@/components/ui/button";
import { api, ErroApi } from "@/lib/api";
import { tempoRelativo } from "@/lib/formato";
import type { Amizade } from "@/lib/tipos";

type PedidosAmizadeProps = {
  recebidos: Amizade[];
  enviados: Amizade[];
  aoMudar: () => Promise<void>;
};

export default function PedidosAmizade({ recebidos, enviados, aoMudar }: PedidosAmizadeProps) {
  const [ocupado, setOcupado] = useState<number | null>(null);

  async function executar(amizade: Amizade, caminho: string, metodo: string, mensagem: string) {
    setOcupado(amizade.id);
    try {
      await api<unknown>(caminho, { metodo });
      toast.success(mensagem);
    } catch (erro) {
      toast.error(erro instanceof ErroApi ? erro.mensagem : "Não foi possível concluir a ação.");
    }
    await aoMudar();
    setOcupado(null);
  }

  return (
    <div className="grid gap-7">
      <section aria-label="Pedidos recebidos">
        <div className="mb-1.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5">
          <h2 className="text-[22px] font-extrabold">Recebidos</h2>
          <span className="text-lg text-muted-foreground">{recebidos.length}</span>
        </div>
        {recebidos.length === 0 ? (
          <p className="py-3.5 text-sm text-muted-foreground">Nenhum pedido recebido.</p>
        ) : (
          <ul>
            {recebidos.map((pedido) => (
              <li key={pedido.id} className="grid gap-3 border-b border-border py-4">
                <div className="flex items-center gap-3">
                  <Avatar nome={pedido.solicitante.nome} fotoPerfil={pedido.solicitante.fotoPerfil} className="size-10" />
                  <div className="grid min-w-0 gap-0.5">
                    <span className="truncate font-bold">{pedido.solicitante.nome}</span>
                    <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                      {tempoRelativo(pedido.data)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    disabled={ocupado === pedido.id}
                    onClick={() =>
                      executar(
                        pedido,
                        "/amizades/" + pedido.id + "/aceitar",
                        "PATCH",
                        "Agora você e " + pedido.solicitante.nome + " são amigos"
                      )
                    }
                  >
                    Aceitar
                  </Button>
                  <Button
                    variant="outline"
                    disabled={ocupado === pedido.id}
                    onClick={() => executar(pedido, "/amizades/" + pedido.id + "/recusar", "PATCH", "Pedido recusado")}
                  >
                    Recusar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Pedidos enviados">
        <div className="mb-1.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5">
          <h2 className="text-[22px] font-extrabold">Enviados</h2>
          <span className="text-lg text-muted-foreground">{enviados.length}</span>
        </div>
        {enviados.length === 0 ? (
          <p className="py-3.5 text-sm text-muted-foreground">Nenhum pedido enviado.</p>
        ) : (
          <ul>
            {enviados.map((pedido) => (
              <li key={pedido.id} className="flex items-center justify-between gap-3 border-b border-border py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar nome={pedido.destinatario.nome} fotoPerfil={pedido.destinatario.fotoPerfil} className="size-10" />
                  <div className="grid min-w-0 gap-0.5">
                    <span className="truncate font-bold">{pedido.destinatario.nome}</span>
                    <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                      {tempoRelativo(pedido.data)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  disabled={ocupado === pedido.id}
                  onClick={() => executar(pedido, "/amizades/" + pedido.id, "DELETE", "Pedido cancelado")}
                >
                  Cancelar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
