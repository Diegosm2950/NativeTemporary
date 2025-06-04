interface Team {
  id: number;
  nombre: string;
  logo?: string;
}

interface Referee {
  id: number;
  nombre: string;
  tipoRegistro_3: number;
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
}