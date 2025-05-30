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

export default function TorneosReportes() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const { data } = useConvocatorias(user?.clubId ?? undefined);

  console.log(data.filteredTournaments)

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >

      <View style={styles.content}>
        {data.filteredTournaments.map((tournament) => (
          <ReportCard
            title={tournament.torneo}
            onPress={() => router.push(`/(protected)/(tabs)/reportes/torneos/${tournament.id}`)}
            icon="stats"
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