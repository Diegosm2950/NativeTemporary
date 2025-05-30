import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}>({
  cedulaData: initialData,
  setCedulaData: () => {},
});

export const useCedula = () => useContext(CedulaContext);

export const CedulaProvider = ({ children }: { children: ReactNode }) => {
  const [cedulaData, setCedulaData] = useState<CedulaData>(initialData);

  return (
    <CedulaContext.Provider value={{ cedulaData, setCedulaData }}>
      {children}
    </CedulaContext.Provider>
  );
};
