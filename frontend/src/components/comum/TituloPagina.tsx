type TituloPaginaProps = {
  titulo: string;
  children?: React.ReactNode;
};

export default function TituloPagina({ titulo, children }: TituloPaginaProps) {
  return (
    <div className="mb-[22px] flex flex-wrap items-end justify-between gap-5 border-b border-border pb-[18px]">
      <h1 className="font-display text-5xl leading-[0.9] uppercase md:text-[64px]">{titulo}</h1>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
