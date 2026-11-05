type EstadoVazioProps = {
  titulo: string;
  texto?: string;
  acao?: React.ReactNode;
};

export default function EstadoVazio({ titulo, texto, acao }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-border px-6 py-14 text-center">
      <h3 className="font-display text-3xl uppercase">{titulo}</h3>
      {texto && <p className="max-w-md text-muted-foreground">{texto}</p>}
      {acao}
    </div>
  );
}
