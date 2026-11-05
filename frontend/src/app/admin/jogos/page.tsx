"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DialogoJogo from "@/components/admin/DialogoJogo";
import TabelaJogos from "@/components/admin/TabelaJogos";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import TituloPagina from "@/components/comum/TituloPagina";
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
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { Jogo, Plataforma } from "@/lib/tipos";

export default function PaginaAdminJogos() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [jogoEditado, setJogoEditado] = useState<Jogo | null>(null);
  const [jogoRemovido, setJogoRemovido] = useState<Jogo | null>(null);
  const [erroRemocao, setErroRemocao] = useState("");
  const [removendo, setRemovendo] = useState(false);

  function carregar() {
    setCarregando(true);
    setErro("");
    buscar();
  }

  async function buscar() {
    try {
      const [listaJogos, listaPlataformas] = await Promise.all([
        api<Jogo[]>("/jogos"),
        api<Plataforma[]>("/jogos/plataformas"),
      ]);
      setJogos(listaJogos);
      setPlataformas(listaPlataformas);
    } catch (e) {
      setErro(e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscar();
  }, []);

  function abrirNovo() {
    setJogoEditado(null);
    setDialogoAberto(true);
  }

  function abrirEdicao(jogo: Jogo) {
    setJogoEditado(jogo);
    setDialogoAberto(true);
  }

  function aoSalvar() {
    toast.success(jogoEditado === null ? "Jogo cadastrado." : "Jogo atualizado.");
    setDialogoAberto(false);
    carregar();
  }

  function pedirRemocao(jogo: Jogo) {
    setErroRemocao("");
    setJogoRemovido(jogo);
  }

  async function confirmarRemocao(evento: React.MouseEvent) {
    evento.preventDefault();
    if (jogoRemovido === null) return;
    setRemovendo(true);
    setErroRemocao("");
    try {
      await api<void>("/admin/jogos/" + jogoRemovido.id, { metodo: "DELETE" });
      toast.success("Jogo removido.");
      setJogoRemovido(null);
      carregar();
    } catch (e) {
      setErroRemocao(e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.");
    } finally {
      setRemovendo(false);
    }
  }

  return (
    <div>
      <TituloPagina titulo="Catálogo">
        <Button onClick={abrirNovo} disabled={carregando || erro !== ""}>
          + Novo jogo
        </Button>
      </TituloPagina>

      {carregando && (
        <EstadoCarregando>
          <Skeleton className="mb-4 h-10 w-full max-w-sm" />
          <div className="grid gap-2">
            {[0, 1, 2, 3, 4].map((indice) => (
              <Skeleton key={indice} className="h-[72px] w-full" />
            ))}
          </div>
        </EstadoCarregando>
      )}

      {!carregando && erro !== "" && <EstadoErro mensagem={erro} aoTentarDeNovo={carregar} />}

      {!carregando && erro === "" && (
        <TabelaJogos jogos={jogos} aoEditar={abrirEdicao} aoRemover={pedirRemocao} />
      )}

      {dialogoAberto && (
        <DialogoJogo
          key={jogoEditado?.id ?? "novo"}
          jogo={jogoEditado}
          plataformas={plataformas}
          aoFechar={() => setDialogoAberto(false)}
          aoSalvar={aoSalvar}
        />
      )}

      <AlertDialog
        open={jogoRemovido !== null}
        onOpenChange={(aberto) => !aberto && setJogoRemovido(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover jogo?</AlertDialogTitle>
            <AlertDialogDescription>
              {jogoRemovido?.titulo} será removido do catálogo. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {erroRemocao && (
            <p role="alert" className="text-[13px] text-destructive">
              {erroRemocao}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmarRemocao} disabled={removendo}>
              {removendo ? "Removendo…" : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
