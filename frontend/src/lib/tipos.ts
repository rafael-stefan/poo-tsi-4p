export type StatusJogo = "JOGANDO" | "ZERADO" | "REJOGANDO" | "DESISTIDO";

export type StatusAmizade = "PENDENTE" | "ACEITA" | "RECUSADA";

export type PlataformaJogo = "PC" | "PLAYSTATION" | "XBOX" | "NINTENDO_SWITCH" | "MOBILE";

export type Jogo = {
  id: number;
  titulo: string;
  capa: string | null;
  genero: string | null;
  plataformas: PlataformaJogo[];
  desenvolvedora: string | null;
  anoLancamento: number | null;
  notaMedia: number | null;
  totalAvaliacoes: number;
};

export type JogoResumo = {
  id: number;
  titulo: string;
  capa: string | null;
};

export type Plataforma = {
  codigo: PlataformaJogo;
  nome: string;
};

export type FaixaNota = {
  faixa: string;
  total: number;
};

export type EstatisticasJogo = {
  pessoasPorStatus: Record<StatusJogo, number>;
  distribuicaoNotas: FaixaNota[];
};

export type JogoDestaque = {
  jogo: JogoResumo;
  genero: string | null;
  notaMedia: number | null;
  totalAvaliacoes: number;
  pessoas: number;
};

export type Destaques = {
  manchete: JogoDestaque | null;
  maisZerado: JogoDestaque | null;
  maisJogado: JogoDestaque | null;
  maisRejogado: JogoDestaque | null;
  maisDesistido: JogoDestaque | null;
  maisBemAvaliados: JogoDestaque[];
};

export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  fotoPerfil: string | null;
  admin: boolean;
};

export type UsuarioResumo = {
  id: number;
  nome: string;
  fotoPerfil: string | null;
};

export type ItemFeed = {
  tipo: "RUN" | "AVALIACAO";
  usuario: UsuarioResumo;
  jogo: JogoResumo;
  status: StatusJogo;
  horasJogo: number | null;
  nota: number | null;
  comentario: string | null;
  quando: string;
};

export type Registro = {
  id: number;
  jogoId: number;
  tituloJogo: string;
  capaJogo: string | null;
  status: StatusJogo;
  dataInicio: string | null;
  dataConclusao: string | null;
  horasJogo: number | null;
  avaliacaoId: number | null;
  nota: number | null;
};

export type Avaliacao = {
  id: number;
  registroId: number;
  jogoId: number;
  tituloJogo: string;
  capaJogo: string | null;
  autorId: number;
  autorNome: string;
  nota: number;
  comentario: string | null;
  horasJogo: number | null;
  statusRun: StatusJogo;
  dataAvaliacao: string;
};

export type Estatisticas = {
  jogosZerados: number;
  jogosEmAndamento: number;
  jogosDesistidos: number;
  totalRuns: number;
  mediaAvaliacoes: number | null;
  horasTotais: number;
};

export type AmizadeResumo = {
  id: number;
  desde: string;
};

export type Perfil = {
  usuario: UsuarioResumo;
  estatisticas: Estatisticas;
  jogosPorStatus: Partial<Record<StatusJogo, Registro[]>>;
  avaliacoes: Avaliacao[];
  amizade: AmizadeResumo | null;
};

export type Amizade = {
  id: number;
  solicitante: UsuarioResumo;
  destinatario: UsuarioResumo;
  status: StatusAmizade;
  data: string;
};

export type Amigo = {
  amizadeId: number;
  amigo: UsuarioResumo;
  desde: string;
};

export type UsuarioAdmin = {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  admin: boolean;
  dataCriacao: string;
};

export type RegistroRequisicao = {
  jogoId: number;
  status: StatusJogo;
  dataInicio?: string | null;
  dataConclusao?: string | null;
  horasJogo?: number | null;
};

export type AvaliacaoRequisicao = {
  nota: number;
  comentario?: string | null;
};

export type JogoRequisicao = {
  titulo: string;
  capa?: string | null;
  genero?: string | null;
  plataformas: PlataformaJogo[];
  desenvolvedora?: string | null;
  anoLancamento?: number | null;
};

export type LogAuditoria = {
  id: number;
  dataHora: string;
  usuarioId: number | null;
  nomeUsuario: string | null;
  ip: string | null;
  metodo: string;
  rota: string;
  status: number;
};
