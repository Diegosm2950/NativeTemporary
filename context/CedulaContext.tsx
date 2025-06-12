import React, { createContext, useContext, useState, ReactNode } from 'react';

type Player = {
  id: number;
  nombre: string;
  dorsal: number;
  posicion: number;
  foto: string;
};

type CedulaData = {
  partidoId: number;
  tipoPartido: 'torneo' | 'amistoso';
  horaInicio: string;
  estadoTerreno: string;
  marcador: any[];
  cambios: any[];
  lesiones: any[];
  tarjetas: any[];
  observaciones: {
    texto: string;
    publico: string;
  };
  firmas: any;
  asistioArbitro: boolean;
  asistioParamedico: boolean;
  equipoLocal?: {
    nombre: string;
    logo: string;
  };
  equipoVisitante?: {
    nombre: string;
    logo: string;
  };
  torneo?: string;
};

const initialData: CedulaData = {
  partidoId: 0,
  tipoPartido: 'torneo',
  horaInicio: '',
  estadoTerreno: '',
  marcador: [],
  cambios: [],
  lesiones: [],
  tarjetas: [],
  observaciones: {
    texto: '',
    publico: '',
  },
  firmas: {},
  asistioArbitro: false,
  asistioParamedico: false,
};

const CedulaContext = createContext<{
  cedulaData: CedulaData;
  setCedulaData: React.Dispatch<React.SetStateAction<CedulaData>>;
  jugadoresLocal: Player[];
  setJugadoresLocal: (players: Player[]) => void;
  jugadoresVisitante: Player[];
  setJugadoresVisitante: (players: Player[]) => void;
  cronometro: number;
  setCronometro: React.Dispatch<React.SetStateAction<number>>;
}>({
  cedulaData: initialData,
  setCedulaData: () => {},
  jugadoresLocal: [],
  setJugadoresLocal: () => {},
  jugadoresVisitante: [],
  setJugadoresVisitante: () => {},
  cronometro: 0,
  setCronometro: () => {},
});

export const useCedula = () => useContext(CedulaContext);

export const CedulaProvider = ({ children }: { children: ReactNode }) => {
  const [cedulaData, setCedulaData] = useState<CedulaData>(initialData);
  const [jugadoresLocal, setJugadoresLocal] = useState<Player[]>([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState<Player[]>([]);
  const [cronometro, setCronometro] = useState<number>(0);

  return (
    <CedulaContext.Provider
      value={{
        cedulaData,
        setCedulaData,
        jugadoresLocal,
        setJugadoresLocal,
        jugadoresVisitante,
        setJugadoresVisitante,
        cronometro,
        setCronometro,
      }}
    >
      {children}
    </CedulaContext.Provider>
  );
};
