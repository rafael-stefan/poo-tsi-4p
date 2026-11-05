import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-start gap-5 py-10">
      <h1 className="font-display text-[clamp(42px,8vw,96px)] leading-[0.9] uppercase">GameLog</h1>
      <p className="max-w-xl font-texto text-xl text-muted-foreground">
        Registre os jogos que você joga, avalie e acompanhe o que seus amigos estão jogando.
      </p>
      <Button asChild>
        <Link href="/jogos">Ver jogos</Link>
      </Button>
    </div>
  );
}
