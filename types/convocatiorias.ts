export interface Team {
  id: number;
  nombre: string;
  logo?: string;
}

interface Referee {
  id: number;
  nombre: string;
  tipoRegistro_3: number;
}

interface TorneoInfo {
  id: number;
  nombre: string;
  categoria: string;
  fechaInicio: string;
  fechaFin: string; 
  equipoCampeon: Team | null; 
  mensaje: string;
}

export interface ConvocatoriaResponse {
  convocado: boolean;
  torneos: TournamentMatch[];
  amistosos: TournamentMatch[];
  error?: string;
}

export interface PartidosTorneoResponse {
  page: TournamentMatch;
  perPage: string;
  partidos: MatchResults[];
  total: number;
  totalPages: number;
}

export interface ResponseTorneoInfo {
  torneo: {
      id: number;
      nombre: string;
      categoria: string;
      fechaInicio: string; 
      fechaFin: string;   
      equipos: Team[];   
      equipoGanador: string;
      descripcion: string;
      sede: string;
  };
}

export interface TeamMatchesResponse {
  convocado: boolean;
  partidosTorneo: TournamentMatch[];
  partidosAmistoso: TournamentMatch[]; 
  rol: string;
}

export interface TournamentMatch {
  equipoLocal: Team;
  equipoVisitante: Team;
  arbitro: Referee;
  _id: string;
  idTorneo: number;
  torneo: string;
  categoria: string;
  tipoPartido: string;
  fecha: string;
  horario: string;
  campo: string;
  estatus: string;
  id: number;
  __v: number;
  marcador?: {
    local: number;
    visitante: number;
  }
}


export interface MatchResults extends TournamentMatch {
  resultadoResumen?: string;
  equipoGanador?: string;
}