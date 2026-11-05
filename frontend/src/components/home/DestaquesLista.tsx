import Link from "next/link";
import Capa from "@/components/comum/Capa";
import StatusRun from "@/components/comum/StatusRun";
import { formatarNota } from "@/lib/formato";
import type { Destaques, JogoDestaque, StatusJogo } from "@/lib/tipos";

type ItemDestaque = {
  destaque: JogoDestaque;
  status: StatusJogo;
  texto: string;
  frase: string;
};

type DestaquesListaProps = {
  destaques: Destaques;
};

function montarItens(destaques: Destaques): ItemDestaque[] {
  const itens: ItemDestaque[] = [];

  if (destaques.maisZerado) {
    const pessoas = destaques.maisZerado.pessoas;
    itens.push({
      destaque: destaques.maisZerado,
      status: "ZERADO",
      texto: "Zerado por " + pessoas + (pessoas === 1 ? " pessoa" : " pessoas"),
      frase: " é o jogo mais zerado da comunidade",
    });
  }
  if (destaques.maisJogado) {
    itens.push({
      destaque: destaques.maisJogado,
      status: "JOGANDO",
      texto: "Jogando agora: " + destaques.maisJogado.pessoas,
      frase: " é o jogo que mais gente está jogando",
    });
  }
  if (destaques.maisRejogado) {
    itens.push({
      destaque: destaques.maisRejogado,
      status: "REJOGANDO",
      texto: "Rejogado por " + destaques.maisRejogado.pessoas,
      frase: " é o campeão de runs repetidas",
    });
  }
  if (destaques.maisDesistido) {
    itens.push({
      destaque: destaques.maisDesistido,
      status: "DESISTIDO",
      texto: "Desistências: " + destaques.maisDesistido.pessoas,
      frase: " lidera a lista de abandonos",
    });
  }

  return itens;
}

export default function DestaquesLista({ destaques }: DestaquesListaProps) {
  const itens = montarItens(destaques);

  if (itens.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 min-[701px]:grid-cols-2">
      {itens.map((item, indice) => {
        const jogo = item.destaque.jogo;
        const colunaDireita = indice % 2 === 1;
        return (
          <Link
            key={item.status}
            href={"/jogos/" + jogo.id}
            className={`grid grid-cols-[76px_minmax(0,1fr)] gap-3.5 border-b border-border py-[18px] ${
              colunaDireita
                ? "pr-0 min-[701px]:border-l min-[701px]:pl-[18px]"
                : "pr-0 min-[701px]:pr-[18px]"
            }`}
          >
            <Capa titulo={jogo.titulo} capa={jogo.capa} tamanho="pequeno" />
            <div className="min-w-0">
              <StatusRun status={item.status} texto={item.texto} />
              <h3 className="mt-1 mb-1.5 text-lg leading-[1.15] font-extrabold [overflow-wrap:anywhere] [text-wrap:balance]">
                {jogo.titulo}
                {item.frase}
              </h3>
              <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                {item.destaque.totalAvaliacoes === 0
                  ? "Sem avaliações"
                  : formatarNota(item.destaque.notaMedia) +
                    " · " +
                    item.destaque.totalAvaliacoes +
                    (item.destaque.totalAvaliacoes === 1 ? " avaliação" : " avaliações")}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
