import Link from "next/link";
import Capa from "@/components/comum/Capa";
import { formatarNota } from "@/lib/formato";
import type { JogoDestaque } from "@/lib/tipos";

type MaisBemAvaliadosProps = {
  jogos: JogoDestaque[];
};

export default function MaisBemAvaliados({ jogos }: MaisBemAvaliadosProps) {
  return (
    <section aria-label="Mais bem avaliados">
      <h2 className="mb-3.5 border-t-[3px] border-primary pt-2.5 text-[22px] font-extrabold">Mais bem avaliados</h2>
      {jogos.length === 0 ? (
        <p className="py-4 text-muted-foreground">
          Os jogos mais bem avaliados aparecem aqui quando houver avaliações suficientes.
        </p>
      ) : (
        <ol>
          {jogos.slice(0, 6).map((item, indice) => (
            <li key={item.jogo.id} className="border-b border-border">
              <Link
                href={"/jogos/" + item.jogo.id}
                className="grid grid-cols-[22px_54px_minmax(0,1fr)_auto] items-center gap-3 py-3"
              >
                <span className="font-display text-xl text-muted-foreground">{indice + 1}</span>
                <Capa titulo={item.jogo.titulo} capa={item.jogo.capa} tamanho="pequeno" />
                <span className="min-w-0">
                  <span className="block text-[15px] leading-tight font-bold [overflow-wrap:anywhere]">
                    {item.jogo.titulo}
                  </span>
                  {item.genero && (
                    <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                      {item.genero}
                    </span>
                  )}
                </span>
                <span className="grid h-9 min-w-9 place-items-center rounded-full border-2 border-primary px-1.5 font-ui text-sm font-extrabold tabular-nums">
                  {formatarNota(item.totalAvaliacoes === 0 ? null : item.notaMedia)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
