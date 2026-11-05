import SeloNota from "@/components/comum/SeloNota";
import type { EstatisticasJogo, Jogo } from "@/lib/tipos";

type PainelNotaProps = {
  jogo: Jogo;
  estatisticas: EstatisticasJogo;
};

export default function PainelNota({ jogo, estatisticas }: PainelNotaProps) {
  const zerados = estatisticas.pessoasPorStatus.ZERADO ?? 0;
  const desistencias = estatisticas.pessoasPorStatus.DESISTIDO ?? 0;
  const maior = Math.max(1, ...estatisticas.distribuicaoNotas.map((faixa) => faixa.total));

  return (
    <aside aria-label="Nota média" className="grid gap-3.5 rounded-[10px] border border-border bg-card p-[18px]">
      <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
        Nota da comunidade
      </span>
      <div className="flex items-center gap-3.5">
        <SeloNota nota={jogo.totalAvaliacoes === 0 ? null : jogo.notaMedia} grande />
        <div>
          <b>{jogo.totalAvaliacoes === 1 ? "1 avaliação" : jogo.totalAvaliacoes + " avaliações"}</b>
          <br />
          <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
            <span className="whitespace-nowrap">{zerados} {zerados === 1 ? "zerado" : "zerados"}</span> ·{" "}
            <span className="whitespace-nowrap">
              {desistencias} {desistencias === 1 ? "desistência" : "desistências"}
            </span>
          </span>
        </div>
      </div>
      <div className="grid gap-[5px]">
        {estatisticas.distribuicaoNotas.map((faixa) => (
          <div
            key={faixa.faixa}
            className="grid grid-cols-[34px_1fr_30px] items-center gap-2 font-meta text-[11px] text-muted-foreground"
          >
            <span>{faixa.faixa.replace("-", "–")}</span>
            <i
              className="block h-1.5 rounded-[3px] bg-primary"
              style={{ width: (faixa.total / maior) * 100 + "%" }}
            />
            <span>{faixa.total}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
