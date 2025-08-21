import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import ReportCard from '@/components/ReportCard';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useConvocatorias } from '@/hooks/useFetchMatches';
import { ErrorIndicator, LoadingIndicator } from '@/components/ui/Indicators';
import { Ionicons } from '@expo/vector-icons';

export default function TorneosReportes() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const { data, loading, error } = useConvocatorias(user?.clubId ?? undefined);

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

  const finalizedTournaments = data.filteredTournaments.filter(tournament => tournament.estatus === "finalizado")

  if (finalizedTournaments.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
        edges={['top', 'right', 'left']}
      >
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="trophy-outline" 
            size={64} 
            color={Colors[colorScheme].tabIconDefault} 
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
            No hay torneos finalizados
          </Text>
          <Text style={[styles.emptySubtext, { color: Colors[colorScheme].tabIconDefault }]}>
            Cuando los torneos finalicen, podrás ver sus reportes aquí.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <View style={styles.content}>
        {finalizedTournaments.map((tournament) => (
          <ReportCard
            title={tournament.torneo}
            onPress={() => router.push(`/(protected)/(tabs)/reportes/torneos/${tournament.idTorneo}`)}
            icon="general"
            key={tournament.id}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.l,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyIcon: {
    marginBottom: Layout.spacing.l,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Layout.spacing.s,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});