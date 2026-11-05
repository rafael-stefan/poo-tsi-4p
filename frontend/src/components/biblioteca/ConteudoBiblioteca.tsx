"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CardRun from "@/components/biblioteca/CardRun";
import DialogoRun from "@/components/biblioteca/DialogoRun";
import FiltrosStatus, { type FiltroStatus } from "@/components/biblioteca/FiltrosStatus";
import EstadoCarregando from "@/components/comum/EstadoCarregando";
import EstadoErro from "@/components/comum/EstadoErro";
import EstadoVazio from "@/components/comum/EstadoVazio";
import TituloPagina from "@/components/comum/TituloPagina";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { api, ErroApi } from "@/lib/api";
import type { Registro } from "@/lib/tipos";

const grade = "grid grid-cols-2 gap-x-3.5 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-[18px] lg:gap-y-[22px]";

function emAndamento(registro: Registro): boolean {
  return registro.status === "JOGANDO" || registro.status === "REJOGANDO";
}

function ordenar(registros: Registro[]): Registro[] {
  return [...registros].sort((a, b) => {
    if (emAndamento(a) !== emAndamento(b)) {
      return emAndamento(a) ? -1 : 1;
    }
    return b.id - a.id;
  });
}

export default function ConteudoBiblioteca() {
  const router = useRouter();
  const parametros = useSearchParams();
  const jogoParametro = parametros.get("jogo");
  const jogoFiltrado = jogoParametro !== null && /^\d+$/.test(jogoParametro) ? Number(jogoParametro) : null;

  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("TODAS");
  const [abertoId, setAbertoId] = useState<number | null>(null);

  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    api<Registro[]>("/registros")
      .then((lista) => {
        setRegistros(ordenar(lista));
        setErro("");
      })
      .catch((e) => {
        setErro(e instanceof ErroApi ? e.mensagem : "Não foi possível carregar sua biblioteca.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [recarga]);

  function recarregar() {
    setRecarga((valor) => valor + 1);
  }

  function tentarDeNovo() {
    setCarregando(true);
    setErro("");
    recarregar();
  }

  const doJogo = jogoFiltrado === null ? registros : registros.filter((r) => r.jogoId === jogoFiltrado);
  const tituloJogo = doJogo.length > 0 ? doJogo[0].tituloJogo : "";

  const contagens: Record<FiltroStatus, number> = {
    TODAS: doJogo.length,
    JOGANDO: doJogo.filter((r) => r.status === "JOGANDO").length,
    ZERADO: doJogo.filter((r) => r.status === "ZERADO").length,
    REJOGANDO: doJogo.filter((r) => r.status === "REJOGANDO").length,
    DESISTIDO: doJogo.filter((r) => r.status === "DESISTIDO").length,
  };

  const visiveis = filtro === "TODAS" ? doJogo : doJogo.filter((r) => r.status === filtro);
  const registroAberto = registros.find((r) => r.id === abertoId) ?? null;

  function conteudo() {
    if (carregando) {
      return (
        <EstadoCarregando>
          <div className={grade}>
            {Array.from({ length: 12 }).map((_, indice) => (
              <div key={indice} className="grid content-start gap-1.5">
                <Skeleton className="aspect-[3/4] w-full rounded-[6px]" />
                <Skeleton className="mt-1 h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </EstadoCarregando>
      );
    }

    if (erro !== "") {
      return <EstadoErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />;
    }

    if (registros.length === 0) {
      return (
        <EstadoVazio
          titulo="Sua biblioteca está vazia"
          texto="Adicione os jogos que você joga para acompanhar suas runs e avaliar."
          acao={
            <Link href="/jogos" className={buttonVariants()}>
              Explorar jogos
            </Link>
          }
        />
      );
    }

    if (doJogo.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhuma run desse jogo"
          texto="Você ainda não registrou nenhuma run desse jogo."
          acao={
            <Link href="/biblioteca" className={buttonVariants({ variant: "outline" })}>
              Ver todas as runs
            </Link>
          }
        />
      );
    }

    if (visiveis.length === 0) {
      return <EstadoVazio titulo="Nenhuma run com esse status" />;
    }

    return (
      <div className={grade}>
        {visiveis.map((registro) => (
          <CardRun key={registro.id} registro={registro} aoAbrir={() => setAbertoId(registro.id)} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <TituloPagina titulo="Biblioteca">
        <FiltrosStatus filtro={filtro} contagens={contagens} aoMudar={setFiltro} />
      </TituloPagina>

      {jogoFiltrado !== null && !carregando && erro === "" && tituloJogo !== "" && (
        <p className="mb-5 flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
          <span>
            Mostrando suas runs de <b className="text-foreground">{tituloJogo}</b>
          </span>
          <button
            type="button"
            onClick={() => router.push("/biblioteca")}
            className="font-semibold text-primary hover:underline"
          >
            ver todas
          </button>
        </p>
      )}

      {conteudo()}

      <DialogoRun registro={registroAberto} aoFechar={() => setAbertoId(null)} aoAlterar={recarregar} />
    </div>
  );
}
