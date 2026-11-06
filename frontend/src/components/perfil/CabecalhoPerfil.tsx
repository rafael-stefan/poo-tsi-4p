"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Avatar from "@/components/comum/Avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";
import { formatarData } from "@/lib/formato";
import type { AmizadeResumo, UsuarioResumo } from "@/lib/tipos";

type CabecalhoPerfilProps = {
  usuario: UsuarioResumo;
  amizade: AmizadeResumo | null;
};

export default function CabecalhoPerfil({ usuario, amizade }: CabecalhoPerfilProps) {
  const router = useRouter();
  const { usuario: logado } = useUsuario();
  const ehMeuPerfil = logado !== null && logado.id === usuario.id;
  const [desfazendo, setDesfazendo] = useState(false);

  async function desfazerAmizade() {
    if (amizade === null) return;
    setDesfazendo(true);
    try {
      await api<void>("/amizades/" + amizade.id, { metodo: "DELETE" });
      toast.success("Amizade desfeita");
      router.push("/amigos");
    } catch (erro) {
      toast.error(erro instanceof ErroApi ? erro.mensagem : "Não foi possível desfazer a amizade.");
      setDesfazendo(false);
    }
  }

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-[22px] gap-y-4 border-b border-border pb-[22px] md:grid-cols-[auto_1fr_auto]">
      <Avatar nome={usuario.nome} fotoPerfil={usuario.fotoPerfil} className="size-[84px] text-3xl [&_span]:text-3xl" />
      <div className="min-w-0">
        <h1 className="mb-1.5 font-display text-5xl leading-[0.9] font-normal break-words uppercase md:text-[54px]">
          {usuario.nome}
        </h1>
        {amizade !== null && (
          <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
            Amigos desde {formatarData(amizade.desde)}
          </span>
        )}
      </div>
      {ehMeuPerfil && (
        <div className="col-span-full md:col-auto">
          <Button asChild variant="outline">
            <Link href="/perfil/editar">Editar perfil</Link>
          </Button>
        </div>
      )}
      {amizade !== null && (
        <div className="col-span-full md:col-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={desfazendo}>
                Desfazer amizade
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desfazer amizade com {usuario.nome}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vocês deixam de ver o perfil e as atividades um do outro. Para voltar a ser amigos, será preciso um novo pedido.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={desfazerAmizade}>Desfazer amizade</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
