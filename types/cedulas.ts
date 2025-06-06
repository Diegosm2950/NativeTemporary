import { TournamentMatch } from "./convocatiorias";

export interface StatItem {
    label: string;
    value: string | number;
}

export interface CedulaPartidoResponse {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    cedulas: Cedula[];
} 

export interface CedulaResponse {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    resultados: Cedula[];
}

export interface Marcador {
    accion: 'T' | 'C' | 'D';
    equipo: string;
    tiempo: string;
    jugador: string;
    _id: string;
}

export interface Cambio {
    equipo: string;
    sale: string;
    entra: string;
    _id: string;
}

export interface Lesion {
    equipo: string;
    jugador: string;
    area: string;
    gravedad: string;
    ambulancia: boolean;
    observacion: string;
    _id: string;
}

export interface Tarjeta {
    equipo: string;
    jugador: string;
    tipo: 'T-A' | 'T-R';
    minuto: string;
    observacion: string;
    _id: string;
}

export interface Cedula {
    observaciones: {
        texto: string;
        publico: string;
    };
    firmas: {
        arbitro: { nombre: string; firma: string };
        capitanLocal: { nombre: string; firma: string };
        capitanVisita: { nombre: string; firma: string };
        representanteLocal: { nombre: string; firma: string; telefono: string };
        representanteVisita: { nombre: string; firma: string; telefono: string };
    };
    _id: string;
    partidoId: number;
    tipoPartido: string;
    datosPartido: TournamentMatch;
    horaInicio: string;
    estadoTerreno: string;
    marcador: Marcador[];
    cambios: Cambio[];
    lesiones: Lesion[];
    tarjetas: Tarjeta[];
    asistioArbitro: boolean;
    asistioParamedico: boolean;
    __v: number;
}