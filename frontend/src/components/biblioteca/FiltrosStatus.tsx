import type { StatusJogo } from "@/lib/tipos";

export type FiltroStatus = "TODAS" | StatusJogo;

const opcoes: { valor: FiltroStatus; rotulo: string }[] = [
  { valor: "TODAS", rotulo: "Todas" },
  { valor: "JOGANDO", rotulo: "Jogando" },
  { valor: "ZERADO", rotulo: "Zerado" },
  { valor: "REJOGANDO", rotulo: "Rejogando" },
  { valor: "DESISTIDO", rotulo: "Desistido" },
];

type FiltrosStatusProps = {
  filtro: FiltroStatus;
  contagens: Record<FiltroStatus, number>;
  aoMudar: (filtro: FiltroStatus) => void;
};

export default function FiltrosStatus({ filtro, contagens, aoMudar }: FiltrosStatusProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
      {opcoes.map((opcao) => {
        const ativa = filtro === opcao.valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={ativa}
            onClick={() => aoMudar(opcao.valor)}
            className={`rounded-full border px-3.5 py-[7px] text-[13px] transition-colors ${
              ativa
                ? "border-foreground bg-foreground font-semibold text-background"
                : "border-border bg-card font-medium text-muted-foreground hover:text-foreground"
            }`}
          >
            {opcao.rotulo}
            <em className="ml-1.5 font-meta text-[11px] not-italic opacity-70">{contagens[opcao.valor]}</em>
          </button>
        );
      })}
    </div>
  );
}
