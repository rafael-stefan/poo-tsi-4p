import type { PlataformaJogo, StatusJogo } from "@/lib/tipos";

export function formatarNota(nota: number | null): string {
  if (nota === null || nota === undefined) {
    return "–";
  }
  return nota.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-").map(Number);
  const dataLocal = new Date(ano, mes - 1, dia);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(dataLocal);
}

export function tempoRelativo(dataHora: string): string {
  const agora = new Date();
  const data = new Date(dataHora);
  const minutos = Math.floor((agora.getTime() - data.getTime()) / 60000);

  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return horas === 1 ? "há 1 hora" : `há ${horas} horas`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return "ontem";
  if (dias <= 7) return `há ${dias} dias`;

  return formatarData(dataHora);
}

export function nomeStatus(status: StatusJogo): string {
  const nomes: Record<StatusJogo, string> = {
    JOGANDO: "Jogando",
    ZERADO: "Zerado",
    REJOGANDO: "Rejogando",
    DESISTIDO: "Desistido",
  };
  return nomes[status];
}

export function nomePlataforma(plataforma: PlataformaJogo): string {
  const nomes: Record<PlataformaJogo, string> = {
    PC: "PC",
    PLAYSTATION: "PlayStation",
    XBOX: "Xbox",
    NINTENDO_SWITCH: "Nintendo Switch",
    MOBILE: "Mobile",
  };
  return nomes[plataforma];
}
