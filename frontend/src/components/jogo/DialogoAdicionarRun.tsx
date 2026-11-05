"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CampoComErro from "@/components/autenticacao/CampoComErro";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ErroApi } from "@/lib/api";
import { nomeStatus } from "@/lib/formato";
import type { Jogo, Registro, RegistroRequisicao, StatusJogo } from "@/lib/tipos";

type DialogoAdicionarRunProps = {
  jogo: Jogo;
  registros: Registro[];
  aoAdicionar: () => void;
};

const statusDisponiveis: StatusJogo[] = ["JOGANDO", "ZERADO", "REJOGANDO", "DESISTIDO"];

function hoje(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return agora.getFullYear() + "-" + mes + "-" + dia;
}

export default function DialogoAdicionarRun({ jogo, registros, aoAdicionar }: DialogoAdicionarRunProps) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [status, setStatus] = useState<StatusJogo>("JOGANDO");
  const [dataInicio, setDataInicio] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [horas, setHoras] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [erros, setErros] = useState<Record<string, string[]>>({});

  const jaZerou = registros.some((registro) => registro.status === "ZERADO");

  function aoMudarAberto(novoAberto: boolean) {
    if (novoAberto) {
      setStatus("JOGANDO");
      setDataInicio(hoje());
      setDataConclusao("");
      setHoras("");
      setErroGeral("");
      setErros({});
    }
    setAberto(novoAberto);
  }

  function mudarStatus(valor: string) {
    setStatus(valor as StatusJogo);
    if (valor !== "ZERADO") {
      setDataConclusao("");
    }
  }

  function validar(): Record<string, string[]> {
    const encontrados: Record<string, string[]> = {};
    const dataHoje = hoje();

    if (dataInicio !== "" && dataInicio > dataHoje) {
      encontrados.dataInicio = ["a data de início não pode ser futura"];
    }
    if (status === "ZERADO") {
      if (dataConclusao === "") {
        encontrados.dataConclusao = ["informe a data de conclusão"];
      } else if (dataConclusao > dataHoje) {
        encontrados.dataConclusao = ["a data de conclusão não pode ser futura"];
      } else if (dataInicio !== "" && dataConclusao < dataInicio) {
        encontrados.dataConclusao = ["a conclusão não pode ser anterior ao início"];
      }
    }
    if (horas !== "" && (!/^\d+$/.test(horas) || Number(horas) <= 0)) {
      encontrados.horasJogo = ["informe um número inteiro maior que zero"];
    }
    return encontrados;
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroGeral("");

    const encontrados = validar();
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }

    const corpo: RegistroRequisicao = {
      jogoId: jogo.id,
      status,
      dataInicio: dataInicio === "" ? null : dataInicio,
      dataConclusao: status === "ZERADO" ? dataConclusao : null,
      horasJogo: horas === "" ? null : Number(horas),
    };

    setEnviando(true);
    try {
      await api<Registro>("/registros", { metodo: "POST", corpo });
      setAberto(false);
      toast("Adicionado à sua biblioteca", {
        action: { label: "Ver", onClick: () => router.push("/biblioteca") },
      });
      aoAdicionar();
    } catch (erro) {
      if (erro instanceof ErroApi && erro.status === 400 && Object.keys(erro.erros).length > 0) {
        setErros(erro.erros);
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
    <Dialog open={aberto} onOpenChange={aoMudarAberto}>
      <DialogTrigger asChild>
        <Button>+ Adicionar à biblioteca</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl leading-none uppercase">Adicionar à biblioteca</DialogTitle>
          <DialogDescription>{jogo.titulo}</DialogDescription>
        </DialogHeader>
        <form onSubmit={enviar} noValidate className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="status-run">Status</Label>
            <Select value={status} onValueChange={mudarStatus}>
              <SelectTrigger id="status-run" className="w-full bg-background px-3 text-sm data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusDisponiveis.map((opcao) => (
                  <SelectItem key={opcao} value={opcao} disabled={opcao === "REJOGANDO" && !jaZerou}>
                    {nomeStatus(opcao)}
                    {opcao === "REJOGANDO" && !jaZerou && " (precisa ter zerado antes)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erros.status && <p className="text-[13px] text-destructive">{erros.status[0]}</p>}
          </div>

          <CampoComErro
            id="data-inicio"
            rotulo="Data de início"
            tipo="date"
            valor={dataInicio}
            aoMudar={setDataInicio}
            erros={erros.dataInicio}
          />

          {status === "ZERADO" && (
            <CampoComErro
              id="data-conclusao"
              rotulo="Data de conclusão"
              tipo="date"
              valor={dataConclusao}
              aoMudar={setDataConclusao}
              erros={erros.dataConclusao}
            />
          )}

          <CampoComErro
            id="horas-jogo"
            rotulo="Horas jogadas (opcional)"
            tipo="number"
            valor={horas}
            aoMudar={setHoras}
            erros={erros.horasJogo}
            placeholder="Ex.: 12"
          />

          {erroGeral !== "" && (
            <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {erroGeral}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
