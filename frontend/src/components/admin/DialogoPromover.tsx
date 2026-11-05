"use client";

import { useState } from "react";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, ErroApi } from "@/lib/api";
import type { UsuarioAdmin } from "@/lib/tipos";

type DialogoPromoverProps = {
  usuario: UsuarioAdmin;
  aoFechar: () => void;
  aoPromover: () => void;
};

export default function DialogoPromover({ usuario, aoFechar, aoPromover }: DialogoPromoverProps) {
  const [matricula, setMatricula] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  async function promover(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErros([]);
    setEnviando(true);
    try {
      await api<void>("/admin/usuarios/" + usuario.id + "/promover", {
        metodo: "POST",
        corpo: { matriculaAdmin: matricula.trim() },
      });
      aoPromover();
    } catch (erro) {
      if (erro instanceof ErroApi) {
        const doCampo = erro.erros.matriculaAdmin;
        setErros(doCampo && doCampo.length > 0 ? doCampo : [erro.mensagem]);
      } else {
        setErros(["Algo deu errado. Tente de novo."]);
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && aoFechar()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal uppercase">
            Tornar admin
          </DialogTitle>
          <DialogDescription>
            {usuario.nome} passará a administrar o catálogo e as contas. Informe a matrícula de
            administrador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={promover} className="grid gap-4" noValidate>
          <CampoComErro
            id="matriculaAdmin"
            rotulo="Matrícula"
            valor={matricula}
            aoMudar={setMatricula}
            erros={erros}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Promovendo…" : "Tornar admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
