"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import FormularioAvaliacao from "@/components/biblioteca/FormularioAvaliacao";
import FormularioRun from "@/components/biblioteca/FormularioRun";
import Capa from "@/components/comum/Capa";
import SeloNota from "@/components/comum/SeloNota";
import StatusRun from "@/components/comum/StatusRun";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, ErroApi } from "@/lib/api";
import type { Avaliacao, Registro } from "@/lib/tipos";

type DialogoRunProps = {
  registro: Registro | null;
  aoFechar: () => void;
  aoAlterar: () => void;
};

type ConfirmacaoAberta = "avaliacao" | "run" | null;

type ResultadoAvaliacao = {
  avaliacaoId: number;
  avaliacao: Avaliacao | null;
  erro: string;
};

type SecaoAvaliacaoProps = {
  registro: Registro;
  aoAlterar: () => void;
  aoPedirExclusao: () => void;
};

function SecaoAvaliacao({ registro, aoAlterar, aoPedirExclusao }: SecaoAvaliacaoProps) {
  const [resultado, setResultado] = useState<ResultadoAvaliacao | null>(null);
  const [editando, setEditando] = useState(false);

  const avaliacaoId = registro.avaliacaoId;

  useEffect(() => {
    if (avaliacaoId === null) return;

    let cancelado = false;
    api<Avaliacao[]>("/jogos/" + registro.jogoId + "/avaliacoes")
      .then((lista) => {
        if (!cancelado) {
          const encontrada = lista.find((item) => item.id === avaliacaoId) ?? null;
          setResultado({
            avaliacaoId,
            avaliacao: encontrada,
            erro: encontrada === null ? "Não foi possível carregar a avaliação." : "",
          });
        }
      })
      .catch((erro) => {
        if (!cancelado) {
          const mensagem = erro instanceof ErroApi ? erro.mensagem : "Não foi possível carregar a avaliação.";
          setResultado({ avaliacaoId, avaliacao: null, erro: mensagem });
        }
      });

    return () => {
      cancelado = true;
    };
  }, [registro.jogoId, avaliacaoId]);

  function avaliacaoSalva() {
    toast.success(avaliacaoId === null ? "Avaliação publicada." : "Avaliação atualizada.");
    setEditando(false);
    aoAlterar();
  }

  if (registro.status === "JOGANDO") {
    return <p className="text-sm text-muted-foreground">Termine, rejogue ou desista para avaliar.</p>;
  }

  if (avaliacaoId === null) {
    return <FormularioAvaliacao registroId={registro.id} aoSalvar={avaliacaoSalva} />;
  }

  if (resultado === null || resultado.avaliacaoId !== avaliacaoId) {
    return <p className="text-sm text-muted-foreground">Carregando avaliação…</p>;
  }

  const avaliacao = resultado.avaliacao;

  if (avaliacao === null) {
    return (
      <p role="alert" className="text-[13px] text-destructive">
        {resultado.erro}
      </p>
    );
  }

  if (editando) {
    return (
      <FormularioAvaliacao
        registroId={registro.id}
        avaliacao={avaliacao}
        aoSalvar={avaliacaoSalva}
        aoCancelar={() => setEditando(false)}
      />
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-3.5">
        <SeloNota nota={avaliacao.nota} grande />
        {avaliacao.comentario ? (
          <p className="min-w-0 flex-1 font-texto text-lg leading-[1.45] [overflow-wrap:anywhere] text-[#dcdce2]">
            {avaliacao.comentario}
          </p>
        ) : (
          <p className="self-center text-sm text-muted-foreground">Sem comentário.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setEditando(true)}>
          Editar
        </Button>
        <Button variant="destructive" onClick={aoPedirExclusao}>
          Excluir
        </Button>
      </div>
    </div>
  );
}

export default function DialogoRun({ registro, aoFechar, aoAlterar }: DialogoRunProps) {
  const [confirmacao, setConfirmacao] = useState<ConfirmacaoAberta>(null);
  const [apagando, setApagando] = useState(false);

  const registroId = registro?.id;
  const avaliacaoId = registro?.avaliacaoId ?? null;

  async function excluirAvaliacao() {
    if (avaliacaoId === null) return;
    setApagando(true);
    try {
      await api<void>("/avaliacoes/" + avaliacaoId, { metodo: "DELETE" });
      toast.success("Avaliação excluída.");
      aoAlterar();
    } catch (erro) {
      toast.error(erro instanceof ErroApi ? erro.mensagem : "Não foi possível excluir a avaliação.");
    } finally {
      setApagando(false);
      setConfirmacao(null);
    }
  }

  async function removerRun() {
    if (registroId === undefined) return;
    setApagando(true);
    try {
      await api<void>("/registros/" + registroId, { metodo: "DELETE" });
      toast.success("Run removida da biblioteca.");
      aoFechar();
      aoAlterar();
    } catch (erro) {
      toast.error(erro instanceof ErroApi ? erro.mensagem : "Não foi possível remover a run.");
    } finally {
      setApagando(false);
      setConfirmacao(null);
    }
  }

  return (
    <>
      <Dialog open={registro !== null} onOpenChange={(aberto) => !aberto && aoFechar()}>
        <DialogContent className="max-h-[90dvh] gap-5 overflow-y-auto p-5 sm:max-w-xl">
          {registro && (
            <>
              <DialogHeader className="flex-row items-center gap-3.5 pr-8">
                <div className="w-[54px] shrink-0">
                  <Capa titulo={registro.tituloJogo} capa={registro.capaJogo} tamanho="pequeno" />
                </div>
                <div className="grid min-w-0 gap-1.5">
                  <DialogTitle className="text-lg leading-tight font-extrabold">
                    <Link href={"/jogos/" + registro.jogoId} className="hover:text-primary hover:underline">
                      {registro.tituloJogo}
                    </Link>
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div>
                      <StatusRun status={registro.status} />
                    </div>
                  </DialogDescription>
                </div>
              </DialogHeader>

              <section className="grid gap-3 border-t border-border pt-4">
                <h3 className="font-meta text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Run
                </h3>
                <FormularioRun
                  key={[
                    registro.id,
                    registro.status,
                    registro.dataInicio,
                    registro.dataConclusao,
                    registro.horasJogo,
                  ].join("|")}
                  registro={registro}
                  aoSalvar={() => {
                    toast.success("Run atualizada.");
                    aoAlterar();
                  }}
                />
              </section>

              <section className="grid gap-3 border-t border-border pt-4">
                <h3 className="font-meta text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                  Avaliação
                </h3>
                <SecaoAvaliacao
                  key={[registro.id, registro.avaliacaoId, registro.nota, registro.status].join("|")}
                  registro={registro}
                  aoAlterar={aoAlterar}
                  aoPedirExclusao={() => setConfirmacao("avaliacao")}
                />
              </section>

              <div className="border-t border-border pt-4">
                <Button variant="destructive" onClick={() => setConfirmacao("run")}>
                  Remover da biblioteca
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmacao === "avaliacao"} onOpenChange={(aberto) => !aberto && setConfirmacao(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
            <AlertDialogDescription>
              A nota e o comentário serão apagados. A run continua na biblioteca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={apagando} onClick={excluirAvaliacao}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmacao === "run"} onOpenChange={(aberto) => !aberto && setConfirmacao(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover da biblioteca?</AlertDialogTitle>
            <AlertDialogDescription>
              A run será removida e a avaliação dela também será apagada. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={apagando} onClick={removerRun}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
