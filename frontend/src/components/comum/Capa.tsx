"use client";

import { useState } from "react";
import Image from "next/image";

const gradientes: string[] = [
  "bg-[linear-gradient(160deg,#3b6bd6,#172a5c_70%)]",
  "bg-[linear-gradient(160deg,#c9a24a,#4b3612_70%)]",
  "bg-[linear-gradient(160deg,#d6345f,#3a0f22_70%)]",
  "bg-[linear-gradient(160deg,#6a7b8c,#1c232b_70%)]",
  "bg-[linear-gradient(160deg,#5ac08a,#133624_70%)]",
  "bg-[linear-gradient(160deg,#a35bd6,#2a1240_70%)]",
  "bg-[linear-gradient(160deg,#e0773a,#3d1a0a_70%)]",
  "bg-[linear-gradient(160deg,#3fb6c9,#0f3138_70%)]",
];

const tamanhosTitulo = {
  pequeno: "text-xs p-1.5",
  normal: "text-[15px] p-2.5",
  grande: "text-3xl p-3",
};

type CapaProps = {
  titulo: string;
  capa?: string | null;
  tamanho?: keyof typeof tamanhosTitulo;
  children?: React.ReactNode;
};

function escolherGradiente(titulo: string): string {
  let soma = 0;
  for (let i = 0; i < titulo.length; i++) {
    soma += titulo.charCodeAt(i);
  }
  return gradientes[soma % 8];
}

export default function Capa({ titulo, capa, tamanho = "normal", children }: CapaProps) {
  const [imagemFalhou, setImagemFalhou] = useState(false);

  if (capa && !imagemFalhou) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[6px] bg-card">
        <Image
          src={"/capas/" + capa}
          alt={"Capa de " + titulo}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          className="object-cover"
          onError={() => setImagemFalhou(true)}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[3/4] w-full items-end overflow-hidden rounded-[6px] font-display leading-none uppercase text-white/90 ${escolherGradiente(titulo)} ${tamanhosTitulo[tamanho]}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.55))]" />
      <span className="relative z-[1] [overflow-wrap:anywhere]">{titulo}</span>
      {children}
    </div>
  );
}
