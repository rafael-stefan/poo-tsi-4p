import Link from "next/link";
import Avatar from "@/components/comum/Avatar";
import Capa from "@/components/comum/Capa";
import StatusRun from "@/components/comum/StatusRun";
import { formatarNota, tempoRelativo } from "@/lib/formato";
import type { ItemFeed as ItemFeedTipo } from "@/lib/tipos";

type ItemFeedProps = {
  item: ItemFeedTipo;
  linkarPerfil: boolean;
};

function textoHoras(horas: number | null, prefixo: string): string {
  if (horas === null) return "";
  return " " + prefixo + " " + horas.toLocaleString("pt-BR") + (horas === 1 ? " hora" : " horas");
}

function FraseRun({ item }: { item: ItemFeedTipo }) {
  const nomeJogo = (
    <Link href={"/jogos/" + item.jogo.id} className="font-extrabold hover:underline">
      {item.jogo.titulo}
    </Link>
  );

  if (item.status === "JOGANDO") {
    return <>Começou {nomeJogo}.</>;
  }
  if (item.status === "ZERADO") {
    return (
      <>
        Zerou {nomeJogo}
        {textoHoras(item.horasJogo, "em")}.
      </>
    );
  }
  if (item.status === "REJOGANDO") {
    return <>Começou a rejogar {nomeJogo}.</>;
  }
  return (
    <>
      Desistiu de {nomeJogo}
      {textoHoras(item.horasJogo, "depois de")}.
    </>
  );
}

export default function ItemFeed({ item, linkarPerfil }: ItemFeedProps) {
  const nome = (
    <span className="font-meta text-[11px] tracking-[0.06em] text-primary uppercase">{item.usuario.nome}</span>
  );

  return (
    <li className="grid grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-border py-4">
      <Avatar nome={item.usuario.nome} fotoPerfil={item.usuario.fotoPerfil} className="size-[34px]" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          {linkarPerfil ? (
            <Link href={"/perfil/" + item.usuario.id} className="hover:underline">
              {nome}
            </Link>
          ) : (
            nome
          )}
          <span className="font-meta text-[11px] text-muted-foreground">· {tempoRelativo(item.quando)}</span>
        </div>

        {item.tipo === "RUN" ? (
          <>
            <p className="mt-1.5 text-[15px] leading-[1.4] [overflow-wrap:anywhere]">
              <FraseRun item={item} />
            </p>
            <div className="mt-2.5 grid grid-cols-[54px_minmax(0,1fr)] items-center gap-2.5">
              <Capa titulo={item.jogo.titulo} capa={item.jogo.capa} tamanho="pequeno" />
              <StatusRun status={item.status} />
            </div>
          </>
        ) : (
          <>
            <p className="mt-1.5 text-[15px] leading-[1.4] [overflow-wrap:anywhere]">
              Avaliou{" "}
              <Link href={"/jogos/" + item.jogo.id} className="font-extrabold hover:underline">
                {item.jogo.titulo}
              </Link>{" "}
              com <span className="font-bold text-primary">{formatarNota(item.nota)}</span>.
            </p>
            {item.comentario && (
              <blockquote className="mt-2 line-clamp-3 border-l-2 border-primary pl-2.5 font-texto text-base leading-[1.4] text-[#d4d4da] [overflow-wrap:anywhere]">
                {item.comentario}
              </blockquote>
            )}
          </>
        )}
      </div>
    </li>
  );
}
