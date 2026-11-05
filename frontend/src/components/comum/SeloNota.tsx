import { formatarNota } from "@/lib/formato";

type SeloNotaProps = {
  nota: number | null;
  grande?: boolean;
};

export default function SeloNota({ nota, grande = false }: SeloNotaProps) {
  const posicao = grande
    ? "h-[76px] min-w-[76px] border-[3px] text-[28px]"
    : "absolute top-2 right-2 z-[2] h-[42px] min-w-[42px] border-2 text-[15px]";

  return (
    <span
      className={`grid place-items-center rounded-full border-primary bg-background px-1.5 font-ui font-extrabold tabular-nums text-foreground ${posicao}`}
      aria-label={nota === null ? "Sem nota" : "Nota " + formatarNota(nota)}
    >
      {formatarNota(nota)}
    </span>
  );
}
