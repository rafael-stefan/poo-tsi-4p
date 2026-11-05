import type { Metadata } from "next";
import ColunaMarca from "@/components/autenticacao/ColunaMarca";
import FormularioCadastro from "@/components/autenticacao/FormularioCadastro";

export const metadata: Metadata = {
  title: "Criar conta - GameLog",
};

export default function PaginaCadastro() {
  return (
    <div className="flex items-center justify-center gap-20 py-6 md:py-12">
      <ColunaMarca />
      <section className="w-full max-w-[420px] rounded-xl border border-border bg-card p-6 md:p-8">
        <h1 className="font-display text-4xl leading-none uppercase">Criar conta</h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Crie sua conta para começar a registrar os jogos que você joga.
        </p>
        <FormularioCadastro />
      </section>
    </div>
  );
}
