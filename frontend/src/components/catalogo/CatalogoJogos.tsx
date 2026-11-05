"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FiltrosCatalogo from "@/components/catalogo/FiltrosCatalogo";
import GradeJogos from "@/components/catalogo/GradeJogos";
import TituloPagina from "@/components/comum/TituloPagina";

export default function CatalogoJogos() {
  const router = useRouter();
  const parametros = useSearchParams();

  const titulo = parametros.get("titulo") ?? "";
  const genero = parametros.get("genero") ?? "";
  const plataforma = parametros.get("plataforma") ?? "";

  function filtrar(chave: string, valor: string) {
    if (valor === "") {
      router.push("/jogos");
      return;
    }
    router.push("/jogos?" + chave + "=" + encodeURIComponent(valor));
  }

  return (
    <>
      <TituloPagina titulo="Jogos">
        <FiltrosCatalogo genero={genero} plataforma={plataforma} aoFiltrar={filtrar} />
      </TituloPagina>
      <GradeJogos
        key={titulo + "|" + genero + "|" + plataforma}
        titulo={titulo}
        genero={genero}
        plataforma={plataforma}
      />
    </>
  );
}
