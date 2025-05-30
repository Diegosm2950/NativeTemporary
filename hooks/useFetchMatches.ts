import { fetchConvocatorias } from '@/api/user/tournaments';
import { getAdminToken } from '@/services/helpers';
import { useState, useEffect } from 'react';

interface ResponseObject {
    convocado: boolean;
    torneos: TournamentMatch[];
    amistosos: TournamentMatch[];
    nextMatch?: TournamentMatch | null;
}  

export const useConvocatorias = (clubId?: number) => {
    const [convocatorias, setConvocatorias] = useState<ResponseObject>({
      convocado: false,
      torneos: [],
      amistosos: [],
      nextMatch: null
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    const getNearestMatch = (matches: TournamentMatch[]): TournamentMatch | null => {
      if (!matches.length) return null;
  
      const now = new Date();
      const upcomingMatches = matches.filter(match => {
        const matchDate = new Date(match.fecha);
        return matchDate >= now && match.estatus === 'programado';
      });
  
      if (!upcomingMatches.length) return null;
  
      return upcomingMatches.reduce((nearest, current) => {
        const nearestDate = new Date(nearest.fecha);
        const currentDate = new Date(current.fecha);
        return currentDate < nearestDate ? current : nearest;
      });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        if (clubId === undefined) {
          setConvocatorias({
            convocado: false,
            torneos: [],
            amistosos: [],
            nextMatch: null
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
          
          // Combine all matches and find the nearest one
          const allMatches = [...(data.torneos || []), ...(data.amistosos || [])];
          const nearestMatch = getNearestMatch(allMatches);
  
          setConvocatorias({
            convocado: data.convocado,
            torneos: data.torneos || [],
            amistosos: data.amistosos || [],
            nextMatch: nearestMatch
          });
          setError(null);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Unknown error occurred');
          setConvocatorias({
            convocado: false,
            torneos: [],
            amistosos: [],
            nextMatch: null
          });
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [clubId]);
  
    return { data: convocatorias, loading, error };
  };