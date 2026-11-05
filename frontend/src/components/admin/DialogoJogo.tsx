"use client";

import { useState } from "react";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import Capa from "@/components/comum/Capa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api, ErroApi } from "@/lib/api";
import type { Jogo, JogoRequisicao, Plataforma, PlataformaJogo } from "@/lib/tipos";

type DialogoJogoProps = {
  jogo: Jogo | null;
  plataformas: Plataforma[];
  aoFechar: () => void;
  aoSalvar: () => void;
};

export default function DialogoJogo({ jogo, plataformas, aoFechar, aoSalvar }: DialogoJogoProps) {
  const [titulo, setTitulo] = useState(jogo?.titulo ?? "");
  const [genero, setGenero] = useState(jogo?.genero ?? "");
  const [desenvolvedora, setDesenvolvedora] = useState(jogo?.desenvolvedora ?? "");
  const [ano, setAno] = useState(jogo?.anoLancamento ? String(jogo.anoLancamento) : "");
  const [capa, setCapa] = useState(jogo?.capa ?? "");
  const [selecionadas, setSelecionadas] = useState<PlataformaJogo[]>(jogo?.plataformas ?? []);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Record<string, string[]>>({});
  const [mensagemGeral, setMensagemGeral] = useState("");

  function alternarPlataforma(codigo: PlataformaJogo) {
    if (selecionadas.includes(codigo)) {
      setSelecionadas(selecionadas.filter((item) => item !== codigo));
    } else {
      setSelecionadas([...selecionadas, codigo]);
    }
  }

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErros({});
    setMensagemGeral("");

    const corpo: JogoRequisicao = {
      titulo: titulo.trim(),
      capa: capa.trim() === "" ? null : capa.trim(),
      genero: genero.trim() === "" ? null : genero.trim(),
      plataformas: selecionadas,
      desenvolvedora: desenvolvedora.trim() === "" ? null : desenvolvedora.trim(),
      anoLancamento: ano.trim() === "" ? null : Number(ano),
    };

    setEnviando(true);
    try {
      if (jogo === null) {
        await api<Jogo>("/admin/jogos", { metodo: "POST", corpo });
      } else {
        await api<Jogo>("/admin/jogos/" + jogo.id, { metodo: "PUT", corpo });
      }
      aoSalvar();
    } catch (erro) {
      if (erro instanceof ErroApi) {
        if (erro.status === 409) {
          setErros({ titulo: [erro.mensagem] });
        } else if (Object.keys(erro.erros).length > 0) {
          setErros(erro.erros);
        } else {
          setMensagemGeral(erro.mensagem);
        }
      } else {
        setMensagemGeral("Algo deu errado. Tente de novo.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && aoFechar()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal uppercase">
            {jogo === null ? "Novo jogo" : "Editar jogo"}
          </DialogTitle>
          <DialogDescription>
            {jogo === null
              ? "Cadastre um jogo no catálogo."
              : "Altere os dados do jogo no catálogo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={salvar} className="grid gap-4" noValidate>
          <CampoComErro
            id="titulo"
            rotulo="Título"
            valor={titulo}
            aoMudar={setTitulo}
            erros={erros.titulo}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoComErro
              id="genero"
              rotulo="Gênero"
              valor={genero}
              aoMudar={setGenero}
              erros={erros.genero}
            />
            <CampoComErro
              id="anoLancamento"
              rotulo="Ano de lançamento"
              valor={ano}
              aoMudar={setAno}
              erros={erros.anoLancamento}
              tipo="number"
            />
          </div>
          <CampoComErro
            id="desenvolvedora"
            rotulo="Desenvolvedora"
            valor={desenvolvedora}
            aoMudar={setDesenvolvedora}
            erros={erros.desenvolvedora}
          />

          <fieldset className="grid gap-2">
            <Label asChild>
              <legend>Plataformas</legend>
            </Label>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {plataformas.map((plataforma) => (
                <label key={plataforma.codigo} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="plataformas"
                    checked={selecionadas.includes(plataforma.codigo)}
                    onChange={() => alternarPlataforma(plataforma.codigo)}
                    className="size-4 accent-primary"
                  />
                  {plataforma.nome}
                </label>
              ))}
            </div>
            {erros.plataformas && (
              <p className="text-[13px] text-destructive">Selecione ao menos uma plataforma.</p>
            )}
          </fieldset>

          <div className="grid grid-cols-[1fr_88px] items-start gap-4">
            <CampoComErro
              id="capa"
              rotulo="Capa"
              valor={capa}
              aoMudar={setCapa}
              erros={erros.capa}
              placeholder="hollow-knight.jpg"
            >
              <p className="text-xs text-muted-foreground">
                O arquivo precisa estar em frontend/public/capas.
              </p>
            </CampoComErro>
            <div className="grid gap-1.5">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                Prévia
              </span>
              <Capa
                key={capa}
                titulo={titulo.trim() === "" ? "Título" : titulo}
                capa={capa.trim() === "" ? null : capa.trim()}
                tamanho="pequeno"
              />
            </div>
          </div>

          {mensagemGeral && (
            <p role="alert" className="text-[13px] text-destructive">
              {mensagemGeral}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
