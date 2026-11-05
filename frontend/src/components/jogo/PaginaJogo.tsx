"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Capa from "@/components/comum/Capa";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import FichaJogo from "@/components/jogo/FichaJogo";
import ListaAvaliacoes from "@/components/jogo/ListaAvaliacoes";
import PainelNota from "@/components/jogo/PainelNota";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { api, ErroApi } from "@/lib/api";
import type { Avaliacao, EstatisticasJogo, Jogo, Registro } from "@/lib/tipos";

const classeLayout =
  "grid grid-cols-1 gap-8 min-[701px]:grid-cols-[200px_minmax(0,1fr)] min-[1101px]:grid-cols-[260px_minmax(0,1fr)_300px] min-[1101px]:gap-y-0";

function EsqueletoJogo() {
  return (
    <EstadoCarregando>
      <div className={classeLayout}>
        <Skeleton className="aspect-[3/4] w-full max-w-[220px] rounded-[6px] min-[701px]:max-w-none min-[1101px]:row-span-2 min-[1101px]:self-start" />
        <div className="grid content-start gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-16 w-4/5" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-60" />
        </div>
        <Skeleton className="h-[260px] w-full rounded-[10px] min-[701px]:col-span-2 min-[1101px]:col-span-1 min-[1101px]:row-span-2 min-[1101px]:self-start" />
        <div className="grid content-start gap-4 min-[701px]:col-span-2 min-[1101px]:col-span-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </EstadoCarregando>
  );
}

export default function PaginaJogo({ id }: { id: string }) {
  const { usuario } = useUsuario();
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasJogo | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  const usuarioId = usuario === null ? null : usuario.id;

  useEffect(() => {
    let cancelado = false;
    Promise.all([
      api<Jogo>("/jogos/" + id),
      api<EstatisticasJogo>("/jogos/" + id + "/estatisticas"),
      api<Avaliacao[]>("/jogos/" + id + "/avaliacoes"),
    ])
      .then(([dadosJogo, dadosEstatisticas, dadosAvaliacoes]) => {
        if (cancelado) return;
        setJogo(dadosJogo);
        setEstatisticas(dadosEstatisticas);
        setAvaliacoes(dadosAvaliacoes);
      })
      .catch((falha) => {
        if (cancelado) return;
        if (falha instanceof ErroApi && (falha.status === 404 || falha.status === 400)) {
          setNaoEncontrado(true);
          return;
        }
        setErro(falha instanceof ErroApi ? falha.mensagem : "Algo deu errado. Tente de novo.");
      });
    return () => {
      cancelado = true;
    };
  }, [id, tentativa]);

  useEffect(() => {
    if (usuarioId === null) return;
    let cancelado = false;
    api<Registro[]>("/registros?jogoId=" + id)
      .then((dados) => {
        if (!cancelado) setRegistros(dados);
      })
      .catch(() => {
        if (!cancelado) setRegistros([]);
      });
    return () => {
      cancelado = true;
    };
  }, [id, usuarioId]);

  async function recarregarRegistros() {
    try {
      setRegistros(await api<Registro[]>("/registros?jogoId=" + id));
    } catch {
      setRegistros([]);
    }
  }

  async function recarregarAvaliacoes() {
    try {
      const [dadosJogo, dadosEstatisticas, dadosAvaliacoes] = await Promise.all([
        api<Jogo>("/jogos/" + id),
        api<EstatisticasJogo>("/jogos/" + id + "/estatisticas"),
        api<Avaliacao[]>("/jogos/" + id + "/avaliacoes"),
      ]);
      setJogo(dadosJogo);
      setEstatisticas(dadosEstatisticas);
      setAvaliacoes(dadosAvaliacoes);
    } catch {
      setErro("Não foi possível atualizar as avaliações.");
    }
  }

  function tentarDeNovo() {
    setErro("");
    setTentativa(tentativa + 1);
  }

  if (naoEncontrado) {
    notFound();
  }

  if (erro !== "") {
    return <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />;
  }

  if (jogo === null || estatisticas === null) {
    return <EsqueletoJogo />;
  }

  return (
    <div className={classeLayout}>
      <div className="max-w-[220px] min-[701px]:max-w-none min-[1101px]:col-start-1 min-[1101px]:row-span-2 min-[1101px]:row-start-1 min-[1101px]:self-start">
        <Capa titulo={jogo.titulo} capa={jogo.capa} tamanho="grande" />
      </div>
      <div className="min-w-0 min-[1101px]:col-start-2 min-[1101px]:row-start-1">
        <FichaJogo jogo={jogo} registros={registros} aoAdicionarRun={recarregarRegistros} />
      </div>
      <div className="min-[701px]:col-span-2 min-[1101px]:col-span-1 min-[1101px]:col-start-3 min-[1101px]:row-span-2 min-[1101px]:row-start-1 min-[1101px]:self-start">
        <PainelNota jogo={jogo} estatisticas={estatisticas} />
      </div>
      <div className="min-w-0 min-[701px]:col-span-2 min-[1101px]:col-span-1 min-[1101px]:col-start-2 min-[1101px]:row-start-2">
        <ListaAvaliacoes avaliacoes={avaliacoes} aoExcluir={recarregarAvaliacoes} />
      </div>
    </div>
  );
}
