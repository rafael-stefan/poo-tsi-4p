import Capa from "@/components/comum/Capa";
import SeloNota from "@/components/comum/SeloNota";
import StatusRun from "@/components/comum/StatusRun";
import type { Registro } from "@/lib/tipos";

type CardRunProps = {
  registro: Registro;
  aoAbrir: () => void;
};

export default function CardRun({ registro, aoAbrir }: CardRunProps) {
  return (
    <button
      type="button"
      onClick={aoAbrir}
      aria-label={"Abrir run de " + registro.tituloJogo}
      className="grid content-start gap-1.5 rounded-[6px] text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Capa titulo={registro.tituloJogo} capa={registro.capaJogo}>
        {registro.nota !== null && <SeloNota nota={registro.nota} />}
      </Capa>
      <h4 className="mt-1 text-[15px] leading-tight font-bold">{registro.tituloJogo}</h4>
      <div className="flex items-center justify-between gap-2">
        <StatusRun status={registro.status} />
        {registro.horasJogo !== null && (
          <span className="font-meta text-[11px] text-muted-foreground">{registro.horasJogo}h</span>
        )}
      </div>
    </button>
  );
}
