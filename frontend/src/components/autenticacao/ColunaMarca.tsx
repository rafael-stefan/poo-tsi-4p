export default function ColunaMarca() {
  return (
    <div className="hidden max-w-sm lg:block">
      <p className="font-display text-[88px] leading-[0.9] uppercase">
        Game<span className="text-primary">Log</span>
      </p>
      <ul className="mt-8 grid gap-3 border-t border-dashed border-border pt-6 font-texto text-xl text-muted-foreground italic">
        <li>Registre cada run.</li>
        <li>Avalie o que você zerou.</li>
        <li>Acompanhe seus amigos.</li>
      </ul>
    </div>
  );
}
