"use client";

import { useState } from "react";
import { toast } from "sonner";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import Avatar from "@/components/comum/Avatar";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";
import type { UsuarioLogado } from "@/lib/tipos";

type FormularioDadosPerfilProps = {
  usuario: UsuarioLogado;
};

export default function FormularioDadosPerfil({ usuario }: FormularioDadosPerfilProps) {
  const { recarregar } = useUsuario();
  const [nome, setNome] = useState(usuario.nome);
  const [fotoPerfil, setFotoPerfil] = useState(usuario.fotoPerfil ?? "");
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  const semMudancas = nome.trim() === usuario.nome && fotoPerfil.trim() === (usuario.fotoPerfil ?? "");

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroGeral("");
    if (nome.trim() === "") {
      setErros({ nome: ["Informe seu nome."] });
      return;
    }
    setErros({});
    setEnviando(true);
    try {
      await api<UsuarioLogado>("/usuarios/me", {
        metodo: "PUT",
        corpo: { nome: nome.trim(), fotoPerfil: fotoPerfil.trim() === "" ? null : fotoPerfil.trim() },
      });
      await recarregar();
      toast.success("Perfil atualizado");
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 400 && Object.keys(erro.erros).length > 0) {
        setErros(erro.erros);
      } else {
        setErroGeral(erro instanceof ErroApi ? erro.mensagem : "Algo deu errado. Tente de novo.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4">
      <div className="flex items-center gap-4">
        <Avatar
          nome={nome.trim() || usuario.nome}
          fotoPerfil={fotoPerfil.trim() || null}
          className="size-16 [&_span]:text-2xl"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">{nome.trim() || usuario.nome}</p>
          <p className="truncate text-[13px] text-muted-foreground">{usuario.email}</p>
        </div>
      </div>
      <CampoComErro id="nome" rotulo="Nome" valor={nome} aoMudar={setNome} erros={erros.nome} autoComplete="name" />
      <CampoComErro
        id="fotoPerfil"
        rotulo="Foto de perfil (URL, opcional)"
        tipo="url"
        valor={fotoPerfil}
        aoMudar={setFotoPerfil}
        erros={erros.fotoPerfil}
        placeholder="https://..."
      />
      <p className="text-[13px] text-muted-foreground">O e-mail é usado para entrar e não pode ser alterado.</p>
      {erroGeral !== "" && (
        <p role="alert" className="text-[13px] text-destructive">
          {erroGeral}
        </p>
      )}
      <Button type="submit" disabled={enviando || semMudancas} className="justify-self-start">
        {enviando ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  );
}
