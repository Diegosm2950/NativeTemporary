import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import MatchCard from '@/components/MatchCard';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useConvocatorias } from '@/hooks/useFetchMatches';
import { useRouter } from 'expo-router';
import { ErrorIndicator, LoadingIndicator } from '@/components/ui/Indicators';

export default function PartidosScreen() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const { loading, error, pastMatches } = useConvocatorias(user?.clubId ?? undefined);

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['right', 'left']}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {pastMatches.map((match) => (
            <TouchableOpacity 
              key={match.id} 
              onPress={() => router.push(`/(protected)/(tabs)/reportes/partidos/${match.id}`)}
            >
              <MatchCard match={match} />
            </TouchableOpacity>
          ))}
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.l,
  },
  logo: {
    width: 36,
    height: 36,
  },
});