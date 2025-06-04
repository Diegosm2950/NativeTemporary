// app/reportes/partidos/[matchId].tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import StatsCard from '../../../../../components/StatsCard';
import { fetchMatchReports } from '@/api/user/tournaments';
import { formatMatchStats, formatTeamStats } from '@/utils/matchStats';
import { StatItem } from '@/types/cedulas';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import MatchCard from '@/components/MatchCard';

export default function MatchReportScreen() {
  const colorScheme = useColorScheme();

  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchStats, setMatchStats] = useState<StatItem[]>([]);
  const [localTeamStats, setLocalTeamStats] = useState<StatItem[]>([]);
  const [visitorTeamStats, setVisitorTeamStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchMatchReports(matchId);
        console.log('Fetched data:', result);
        setMatchData(result);
        
        // Format the data for display
        if (result.cedulas && result.cedulas.length > 0) {
          setMatchStats(formatMatchStats(result));
          
          const localTeamId = result.cedulas[0].datosPartido.equipoLocal.id;
          setLocalTeamStats(formatTeamStats(result, localTeamId));
          
          const visitorTeamId = result.cedulas[0].datosPartido.equipoVisitante.id;
          setVisitorTeamStats(formatTeamStats(result, visitorTeamId));
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      loadData();
    }
  }, [matchId]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <ScrollView style={styles.scrollView}>
        <View>
          {loading && <Text>Loading...</Text>}
          {error && <Text style={styles.error}>Error: {error}</Text>}
          
          {matchData?.cedulas?.[0] && (
            <>
              <MatchCard match={matchData.cedulas[0].datosPartido} />
              
              {matchStats.length > 0 && (
                <StatsCard
                  title="Resumen del Partido"
                  stats={matchStats}
                />
              )}
              
              {localTeamStats.length > 0 && (
                <StatsCard
                  title={`Estadísticas de ${localTeamStats.find(s => s.label === 'equipoNombre')?.value || 'Equipo Local'}`}
                  stats={localTeamStats.filter(s => s.label !== 'equipoNombre')}
                />
              )}
              
              {visitorTeamStats.length > 0 && (
                <StatsCard
                  title={`Estadísticas de ${visitorTeamStats.find(s => s.label === 'equipoNombre')?.value || 'Equipo Visitante'}`}
                  stats={visitorTeamStats.filter(s => s.label !== 'equipoNombre')}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  matchId: {
    fontSize: 18,
    marginBottom: 10,
  },
  matchInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});