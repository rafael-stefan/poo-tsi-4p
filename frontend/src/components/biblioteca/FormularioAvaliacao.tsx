"use client";

import { useState } from "react";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, ErroApi } from "@/lib/api";
import type { Avaliacao, AvaliacaoRequisicao } from "@/lib/tipos";

const limiteComentario = 500;

type FormularioAvaliacaoProps = {
  registroId: number;
  avaliacao?: Avaliacao;
  aoSalvar: () => void;
  aoCancelar?: () => void;
};

export default function FormularioAvaliacao({
  registroId,
  avaliacao,
  aoSalvar,
  aoCancelar,
}: FormularioAvaliacaoProps) {
  const [nota, setNota] = useState(avaliacao === undefined ? "" : String(avaliacao.nota).replace(".", ","));
  const [comentario, setComentario] = useState(avaliacao?.comentario ?? "");
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  function validar(): Record<string, string[]> {
    const novos: Record<string, string[]> = {};
    const texto = nota.trim().replace(",", ".");

    if (texto === "") {
      novos.nota = ["A nota é obrigatória"];
    } else if (!/^\d{1,2}(\.\d)?$/.test(texto)) {
      novos.nota = ["A nota deve ter no máximo uma casa decimal"];
    } else if (Number(texto) > 10) {
      novos.nota = ["A nota deve ser de 0 a 10"];
    }
    if (comentario.length > limiteComentario) {
      novos.comentario = ["O comentário deve ter no máximo 500 caracteres"];
    }
    return novos;
  }

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroGeral("");
    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) {
      return;
    }

    const corpo: AvaliacaoRequisicao = {
      nota: Number(nota.trim().replace(",", ".")),
      comentario: comentario.trim() === "" ? null : comentario.trim(),
    };

    setEnviando(true);
    try {
      if (avaliacao === undefined) {
        await api<Avaliacao>("/registros/" + registroId + "/avaliacao", { metodo: "POST", corpo });
      } else {
        await api<Avaliacao>("/avaliacoes/" + avaliacao.id, { metodo: "PUT", corpo });
      }
      aoSalvar();
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 400) {
        setErros(erro.erros);
        setErroGeral(Object.keys(erro.erros).length === 0 ? erro.mensagem : "");
      } else if (erro instanceof ErroApi) {
        setErroGeral(erro.mensagem);
      } else {
        setErroGeral("Algo deu errado. Tente de novo.");
      }
    } finally {
      setEnviando(false);
    }
  }

  const temErroComentario = (erros.comentario ?? []).length > 0;

  return (
    <form onSubmit={salvar} noValidate className="grid gap-3.5">
      <div className="max-w-[140px]">
        <CampoComErro
          id="avaliacao-nota"
          rotulo="Nota (0 a 10)"
          valor={nota}
          aoMudar={setNota}
          erros={erros.nota}
          placeholder="8,5"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="avaliacao-comentario">Comentário</Label>
        <Textarea
          id="avaliacao-comentario"
          value={comentario}
          onChange={(evento) => setComentario(evento.target.value)}
          aria-invalid={temErroComentario}
          placeholder="O que você achou do jogo? (opcional)"
          className="min-h-24 bg-background font-texto text-base"
        />
        <div className="flex justify-between gap-3 text-[13px]">
          <span className="text-destructive">{erros.comentario?.[0] ?? ""}</span>
          <span
            className={`font-meta text-[11px] ${
              comentario.length > limiteComentario ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {comentario.length}/{limiteComentario}
          </span>
        </div>
      </div>
      {erroGeral !== "" && (
        <p role="alert" className="text-[13px] text-destructive">
          {erroGeral}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : avaliacao === undefined ? "Publicar avaliação" : "Salvar avaliação"}
        </Button>
        {aoCancelar && (
          <Button type="button" variant="outline" onClick={aoCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
