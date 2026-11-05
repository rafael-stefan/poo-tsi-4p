import Link from "next/link";
import Capa from "@/components/comum/Capa";
import SeloNota from "@/components/comum/SeloNota";

type CardJogoProps = {
  id: number;
  titulo: string;
  capa?: string | null;
  nota: number | null;
  href?: string;
  children?: React.ReactNode;
};

export default function CardJogo({ id, titulo, capa, nota, href, children }: CardJogoProps) {
  return (
    <Link href={href ?? "/jogos/" + id} className="grid content-start gap-1.5">
      <Capa titulo={titulo} capa={capa}>
        <SeloNota nota={nota} />
      </Capa>
      <h4 className="mt-1 text-[15px] leading-tight font-bold">{titulo}</h4>
      {children}
    </Link>
  );
}
