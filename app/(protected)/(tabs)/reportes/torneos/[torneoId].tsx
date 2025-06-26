import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { fetchPartidosTorneo, fetchTorneosByEquipo, fetchTournamentReport } from '@/api/user/tournaments';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import StatsCard, { StatItem } from '@/components/StatsCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '@/context/AuthContext';
import WinnerTeamCard from '@/components/WinnerTeamCard';
import MatchCard from '@/components/MatchCard';
import { MatchResults, ResponseTorneoInfo } from '@/types/convocatiorias';
import Layout from '@/constants/Layout';
import { EmptyDataIndicator, ErrorIndicator, LoadingIndicator } from '@/components/ui/Indicators';

export default function TournamentReport() {
  const { torneoId } = useLocalSearchParams<{ torneoId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournamentStats, setTournamentStats] = useState<StatItem[]>([]);
  const [tournamentMatches, setTournamentMatches] = useState<MatchResults[]>([]);
  const [torneoInfo, setTorneoInfo] = useState<ResponseTorneoInfo>()
  const colorScheme = useColorScheme();
  const { user, token } = useContext(AuthContext)

  useEffect(() => {
    if (!torneoId) return;
  
    const loadReport = async () => {
      try {
        setLoading(true);
        let data;
        
        try {
          data = await fetchTournamentReport(torneoId);
          if (!token) {
            throw new Error('No admin token found');
          }
          if (typeof user?.clubId !== 'number') {
            throw new Error('Invalid clubId');
          }
  
          const torneoInfo = await fetchTorneosByEquipo(torneoId, token);
          setTorneoInfo(torneoInfo)
          const partidosTorneos = await fetchPartidosTorneo(torneoId, token)
          setTournamentMatches(partidosTorneos.partidos || [])
        } catch (err) {
          console.warn('API failed, using mock data');
        }
  
        let totalLesiones = 0;
        let totalTarjetas = 0;
        let totalPartidos = 0;
  
        if (data?.resultados) {
          totalPartidos = data.resultados.length;
          data.resultados.forEach(cedula => {
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
      <LoadingIndicator/>
    );
  }

  if (error) {
    return (
      <ErrorIndicator error={error}/>
    );
  }

  if (!torneoInfo) {
    return (
      <EmptyDataIndicator message='No hay información de torneo...'/>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <WinnerTeamCard name={torneoInfo.torneo.equipoGanador} team={torneoInfo.torneo.equipos[0]} />
              
        {tournamentStats.length > 0 && (
          <StatsCard
            title="Estadísticas del Torneo"
            stats={tournamentStats}
          />
        )}

        {tournamentMatches.map(match => (
          <TouchableOpacity 
            key={match.id} 
            onPress={() => router.push(`/(protected)/(tabs)/reportes/partidos/${match.id}`)}
          >
            <MatchCard match={match}/>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.l,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginTop: Layout.spacing.m,
    fontSize: 16,
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