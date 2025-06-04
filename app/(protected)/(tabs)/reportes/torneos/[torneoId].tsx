import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchTournamentReport } from '@/api/user/tournaments';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import StatsCard, { StatItem } from '@/components/StatsCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatchCard from '@/components/MatchCard';

export default function TournamentReport() {
  const { torneoId } = useLocalSearchParams<{ torneoId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournamentStats, setTournamentStats] = useState<StatItem[]>([]);
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
          console.warn('API failed, using mock data');
          setUsingMockData(true);
        }
  
        // Calculate totals from cedulas array
        let totalLesiones = 0;
        let totalTarjetas = 0;
        let totalPartidos = 0;
  
        if (data?.cedulas) {
          totalPartidos = data.cedulas.length;
          data.cedulas.forEach(cedula => {
            totalLesiones += cedula.lesiones?.length || 0;
            totalTarjetas += cedula.tarjetas?.length || 0;
          });
        }
  
        const formattedTournamentStats: StatItem[] = [
          { label: 'Total Partidos', value: totalPartidos },
          { label: 'Total Lesiones', value: totalLesiones },
          { label: 'Total Tarjetas', value: totalTarjetas },
        ];
        setTournamentStats(formattedTournamentStats);
  
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