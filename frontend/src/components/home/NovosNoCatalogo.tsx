import CardJogo from "@/components/comum/CardJogo";
import type { Jogo } from "@/lib/tipos";

type NovosNoCatalogoProps = {
  jogos: Jogo[];
};

export default function NovosNoCatalogo({ jogos }: NovosNoCatalogoProps) {
  if (jogos.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mt-[30px] mb-3.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5">
        <h3 className="text-[22px] font-extrabold">Novos no catálogo</h3>
        <span className="text-lg text-muted-foreground max-[700px]:hidden">os últimos jogos cadastrados</span>
      </div>
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] min-[701px]:grid-cols-4 min-[1101px]:grid-cols-6">
        {jogos.map((jogo) => (
          <CardJogo
            key={jogo.id}
            id={jogo.id}
            titulo={jogo.titulo}
            capa={jogo.capa}
            nota={jogo.totalAvaliacoes === 0 ? null : jogo.notaMedia}
          />
        ))}
      </div>
    </section>
  );
}
