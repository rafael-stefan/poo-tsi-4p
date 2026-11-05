"use client";

import { useState } from "react";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import { Button } from "@/components/ui/button";
import { api, ErroApi } from "@/lib/api";
import { nomeStatus } from "@/lib/formato";
import type { Registro, RegistroRequisicao, StatusJogo } from "@/lib/tipos";

const statusDisponiveis: StatusJogo[] = ["JOGANDO", "ZERADO", "REJOGANDO", "DESISTIDO"];

function hoje(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

type FormularioRunProps = {
  registro: Registro;
  aoSalvar: () => void;
};

export default function FormularioRun({ registro, aoSalvar }: FormularioRunProps) {
  const [status, setStatus] = useState<StatusJogo>(registro.status);
  const [dataInicio, setDataInicio] = useState(registro.dataInicio ?? "");
  const [dataConclusao, setDataConclusao] = useState(registro.dataConclusao ?? "");
  const [horas, setHoras] = useState(registro.horasJogo === null ? "" : String(registro.horasJogo));
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  function trocarStatus(novo: StatusJogo) {
    setStatus(novo);
    if (novo !== "ZERADO") {
      setDataConclusao("");
    }
  }

  function validar(): Record<string, string[]> {
    const novos: Record<string, string[]> = {};
    const limite = hoje();

    if (dataInicio !== "" && dataInicio > limite) {
      novos.dataInicio = ["A data de início não pode ser futura"];
    }
    if (status === "ZERADO" && dataConclusao === "") {
      novos.dataConclusao = ["A data de conclusão é obrigatória para um jogo zerado"];
    }
    if (dataConclusao !== "" && dataConclusao > limite) {
      novos.dataConclusao = ["A data de conclusão não pode ser futura"];
    }
    if (dataInicio !== "" && dataConclusao !== "" && dataConclusao < dataInicio) {
      novos.dataConclusao = ["A conclusão não pode ser anterior ao início"];
    }
    if (horas !== "" && (!/^\d+$/.test(horas) || Number(horas) <= 0)) {
      novos.horasJogo = ["As horas devem ser um número inteiro maior que zero"];
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

    const corpo: RegistroRequisicao = {
      jogoId: registro.jogoId,
      status,
      dataInicio: dataInicio === "" ? null : dataInicio,
      dataConclusao: status === "ZERADO" ? dataConclusao : null,
      horasJogo: horas === "" ? null : Number(horas),
    };

    setEnviando(true);
    try {
      await api<Registro>("/registros/" + registro.id, { metodo: "PUT", corpo });
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

  return (
    <form onSubmit={salvar} noValidate className="grid gap-3.5">
      <div className="grid gap-1.5">
        <span className="text-sm leading-none font-medium">Status</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Status da run">
          {statusDisponiveis.map((opcao) => (
            <button
              key={opcao}
              type="button"
              role="radio"
              aria-checked={status === opcao}
              onClick={() => trocarStatus(opcao)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                status === opcao
                  ? "border-foreground bg-foreground font-semibold text-background"
                  : "border-border bg-background font-medium text-muted-foreground hover:text-foreground"
              }`}
            >
              {nomeStatus(opcao)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <CampoComErro
          id="run-inicio"
          rotulo="Início"
          tipo="date"
          valor={dataInicio}
          aoMudar={setDataInicio}
          erros={erros.dataInicio}
        />
        {status === "ZERADO" && (
          <CampoComErro
            id="run-conclusao"
            rotulo="Conclusão"
            tipo="date"
            valor={dataConclusao}
            aoMudar={setDataConclusao}
            erros={erros.dataConclusao}
          />
        )}
        <CampoComErro
          id="run-horas"
          rotulo="Horas jogadas"
          tipo="number"
          valor={horas}
          aoMudar={setHoras}
          erros={erros.horasJogo}
          placeholder="0"
        />
      </div>
      {erroGeral !== "" && (
        <p role="alert" className="text-[13px] text-destructive">
          {erroGeral}
        </p>
      )}
      <Button type="submit" disabled={enviando} className="justify-self-start">
        {enviando ? "Salvando…" : "Salvar"}
      </Button>
    </form>
  );
}
