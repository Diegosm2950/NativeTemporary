import { StyleSheet, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import ReportCard from '@/components/ReportCard';

export default function ReportesScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >

      <View style={styles.content}>
        <ReportCard
          title="Estadísticas Globales"
          onPress={() => router.push('/reportes/globales')}
          icon="global"
        />
        <ReportCard
          title="Estadísticas por Partidos"
          onPress={() => router.push('/reportes/partidos')}
          icon="match"
        />
        <ReportCard
          title="Estadísticas por Torneo"
          onPress={() => router.push('/reportes/torneos')}
          icon="trophy"
        />
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