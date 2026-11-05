import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CampoComErroProps = {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  erros?: string[];
  tipo?: string;
  autoComplete?: string;
  placeholder?: string;
  children?: React.ReactNode;
};

export default function CampoComErro({
  id,
  rotulo,
  valor,
  aoMudar,
  erros = [],
  tipo = "text",
  autoComplete,
  placeholder,
  children,
}: CampoComErroProps) {
  const temErro = erros.length > 0;

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{rotulo}</Label>
      <Input
        id={id}
        name={id}
        type={tipo}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={temErro}
        aria-describedby={temErro ? id + "-erro" : undefined}
        className="h-10 bg-background px-3 text-sm"
      />
      {children}
      {temErro && (
        <ul id={id + "-erro"} className="grid gap-0.5 text-[13px] text-destructive">
          {erros.map((erro) => (
            <li key={erro}>{erro.charAt(0).toUpperCase() + erro.slice(1)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
