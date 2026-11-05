import Link from "next/link";
import Capa from "@/components/comum/Capa";
import EstadoVazio from "@/components/comum/EstadoVazio";
import StatusRun from "@/components/comum/StatusRun";
import { formatarData, formatarNota } from "@/lib/formato";
import type { Avaliacao } from "@/lib/tipos";

type AvaliacoesPerfilProps = {
  avaliacoes: Avaliacao[];
};

export default function AvaliacoesPerfil({ avaliacoes }: AvaliacoesPerfilProps) {
  return (
    <section className="mt-9" aria-label="Avaliações">
      <div className="mb-3.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5">
        <h2 className="text-[22px] font-extrabold">Avaliações</h2>
        <span className="text-lg text-muted-foreground">{avaliacoes.length}</span>
      </div>
      {avaliacoes.length === 0 ? (
        <EstadoVazio titulo="Nenhuma avaliação" texto="Ainda não há avaliações publicadas por aqui." />
      ) : (
        <div>
          {avaliacoes.map((avaliacao) => (
            <article
              key={avaliacao.id}
              className="grid grid-cols-[56px_minmax(0,1fr)] gap-3.5 border-t border-border py-[18px]"
            >
              <Link href={"/jogos/" + avaliacao.jogoId}>
                <Capa titulo={avaliacao.tituloJogo} capa={avaliacao.capaJogo} tamanho="pequeno" />
              </Link>
              <div className="grid min-w-0 content-start gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link href={"/jogos/" + avaliacao.jogoId} className="font-bold hover:underline">
                    {avaliacao.tituloJogo}
                  </Link>
                  <StatusRun status={avaliacao.statusRun} />
                  <span className="ml-auto rounded-full border-[1.5px] border-primary px-2.5 py-px text-sm font-extrabold tabular-nums">
                    {formatarNota(avaliacao.nota)}
                  </span>
                </div>
                {avaliacao.comentario && (
                  <p className="max-w-[64ch] font-texto text-lg leading-[1.45] break-words text-[#dcdce2]">
                    {avaliacao.comentario}
                  </p>
                )}
                <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                  {formatarData(avaliacao.dataAvaliacao)}
                  {avaliacao.horasJogo !== null && " · " + avaliacao.horasJogo.toLocaleString("pt-BR") + " h"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
