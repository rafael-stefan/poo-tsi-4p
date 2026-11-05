import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogoJogos from "@/components/catalogo/CatalogoJogos";

export const metadata: Metadata = {
  title: "Jogos - GameLog",
};

export default function PaginaJogos() {
  return (
    <Suspense>
      <CatalogoJogos />
    </Suspense>
  );
}
