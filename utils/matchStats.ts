// utils/matchStatsFormatter.ts

import { CedulaPartidoResponse } from "@/types/cedulas";

export const formatMatchStats = (matchData: CedulaPartidoResponse) => {
  if (!matchData.cedulas || matchData.cedulas.length === 0) return [];
  
  const cedula = matchData.cedulas[0];
  
  // Count different types of events
  const tries = cedula.marcador?.filter(m => m.accion === 'T').length || 0;
  const conversions = cedula.marcador?.filter(m => m.accion === 'C').length || 0;
  const dropGoals = cedula.marcador?.filter(m => m.accion === 'D').length || 0;
  const yellowCards = cedula.tarjetas?.filter(t => t.tipo === 'T-A').length || 0;
  const redCards = cedula.tarjetas?.filter(t => t.tipo === 'T-R').length || 0;
  const injuries = cedula.lesiones?.length || 0;
  const substitutions = cedula.cambios?.length || 0;

  return [
    { label: 'Tries', value: tries },
    { label: 'Conversiones', value: conversions },
    { label: 'Drop Goals', value: dropGoals },
    { label: 'Tarjetas Amarillas', value: yellowCards },
    { label: 'Tarjetas Rojas', value: redCards },
    { label: 'Lesiones', value: injuries },
    { label: 'Cambios', value: substitutions },
    { label: 'Asistencia Arbitro', value: cedula.asistioArbitro ? 'Sí' : 'No' },
    { label: 'Asistencia Médico', value: cedula.asistioParamedico ? 'Sí' : 'No' },
  ];
};

export const formatTeamStats = (matchData: CedulaPartidoResponse, teamId: number) => {
  if (!matchData.cedulas || matchData.cedulas.length === 0) return [];
  
  const cedula = matchData.cedulas[0];
  const isLocalTeam = cedula.datosPartido.equipoLocal.id === teamId;
  const teamName = isLocalTeam 
    ? cedula.datosPartido.equipoLocal.nombre 
    : cedula.datosPartido.equipoVisitante.nombre;

  // Filter events by team
  const teamEvents = cedula.marcador?.filter(m => 
    m.equipo === (isLocalTeam ? cedula.datosPartido.equipoLocal.nombre : cedula.datosPartido.equipoVisitante.nombre)
  ) || [];

  const tries = teamEvents.filter(m => m.accion === 'T').length || 0;
  const conversions = teamEvents.filter(m => m.accion === 'C').length || 0;
  const dropGoals = teamEvents.filter(m => m.accion === 'D').length || 0;
  
  const teamCards = cedula.tarjetas?.filter(t => 
    t.equipo === (isLocalTeam ? cedula.datosPartido.equipoLocal.nombre : cedula.datosPartido.equipoVisitante.nombre)
  ) || [];
  
  const yellowCards = teamCards.filter(t => t.tipo === 'T-A').length || 0;
  const redCards = teamCards.filter(t => t.tipo === 'T-R').length || 0;
  
  const teamInjuries = cedula.lesiones?.filter(l => 
    l.equipo === (isLocalTeam ? cedula.datosPartido.equipoLocal.nombre : cedula.datosPartido.equipoVisitante.nombre)
  )?.length || 0;

  return [
    { label: 'equipoNombre', value: teamName },
    { label: 'Tries', value: tries },
    { label: 'Conversiones', value: conversions },
    { label: 'Drop Goals', value: dropGoals },
    { label: 'Tarjetas Amarillas', value: yellowCards },
    { label: 'Tarjetas Rojas', value: redCards },
    { label: 'Lesiones', value: teamInjuries },
  ];
};