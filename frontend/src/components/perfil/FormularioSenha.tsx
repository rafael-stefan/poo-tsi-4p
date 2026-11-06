"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import RegrasSenha, { senhaCumpreRegras } from "@/components/autenticacao/RegrasSenha";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";

export default function FormularioSenha() {
  const router = useRouter();
  const { recarregar } = useUsuario();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTentouEnviar(true);
    setErroGeral("");
    const novosErros: Record<string, string[]> = {};
    if (senhaAtual === "") {
      novosErros.senhaAtual = ["Informe a senha atual."];
    }
    if (!senhaCumpreRegras(novaSenha)) {
      novosErros.novaSenha = ["A senha não cumpre as regras abaixo."];
    }
    if (confirmacao !== novaSenha) {
      novosErros.confirmacao = ["As senhas não são iguais."];
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      return;
    }

    setEnviando(true);
    try {
      await api<void>("/auth/senha", { metodo: "PUT", corpo: { senhaAtual, novaSenha } });
      await recarregar();
      toast.success("Senha alterada. Entre de novo com a nova senha.");
      router.replace("/login");
    } catch (erro) {
      if (erro instanceof ErroApi && erro.mensagem === "Senha atual incorreta") {
        setErros({ senhaAtual: ["Senha atual incorreta."] });
      } else if (erro instanceof ErroApi && erro.mensagem === "A nova senha deve ser diferente da atual") {
        setErros({ novaSenha: ["A nova senha deve ser diferente da atual."] });
      } else if (erro instanceof ErroApi && erro.status === 400 && Object.keys(erro.erros).length > 0) {
        setErros(erro.erros);
      } else {
        setErroGeral(erro instanceof ErroApi ? erro.mensagem : "Algo deu errado. Tente de novo.");
      }
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4">
      <CampoComErro
        id="senhaAtual"
        rotulo="Senha atual"
        tipo="password"
        valor={senhaAtual}
        aoMudar={setSenhaAtual}
        erros={erros.senhaAtual}
        autoComplete="current-password"
      />
      <CampoComErro
        id="novaSenha"
        rotulo="Nova senha"
        tipo="password"
        valor={novaSenha}
        aoMudar={setNovaSenha}
        erros={erros.novaSenha}
        autoComplete="new-password"
      >
        <RegrasSenha senha={novaSenha} tentouEnviar={tentouEnviar} />
      </CampoComErro>
      <CampoComErro
        id="confirmacao"
        rotulo="Confirmar nova senha"
        tipo="password"
        valor={confirmacao}
        aoMudar={setConfirmacao}
        erros={erros.confirmacao}
        autoComplete="new-password"
      />
      <p className="text-[13px] text-muted-foreground">Depois de trocar a senha, você precisa entrar de novo.</p>
      {erroGeral !== "" && (
        <p role="alert" className="text-[13px] text-destructive">
          {erroGeral}
        </p>
      )}
      <Button type="submit" disabled={enviando} className="justify-self-start">
        {enviando ? "Alterando…" : "Alterar senha"}
      </Button>
    </form>
  );
}
