"use client";

import { useState } from "react";
import Avatar from "@/components/comum/Avatar";
import EstadoVazio from "@/components/comum/EstadoVazio";
import { Button } from "@/components/ui/button";
import { useUsuario } from "@/contexto/UsuarioContexto";
import { formatarData } from "@/lib/formato";
import type { UsuarioAdmin } from "@/lib/tipos";

type Filtro = "TODOS" | "ATIVOS" | "SUSPENSOS" | "ADMINS";

const filtros: { valor: Filtro; texto: string }[] = [
  { valor: "TODOS", texto: "Todos" },
  { valor: "ATIVOS", texto: "Ativos" },
  { valor: "SUSPENSOS", texto: "Suspensos" },
  { valor: "ADMINS", texto: "Admins" },
];

type TabelaUsuariosProps = {
  usuarios: UsuarioAdmin[];
  ocupadoId: number | null;
  aoSuspender: (usuario: UsuarioAdmin) => void;
  aoReativar: (usuario: UsuarioAdmin) => void;
  aoPromover: (usuario: UsuarioAdmin) => void;
};

function passaNoFiltro(usuario: UsuarioAdmin, filtro: Filtro): boolean {
  if (filtro === "ATIVOS") return usuario.ativo;
  if (filtro === "SUSPENSOS") return !usuario.ativo;
  if (filtro === "ADMINS") return usuario.admin;
  return true;
}

export default function TabelaUsuarios({
  usuarios,
  ocupadoId,
  aoSuspender,
  aoReativar,
  aoPromover,
}: TabelaUsuariosProps) {
  const { usuario: logado } = useUsuario();
  const [filtro, setFiltro] = useState<Filtro>("TODOS");

  const filtrados = usuarios.filter((usuario) => passaNoFiltro(usuario, filtro));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar usuários">
        {filtros.map((item) => (
          <button
            key={item.valor}
            type="button"
            aria-pressed={filtro === item.valor}
            onClick={() => setFiltro(item.valor)}
            className={`rounded-full border px-3.5 py-[7px] text-[13px] transition-colors ${
              filtro === item.valor
                ? "border-foreground bg-foreground font-semibold text-background"
                : "border-border bg-card font-medium text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.texto}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum usuário"
          texto="Nenhum usuário encontrado nesse filtro."
          acao={
            filtro !== "TODOS" ? (
              <Button variant="outline" onClick={() => setFiltro("TODOS")}>
                Ver todos
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-border">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-3 py-3 font-medium">Usuário</th>
                <th className="px-3 py-3 font-medium">E-mail</th>
                <th className="px-3 py-3 font-medium">Cadastro</th>
                <th className="px-3 py-3 font-medium">Situação</th>
                <th className="px-3 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((usuario) => {
                const propria = logado !== null && logado.id === usuario.id;
                const ocupado = ocupadoId === usuario.id;
                return (
                  <tr key={usuario.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <Avatar nome={usuario.nome} />
                        <span className="font-semibold">{usuario.nome}</span>
                        {usuario.admin && (
                          <span className="rounded-full border border-primary px-2 py-0.5 font-mono text-[10px] tracking-wider text-primary uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{usuario.email}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                      {formatarData(usuario.dataCriacao)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`font-mono text-[11px] tracking-wider uppercase ${
                          usuario.ativo ? "text-zerado" : "text-desistido"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Suspenso"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      {propria ? (
                        <p className="text-right font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                          Você
                        </p>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {usuario.ativo ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={ocupado}
                              onClick={() => aoSuspender(usuario)}
                              aria-label={"Suspender " + usuario.nome}
                            >
                              Suspender
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={ocupado}
                              onClick={() => aoReativar(usuario)}
                              aria-label={"Reativar " + usuario.nome}
                            >
                              Reativar
                            </Button>
                          )}
                          {!usuario.admin && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={ocupado}
                              onClick={() => aoPromover(usuario)}
                              aria-label={"Tornar admin " + usuario.nome}
                            >
                              Tornar admin
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
