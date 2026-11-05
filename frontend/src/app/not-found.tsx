import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NaoEncontrada() {
  return (
    <div className="flex flex-col items-start gap-5 py-10">
      <span className="font-meta text-xs tracking-[0.08em] text-muted-foreground uppercase">Erro 404</span>
      <h1 className="font-display text-[clamp(42px,8vw,96px)] leading-[0.9] uppercase">Página não encontrada</h1>
      <p className="max-w-xl font-texto text-xl text-muted-foreground">
        O endereço que você abriu não existe ou foi removido.
      </p>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
