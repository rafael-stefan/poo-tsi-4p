"use client";

import { useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/comum/Avatar";
import StatusRun from "@/components/comum/StatusRun";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";
import { formatarData, formatarNota, nomeStatus } from "@/lib/formato";
import type { Avaliacao } from "@/lib/tipos";

type ListaAvaliacoesProps = {
  avaliacoes: Avaliacao[];
  aoExcluir: () => void;
};

export default function ListaAvaliacoes({ avaliacoes, aoExcluir }: ListaAvaliacoesProps) {
  const { usuario } = useUsuario();
  const [alvo, setAlvo] = useState<Avaliacao | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  async function excluir() {
    if (alvo === null) return;
    setExcluindo(true);
    try {
      await api<void>("/admin/avaliacoes/" + alvo.id, { metodo: "DELETE" });
      setAlvo(null);
      toast("Avaliação excluída");
      aoExcluir();
    } catch (erro) {
      toast.error(erro instanceof ErroApi ? erro.mensagem : "Não foi possível excluir a avaliação.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <section>
      <div className="mt-[30px] mb-3.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5 min-[1101px]:mt-8">
        <h2 className="text-[22px] font-extrabold">Avaliações</h2>
        <span className="text-lg text-muted-foreground">{avaliacoes.length} da comunidade</span>
      </div>

      {avaliacoes.length === 0 && (
        <p className="border-t border-border py-[18px] text-muted-foreground">Ninguém avaliou este jogo ainda.</p>
      )}

      <div className="grid">
        {avaliacoes.map((avaliacao) => (
          <article key={avaliacao.id} className="grid gap-2 border-t border-border py-[18px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <Avatar nome={avaliacao.autorNome} />
              <b>{avaliacao.autorNome}</b>
              <StatusRun
                status={avaliacao.statusRun}
                texto={
                  nomeStatus(avaliacao.statusRun) + (avaliacao.horasJogo !== null ? " · " + avaliacao.horasJogo + "h" : "")
                }
              />
              <span className="ml-auto rounded-full border-[1.5px] border-primary px-2.5 py-px text-sm font-extrabold tabular-nums">
                {formatarNota(avaliacao.nota)}
              </span>
            </div>
            {avaliacao.comentario && (
              <p className="max-w-[64ch] font-texto text-lg leading-[1.45] text-[#dcdce2] [overflow-wrap:anywhere]">
                {avaliacao.comentario}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                {formatarData(avaliacao.dataAvaliacao)}
              </span>
              {usuario !== null && usuario.admin && (
                <Button variant="destructive" size="sm" onClick={() => setAlvo(avaliacao)}>
                  Excluir
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>

      <AlertDialog open={alvo !== null} onOpenChange={(aberto) => !aberto && setAlvo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
            <AlertDialogDescription>
              {alvo !== null && "A avaliação de " + alvo.autorNome + " será removida. Essa ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={excluir} disabled={excluindo}>
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
