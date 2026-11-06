"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import RegrasSenha, { senhaCumpreRegras } from "@/components/autenticacao/RegrasSenha";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";

export default function FormularioCadastro() {
  const router = useRouter();
  const { usuario, recarregar } = useUsuario();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (usuario !== null && !enviando) {
      router.replace("/");
    }
  }, [usuario, enviando, router]);

  const senhaValida = senhaCumpreRegras(senha);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTentouEnviar(true);
    setErroGeral("");
    const novosErros: Record<string, string[]> = {};
    if (nome.trim() === "") {
      novosErros.nome = ["Informe seu nome."];
    }
    if (email.trim() === "") {
      novosErros.email = ["Informe seu e-mail."];
    }
    if (!senhaValida) {
      novosErros.senha = ["A senha não cumpre as regras abaixo."];
    }
    if (confirmacao !== senha) {
      novosErros.confirmacao = ["As senhas não são iguais."];
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      await api<unknown>("/auth/register", {
        metodo: "POST",
        corpo: {
          nome: nome.trim(),
          email: email.trim(),
          senha,
          fotoPerfil: fotoPerfil.trim() === "" ? undefined : fotoPerfil.trim(),
        },
      });
      await api<unknown>("/auth/login", { metodo: "POST", corpo: { email: email.trim(), senha } });
      await recarregar();
      toast.success("Conta criada");
      router.replace("/");
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 409) {
        setErros({ email: ["Este e-mail já está cadastrado."] });
      } else if (erro instanceof ErroApi && erro.status === 400) {
        setErros(erro.erros);
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
        id="nome"
        rotulo="Nome"
        valor={nome}
        aoMudar={setNome}
        erros={erros.nome}
        autoComplete="name"
      />
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
        autoComplete="new-password"
      >
        <RegrasSenha senha={senha} tentouEnviar={tentouEnviar} />
      </CampoComErro>
      <CampoComErro
        id="confirmacao"
        rotulo="Confirmar senha"
        tipo="password"
        valor={confirmacao}
        aoMudar={setConfirmacao}
        erros={erros.confirmacao}
        autoComplete="new-password"
      />
      <CampoComErro
        id="fotoPerfil"
        rotulo="Foto de perfil (URL, opcional)"
        tipo="url"
        valor={fotoPerfil}
        aoMudar={setFotoPerfil}
        erros={erros.fotoPerfil}
        placeholder="https://..."
      />
      {erroGeral !== "" && (
        <p role="alert" className="text-[13px] text-destructive">
          {erroGeral}
        </p>
      )}
      <Button type="submit" disabled={enviando} className="w-full">
        {enviando ? "Criando conta…" : "Criar conta"}
      </Button>
      <p className="text-center text-[13px] text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
