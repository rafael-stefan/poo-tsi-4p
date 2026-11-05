import type { Metadata } from "next";
import PaginaJogo from "@/components/jogo/PaginaJogo";

export const metadata: Metadata = {
  title: "Jogo - GameLog",
};

export default async function PaginaDoJogo({ params }: PageProps<"/jogos/[id]">) {
  const { id } = await params;
  return <PaginaJogo id={id} />;
}
