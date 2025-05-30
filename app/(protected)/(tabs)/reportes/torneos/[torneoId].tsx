import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchTournamentReport } from '@/api/user/tournaments';
import { HistoricoTorneoResponse } from '@/types/convocatiorias';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import StatsCard, { StatItem } from '@/components/StatsCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatchCard from '@/components/MatchCard';

// Mock data for when API is down
const MOCK_TOURNAMENT_DATA = {
  nombre: 'Torneo de Ejemplo',
  totalPartidos: 5,
  totalLesiones: 2,
  totalTarjetas: 3,
  partidos: [
    {
      partidoId: '1',
      equipoLocal: 'Equipo A',
      equipoVisitante: 'Equipo B',
      marcador: '3-2',
      fecha: '2023-05-15'
    },
    {
      partidoId: '2',
      equipoLocal: 'Equipo C',
      equipoVisitante: 'Equipo D',
      marcador: '1-1',
      fecha: '2023-05-20'
    }
  ]
};

export default function TournamentReport() {
  const { torneoId } = useLocalSearchParams<{ torneoId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournamentStats, setTournamentStats] = useState<StatItem[]>([]);
  const [matchStats, setMatchStats] = useState<StatItem[]>([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const colorScheme = useColorScheme();


  useEffect(() => {
    if (!torneoId) return;

    const loadReport = async () => {
      try {
        setLoading(true);
        let data;
        
        try {
          data = await fetchTournamentReport(torneoId);
          setUsingMockData(false);
        } catch (err) {
          // If API fails, use mock data
          console.warn('API failed, using mock data');
          data = MOCK_TOURNAMENT_DATA;
          setUsingMockData(true);
        }
        
        // Format tournament stats
        const formattedTournamentStats: StatItem[] = [
          { label: 'Total Partidos', value: data.totalPartidos || 0 },
          { label: 'Total Lesiones', value: data.totalLesiones || 0 },
          { label: 'Total Tarjetas', value: data.totalTarjetas || 0 },
        ];
        setTournamentStats(formattedTournamentStats);

        // Format match stats
        if (data.partidos && data.partidos.length > 0) {
          const formattedMatchStats = data.partidos.map(partido => ({
            label: `${partido.equipoLocal} vs ${partido.equipoVisitante}`,
            value: `Resultado: ${partido.marcador} | Fecha: ${partido.fecha}`
          }));
          setMatchStats(formattedMatchStats);
        } else {
          setMatchStats([
            { label: 'No hay partidos registrados', value: 'Próximamente' }
          ]);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error loading tournament report:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [torneoId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const match = {
    equipoLocal: {
      id: 468,
      nombre: "Lola Sux",
    },
    equipoVisitante: {
      id: 132,
      nombre: "Leopardos Rugby Club",
    },
    arbitro: {
      id: 97,
      nombre: "Luis Martínez",
      tipoRegistro_3: 1,
      avatar: "https://example.com/avatars/arbitro97.jpg" 
    },
    _id: "681ba78f9b0884d84fd6632a",
    idTorneo: 10,
    torneo: "Torneo Lola",
    categoria: "Varonil",
    tipoPartido: "amistoso",
    fecha: "2025-05-01",
    horario: "08:00-09:30",
    campo: "Lola",
    estatus: "programado",
    id: 11,
    __v: 0,
    descripcion: "Partido amistoso de preparación para el torneo regional",
    asientosDisponibles: 320,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <Text style={styles.title}>Reporte de torneo</Text>

      <MatchCard match={match} />
      
      {error && (
        <Text style={styles.error}>
          {error} {usingMockData && '(Mostrando datos de ejemplo)'}
        </Text>
      )}
      

      {tournamentStats.length > 0 && (
        <StatsCard
          title="Estadísticas del Torneo"
          stats={tournamentStats}
        />
      )}

      {matchStats.length > 0 && (
        <StatsCard
          title="Partidos del Torneo"
          stats={matchStats}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  }
});