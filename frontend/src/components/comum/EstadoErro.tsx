import { Button } from "@/components/ui/button";

type EstadoErroProps = {
  mensagem: string;
  aoTentarDeNovo: () => void;
};

export default function EstadoErro({ mensagem, aoTentarDeNovo }: EstadoErroProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-[10px] border border-border px-6 py-14 text-center"
    >
      <h3 className="font-display text-3xl uppercase">Algo deu errado</h3>
      <p className="max-w-md text-muted-foreground">{mensagem}</p>
      <Button variant="outline" onClick={aoTentarDeNovo}>
        Tentar de novo
      </Button>
    </div>
  );
}
