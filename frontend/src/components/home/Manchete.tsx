import Link from "next/link";
import Capa from "@/components/comum/Capa";
import SeloNota from "@/components/comum/SeloNota";
import { Button } from "@/components/ui/button";
import { formatarNota } from "@/lib/formato";
import type { JogoDestaque } from "@/lib/tipos";

type MancheteProps = {
  destaque: JogoDestaque | null;
};

export default function Manchete({ destaque }: MancheteProps) {
  if (destaque === null) {
    return (
      <article className="border-b border-border pb-[26px]">
        <span className="font-meta text-[11px] tracking-[0.06em] uppercase">
          <span className="text-primary">Bem-vindo</span> · GameLog
        </span>
        <h2 className="mt-2 mb-3 font-display text-[clamp(42px,5vw,70px)] leading-[0.92] uppercase [text-wrap:balance]">
          O GameLog está só começando
        </h2>
        <p className="mb-4 max-w-[52ch] font-texto text-[19px] leading-[1.35] text-[#d9d9df]">
          Assim que os jogos receberem as primeiras avaliações, o mais bem avaliado da comunidade aparece aqui.
        </p>
        <Button asChild>
          <Link href="/jogos">Explorar jogos</Link>
        </Button>
      </article>
    );
  }

  const jogo = destaque.jogo;

  return (
    <article>
      <Link
        href={"/jogos/" + jogo.id}
        className="grid items-end gap-6 border-b border-border pb-[26px] max-[700px]:grid-cols-1 min-[701px]:grid-cols-[220px_minmax(0,1fr)]"
      >
        <div className="w-full max-[700px]:max-w-[200px]">
          <Capa titulo={jogo.titulo} capa={jogo.capa} tamanho="grande">
            <SeloNota nota={destaque.notaMedia} />
          </Capa>
        </div>
        <div>
          <span className="font-meta text-[11px] tracking-[0.06em] uppercase">
            <span className="text-primary">Destaque da comunidade</span>
            {destaque.genero && <span className="text-muted-foreground"> · {destaque.genero}</span>}
          </span>
          <h2 className="mt-2 mb-3 font-display text-[clamp(42px,5vw,70px)] leading-[0.92] uppercase [overflow-wrap:anywhere] [text-wrap:balance]">
            {jogo.titulo} é o jogo mais bem avaliado da comunidade
          </h2>
          <p className="max-w-[52ch] font-texto text-[19px] leading-[1.35] text-[#d9d9df]">
            {destaque.totalAvaliacoes} {destaque.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}, média{" "}
            {formatarNota(destaque.notaMedia)}.
          </p>
        </div>
      </Link>
    </article>
  );
}
