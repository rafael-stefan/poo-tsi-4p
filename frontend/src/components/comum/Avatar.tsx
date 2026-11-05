import { Avatar as AvatarBase, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarProps = {
  nome: string;
  fotoPerfil?: string | null;
  className?: string;
};

export default function Avatar({ nome, fotoPerfil, className = "" }: AvatarProps) {
  const inicial = nome.trim().charAt(0).toUpperCase();

  return (
    <AvatarBase className={`size-8 ${className}`}>
      {fotoPerfil && <AvatarImage src={fotoPerfil} alt={nome} />}
      <AvatarFallback className="bg-[linear-gradient(135deg,#ff3d7f,#7a3dff)] text-[13px] font-bold text-white">
        {inicial}
      </AvatarFallback>
    </AvatarBase>
  );
}
