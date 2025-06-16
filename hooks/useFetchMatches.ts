import { fetchConvocatorias } from '@/api/user/tournaments';
import { getAdminToken } from '@/services/helpers';
import { TournamentMatch } from '@/types/convocatiorias';
import { useState, useEffect } from 'react';

interface ResponseObject {
    convocado: boolean;
    torneos: TournamentMatch[];
    amistosos: TournamentMatch[];
    nextMatch?: TournamentMatch | null;
}

interface ExtendedResponseObject extends ResponseObject {
    filteredTournaments: TournamentMatch[];
}  

export const useConvocatorias = (clubId?: number) => {
    const [convocatorias, setConvocatorias] = useState<ExtendedResponseObject>({
      convocado: false,
      torneos: [],
      amistosos: [],
      nextMatch: null,
      filteredTournaments: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const getNearestMatch = (matches: TournamentMatch[]): TournamentMatch | null => {
      if (!matches.length) return null;
    
      const now = new Date();
      const nowTime = now.getTime();
      console.log(now, nowTime, "time")
    
      const upcomingMatches = matches.filter(match => {
        const matchDate = new Date(`${match.fecha}T${match.horario.split('-')[0]}`);
        const horasActuales = matchDate.getHours();

        //Se suman 6 por horario UTC-6 GDL
        console.log(matchDate.setHours(horasActuales + 6))
        return matchDate.setHours(horasActuales + 6) >= nowTime && match.estatus === "programado";
      });
    
      if (!upcomingMatches.length) return null;
      console.log(upcomingMatches, "upcomming")
    
      return upcomingMatches.reduce((nearest, current) => {
        const nearestDate = new Date(`${nearest.fecha}T${nearest.horario.split('-')[0]}`);
        const currentDate = new Date(`${current.fecha}T${current.horario.split('-')[0]}`);
        
        const nearestDiff = Math.abs(nearestDate.getTime() - nowTime);
        const currentDiff = Math.abs(currentDate.getTime() - nowTime);
        
        return currentDiff < nearestDiff ? current : nearest;
      });
    };

    const getUniqueTournaments = (matches: TournamentMatch[]): TournamentMatch[] => {
      const uniqueNames = new Set<string>();
      return matches.filter(match => {
        if (!match.torneo || uniqueNames.has(match.torneo)) {
          return false;
        }
        uniqueNames.add(match.torneo);
        return true;
      });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        if (clubId === undefined) {
          setConvocatorias({
            convocado: false,
            torneos: [],
            amistosos: [],
            nextMatch: null,
            filteredTournaments: []
          });
          setLoading(false);
          return;
        }
  
        try {
          setLoading(true);
          const token = await getAdminToken();
          
          if (!token) {
            throw new Error('No admin token found');
          }
  
          const data = await fetchConvocatorias(clubId, token);
          console.log(data)
          
          const allMatches = [...(data.torneos || []), ...(data.amistosos || [])];
          const nearestMatch = getNearestMatch(allMatches);

          const allTournaments = [...(data.torneos || []), ...(data.amistosos || [])];
          const filteredTournaments = getUniqueTournaments(allTournaments);
  
          setConvocatorias({
            convocado: data.convocado,
            torneos: data.torneos || [],
            amistosos: data.amistosos || [],
            nextMatch: nearestMatch,
            filteredTournaments: filteredTournaments
          });
          setError(null);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Unknown error occurred');
          setConvocatorias({
            convocado: false,
            torneos: [],
            amistosos: [],
            nextMatch: null,
            filteredTournaments: []
          });
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [clubId]);
  
    return { data: convocatorias, loading, error };
  };