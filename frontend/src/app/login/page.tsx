import { Suspense } from "react";
import type { Metadata } from "next";
import ColunaMarca from "@/components/autenticacao/ColunaMarca";
import FormularioLogin from "@/components/autenticacao/FormularioLogin";

export const metadata: Metadata = {
  title: "Entrar - GameLog",
};

export default function PaginaLogin() {
  return (
    <div className="flex items-center justify-center gap-20 py-6 md:py-12">
      <ColunaMarca />
      <section className="w-full max-w-[420px] rounded-xl border border-border bg-card p-6 md:p-8">
        <h1 className="font-display text-4xl leading-none uppercase">Entrar</h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Entre para registrar suas runs e ver o que seus amigos estão jogando.
        </p>
        <Suspense>
          <FormularioLogin />
        </Suspense>
      </section>
    </div>
  );
}
