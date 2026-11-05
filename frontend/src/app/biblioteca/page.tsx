import { Suspense } from "react";
import type { Metadata } from "next";
import ConteudoBiblioteca from "@/components/biblioteca/ConteudoBiblioteca";

export const metadata: Metadata = {
  title: "Biblioteca - GameLog",
};

export default function PaginaBiblioteca() {
  return (
    <Suspense>
      <ConteudoBiblioteca />
    </Suspense>
  );
}
