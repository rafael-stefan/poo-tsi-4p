"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ErroApi } from "@/lib/api";
import type { UsuarioLogado } from "@/lib/tipos";

type UsuarioContextoValor = {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
  sair: () => Promise<void>;
};

const UsuarioContexto = createContext<UsuarioContextoValor | null>(null);

async function buscarUsuario(): Promise<UsuarioLogado | null> {
  try {
    return await api<UsuarioLogado>("/usuarios/me");
  } catch (erro) {
    if (!(erro instanceof ErroApi)) {
      console.error(erro);
    }
    return null;
  }
}

export function UsuarioProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarUsuario().then((dados) => {
      setUsuario(dados);
      setCarregando(false);
    });
  }, []);

  async function recarregar() {
    const dados = await buscarUsuario();
    setUsuario(dados);
    setCarregando(false);
  }

  async function sair() {
    try {
      await api<void>("/auth/logout", { metodo: "POST" });
    } finally {
      setUsuario(null);
      router.push("/");
    }
  }

  return (
    <UsuarioContexto.Provider value={{ usuario, carregando, recarregar, sair }}>
      {children}
    </UsuarioContexto.Provider>
  );
}

export function useUsuario(): UsuarioContextoValor {
  const contexto = useContext(UsuarioContexto);
  if (contexto === null) {
    throw new Error("useUsuario precisa estar dentro de UsuarioProvider");
  }
  return contexto;
}
