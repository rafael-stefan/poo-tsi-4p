import Link from "next/link";
import Avatar from "@/components/comum/Avatar";
import EstadoVazio from "@/components/comum/EstadoVazio";
import { formatarData } from "@/lib/formato";
import type { Amigo } from "@/lib/tipos";

type ListaAmigosProps = {
  amigos: Amigo[];
};

export default function ListaAmigos({ amigos }: ListaAmigosProps) {
  return (
    <section aria-label="Meus amigos">
      <div className="mb-1.5 flex items-baseline gap-3 border-t-[3px] border-primary pt-2.5">
        <h2 className="text-[22px] font-extrabold">Meus amigos</h2>
        <span className="text-lg text-muted-foreground">{amigos.length}</span>
      </div>
      {amigos.length === 0 ? (
        <div className="mt-3.5">
          <EstadoVazio
            titulo="Sem amigos ainda"
            texto="Você ainda não tem amigos no GameLog. Busque pelo nome ao lado e envie um pedido."
          />
        </div>
      ) : (
        <ul>
          {amigos.map((item) => (
            <li key={item.amizadeId} className="border-b border-border">
              <Link href={"/perfil/" + item.amigo.id} className="group flex items-center gap-3.5 py-4">
                <Avatar nome={item.amigo.nome} fotoPerfil={item.amigo.fotoPerfil} className="size-11" />
                <div className="grid min-w-0 gap-0.5">
                  <span className="truncate text-base font-bold group-hover:underline">{item.amigo.nome}</span>
                  <span className="font-meta text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                    Amigos desde {formatarData(item.desde)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
