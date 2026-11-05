"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";

export default function FormularioLogin() {
  const router = useRouter();
  const parametros = useSearchParams();
  const { usuario, recarregar } = useUsuario();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  const voltar = parametros.get("voltar");
  const destino = voltar !== null && voltar.startsWith("/") && !voltar.startsWith("//") ? voltar : "/";

  useEffect(() => {
    if (usuario !== null) {
      router.replace(destino);
    }
  }, [usuario, destino, router]);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroGeral("");
    setErros({});
    setEnviando(true);
    try {
      await api<unknown>("/auth/login", { metodo: "POST", corpo: { email: email.trim(), senha } });
      await recarregar();
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 400) {
        setErros(erro.erros);
      } else if (erro instanceof ErroApi && erro.status === 401) {
        setErroGeral("E-mail ou senha inválidos.");
      } else if (erro instanceof ErroApi) {
        setErroGeral(erro.mensagem);
      } else {
        setErroGeral("Algo deu errado. Tente de novo.");
      }
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4">
      <CampoComErro
        id="email"
        rotulo="E-mail"
        tipo="email"
        valor={email}
        aoMudar={setEmail}
        erros={erros.email}
        autoComplete="email"
        placeholder="voce@email.com"
      />
      <CampoComErro
        id="senha"
        rotulo="Senha"
        tipo="password"
        valor={senha}
        aoMudar={setSenha}
        erros={erros.senha}
        autoComplete="current-password"
      />
      {erroGeral !== "" && (
        <p role="alert" className="text-[13px] text-destructive">
          {erroGeral}
        </p>
      )}
      <Button type="submit" disabled={enviando} className="w-full">
        {enviando ? "Entrando…" : "Entrar"}
      </Button>
      <p className="text-center text-[13px] text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
