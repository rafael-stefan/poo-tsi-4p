import { nomeStatus } from "@/lib/formato";
import type { StatusJogo } from "@/lib/tipos";

const cores: Record<StatusJogo, string> = {
  JOGANDO: "text-jogando",
  ZERADO: "text-zerado",
  REJOGANDO: "text-rejogando",
  DESISTIDO: "text-desistido",
};

type StatusRunProps = {
  status: StatusJogo;
  texto?: string;
};

export default function StatusRun({ status, texto }: StatusRunProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-meta text-[11px] font-semibold tracking-[0.06em] uppercase ${cores[status]}`}
    >
      <span className="size-2 rounded-[2px] bg-current" />
      {texto ?? nomeStatus(status)}
    </span>
  );
}
