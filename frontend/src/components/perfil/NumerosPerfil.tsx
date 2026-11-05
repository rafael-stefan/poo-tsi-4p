import { formatarNota } from "@/lib/formato";
import type { Estatisticas } from "@/lib/tipos";

type NumerosPerfilProps = {
  estatisticas: Estatisticas;
  totalAvaliacoes: number;
};

export default function NumerosPerfil({ estatisticas, totalAvaliacoes }: NumerosPerfilProps) {
  const horas = estatisticas.horasTotais.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const numeros: { valor: string; rotulo: string }[] = [
    { valor: String(estatisticas.jogosZerados), rotulo: "Jogos zerados" },
    { valor: String(estatisticas.jogosEmAndamento), rotulo: "Em andamento" },
    { valor: String(estatisticas.jogosDesistidos), rotulo: "Desistidos" },
    { valor: String(estatisticas.totalRuns), rotulo: "Runs" },
    { valor: formatarNota(totalAvaliacoes === 0 ? null : estatisticas.mediaAvaliacoes), rotulo: "Média das notas" },
    { valor: horas, rotulo: "Horas jogadas" },
  ];

  return (
    <div className="mb-[22px] grid grid-cols-2 border-b border-border md:grid-cols-3 lg:grid-cols-6">
      {numeros.map((numero) => (
        <div
          key={numero.rotulo}
          className="grid content-start gap-0.5 border-b border-border px-4 py-[18px] max-md:nth-[n+5]:border-b-0 md:max-lg:border-r md:max-lg:nth-[3n]:border-r-0 md:max-lg:nth-[n+4]:border-b-0 lg:border-r lg:border-b-0 lg:last:border-r-0"
        >
          <span className="font-display text-[40px] leading-none tabular-nums">{numero.valor}</span>
          <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">{numero.rotulo}</span>
        </div>
      ))}
    </div>
  );
}
