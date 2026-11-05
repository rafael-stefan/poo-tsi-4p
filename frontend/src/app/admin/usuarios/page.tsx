"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import DialogoPromover from "@/components/admin/DialogoPromover";
import TabelaUsuarios from "@/components/admin/TabelaUsuarios";
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
import { Skeleton } from "@/components/ui/skeleton";
import { api, ErroApi } from "@/lib/api";
import type { UsuarioAdmin } from "@/lib/tipos";

export default function PaginaAdminUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [usuarioSuspenso, setUsuarioSuspenso] = useState<UsuarioAdmin | null>(null);
  const [usuarioPromovido, setUsuarioPromovido] = useState<UsuarioAdmin | null>(null);

  function carregar() {
    setCarregando(true);
    setErro("");
    buscar();
  }

  async function buscar() {
    try {
      setUsuarios(await api<UsuarioAdmin[]>("/admin/usuarios"));
    } catch (e) {
      setErro(e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  async function recarregarSemPiscar() {
    try {
      setUsuarios(await api<UsuarioAdmin[]>("/admin/usuarios"));
    } catch (e) {
      toast.error(e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.");
    }
  }

  useEffect(() => {
    buscar();
  }, []);

  async function alterarSituacao(usuario: UsuarioAdmin, acao: "suspender" | "reativar") {
    setOcupadoId(usuario.id);
    try {
      await api<UsuarioAdmin>("/admin/usuarios/" + usuario.id + "/" + acao, { metodo: "PATCH" });
      toast.success(acao === "suspender" ? "Conta suspensa." : "Conta reativada.");
    } catch (e) {
      toast.error(e instanceof ErroApi ? e.mensagem : "Algo deu errado. Tente de novo.");
    } finally {
      await recarregarSemPiscar();
      setOcupadoId(null);
    }
  }

  function confirmarSuspensao(evento: React.MouseEvent) {
    evento.preventDefault();
    if (usuarioSuspenso === null) return;
    const alvo = usuarioSuspenso;
    setUsuarioSuspenso(null);
    alterarSituacao(alvo, "suspender");
  }

  function aoPromover() {
    toast.success("Usuário promovido a admin.");
    setUsuarioPromovido(null);
    recarregarSemPiscar();
  }

  return (
    <div>
      <TituloPagina titulo="Usuários" />

      {carregando && (
        <EstadoCarregando>
          <Skeleton className="mb-4 h-9 w-72" />
          <div className="grid gap-2">
            {[0, 1, 2, 3, 4].map((indice) => (
              <Skeleton key={indice} className="h-14 w-full" />
            ))}
          </div>
        </EstadoCarregando>
      )}

      {!carregando && erro !== "" && <EstadoErro mensagem={erro} aoTentarDeNovo={carregar} />}

      {!carregando && erro === "" && (
        <TabelaUsuarios
          usuarios={usuarios}
          ocupadoId={ocupadoId}
          aoSuspender={setUsuarioSuspenso}
          aoReativar={(usuario) => alterarSituacao(usuario, "reativar")}
          aoPromover={setUsuarioPromovido}
        />
      )}

      {usuarioPromovido !== null && (
        <DialogoPromover
          key={usuarioPromovido.id}
          usuario={usuarioPromovido}
          aoFechar={() => setUsuarioPromovido(null)}
          aoPromover={aoPromover}
        />
      )}

      <AlertDialog
        open={usuarioSuspenso !== null}
        onOpenChange={(aberto) => !aberto && setUsuarioSuspenso(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspender conta?</AlertDialogTitle>
            <AlertDialogDescription>
              {usuarioSuspenso?.nome} não vai conseguir entrar no GameLog até a conta ser
              reativada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmarSuspensao}>
              Suspender
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
