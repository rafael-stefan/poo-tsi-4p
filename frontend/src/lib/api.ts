export class ErroApi extends Error {
  status: number;
  mensagem: string;
  erros: Record<string, string[]>;

  constructor(status: number, mensagem: string, erros: Record<string, string[]> = {}) {
    super(mensagem);
    this.status = status;
    this.mensagem = mensagem;
    this.erros = erros;
  }
}

function mensagemPadrao(status: number): string {
  if (status === 400) return "Os dados enviados são inválidos.";
  if (status === 401) return "Você precisa entrar para continuar.";
  if (status === 403) return "Você não tem permissão para isso.";
  if (status === 404) return "Não encontramos o que você procurou.";
  if (status === 409) return "Essa ação entra em conflito com o que já existe.";
  if (status >= 500) return "O servidor teve um problema. Tente de novo em instantes.";
  return "Algo deu errado. Tente de novo.";
}

export async function api<T>(
  caminho: string,
  opcoes?: { metodo?: string; corpo?: unknown }
): Promise<T> {
  const temCorpo = opcoes?.corpo !== undefined;
  let resposta: Response;
  try {
    resposta = await fetch("/api" + caminho, {
      method: opcoes?.metodo ?? "GET",
      credentials: "include",
      headers: temCorpo ? { "Content-Type": "application/json" } : undefined,
      body: temCorpo ? JSON.stringify(opcoes?.corpo) : undefined,
    });
  } catch {
    throw new ErroApi(0, "Não foi possível falar com o servidor. Verifique sua conexão.");
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  if (resposta.ok) {
    return (await resposta.json()) as T;
  }

  let detalhe: string | undefined;
  let erros: Record<string, string[]> = {};
  try {
    const problema = await resposta.json();
    detalhe = problema.detail;
    erros = problema.erros ?? {};
  } catch {
    detalhe = undefined;
  }
  throw new ErroApi(resposta.status, detalhe ?? mensagemPadrao(resposta.status), erros);
}
