export function regrasDaSenha(senha: string) {
  return [
    { texto: "Entre 8 e 72 caracteres", cumprida: senha.length >= 8 && senha.length <= 72 },
    { texto: "Pelo menos uma letra", cumprida: /[A-Za-z]/.test(senha) },
    { texto: "Pelo menos um número", cumprida: /\d/.test(senha) },
  ];
}

export function senhaCumpreRegras(senha: string) {
  return regrasDaSenha(senha).every((regra) => regra.cumprida);
}

type RegrasSenhaProps = {
  senha: string;
  tentouEnviar: boolean;
};

export default function RegrasSenha({ senha, tentouEnviar }: RegrasSenhaProps) {
  return (
    <ul className="grid gap-0.5 font-meta text-[11px] tracking-[0.04em] uppercase">
      {regrasDaSenha(senha).map((regra) => (
        <li
          key={regra.texto}
          className={
            regra.cumprida
              ? "text-zerado"
              : tentouEnviar
                ? "text-destructive"
                : "text-muted-foreground"
          }
        >
          {regra.cumprida ? "✓" : "○"} {regra.texto}
        </li>
      ))}
    </ul>
  );
}
