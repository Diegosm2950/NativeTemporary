import { StyleSheet, View } from 'react-native';
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
});