"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";
import Avatar from "@/components/comum/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, ErroApi } from "@/lib/api";
import type { UsuarioResumo } from "@/lib/tipos";

type BuscaUsuariosProps = {
  idsAmigos: number[];
  idsEnviados: number[];
  idsRecebidos: number[];
  aoMudar: () => Promise<void>;
};

export default function BuscaUsuarios({ idsAmigos, idsEnviados, idsRecebidos, aoMudar }: BuscaUsuariosProps) {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<UsuarioResumo[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState<string | null>(null);
  const [enviandoPara, setEnviandoPara] = useState<number | null>(null);
  const [enviadosAgora, setEnviadosAgora] = useState<number[]>([]);

  const nome = termo.trim();
  const buscaAtiva = nome.length >= 2;

  useEffect(() => {
    if (!buscaAtiva) {
      return;
    }
    let cancelado = false;
    const espera = setTimeout(async () => {
      setBuscando(true);
      setErroBusca(null);
      try {
        const dados = await api<UsuarioResumo[]>("/usuarios/busca?nome=" + encodeURIComponent(nome));
        if (!cancelado) setResultados(dados);
      } catch (erro) {
        if (!cancelado) {
          setErroBusca(erro instanceof ErroApi ? erro.mensagem : "Não foi possível buscar agora.");
        }
      } finally {
        if (!cancelado) setBuscando(false);
      }
    }, 300);
    return () => {
      cancelado = true;
      clearTimeout(espera);
    };
  }, [nome, buscaAtiva]);

  async function adicionar(usuario: UsuarioResumo) {
    setEnviandoPara(usuario.id);
    try {
      await api<unknown>("/amizades", { metodo: "POST", corpo: { destinatarioId: usuario.id } });
      setEnviadosAgora((ids) => [...ids, usuario.id]);
      toast.success("Pedido enviado para " + usuario.nome);
      await aoMudar();
    } catch (erro) {
      toast.error(erro instanceof ErroApi ? erro.mensagem : "Não foi possível enviar o pedido.");
      await aoMudar();
    } finally {
      setEnviandoPara(null);
    }
  }

  function rotuloBotao(id: number): string | null {
    if (idsAmigos.includes(id)) return "Já é amigo";
    if (idsRecebidos.includes(id)) return "Pedido recebido";
    if (idsEnviados.includes(id) || enviadosAgora.includes(id)) return "Pedido enviado";
    return null;
  }

  return (
    <section aria-label="Buscar pessoas">
      <div className="mb-3.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5">
        <h2 className="text-[22px] font-extrabold">Buscar pessoas</h2>
      </div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="busca-usuarios"
          value={termo}
          onChange={(evento) => setTermo(evento.target.value)}
          placeholder="Buscar pelo nome…"
          aria-label="Buscar pessoas pelo nome"
          autoComplete="off"
          className="h-10 bg-card pl-9 text-sm"
        />
      </div>
      {!buscaAtiva && <p className="py-3.5 text-sm text-muted-foreground">Digite pelo menos 2 letras do nome.</p>}
      {buscaAtiva && buscando && <p className="py-3.5 text-sm text-muted-foreground">Buscando…</p>}
      {buscaAtiva && !buscando && erroBusca !== null && (
        <p role="alert" className="py-3.5 text-sm text-destructive">
          {erroBusca}
        </p>
      )}
      {buscaAtiva && !buscando && erroBusca === null && resultados.length === 0 && (
        <p className="py-3.5 text-sm text-muted-foreground">Ninguém encontrado com esse nome.</p>
      )}
      {buscaAtiva && !buscando && erroBusca === null && resultados.length > 0 && (
        <ul className="mt-2">
          {resultados.map((usuario) => {
            const rotulo = rotuloBotao(usuario.id);
            return (
              <li key={usuario.id} className="flex items-center justify-between gap-3 border-b border-border py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar nome={usuario.nome} fotoPerfil={usuario.fotoPerfil} className="size-10" />
                  <span className="truncate font-bold">{usuario.nome}</span>
                </div>
                <Button
                  variant={rotulo === null ? "default" : "outline"}
                  disabled={rotulo !== null || enviandoPara === usuario.id}
                  onClick={() => adicionar(usuario)}
                >
                  {rotulo ?? "Adicionar"}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
