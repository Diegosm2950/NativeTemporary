import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

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

  if (pastMatches.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
        edges={['right', 'left']}
      >
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="football-outline" 
            size={64} 
            color={Colors[colorScheme].tabIconDefault} 
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>
            No hay partidos finalizados
          </Text>
          <Text style={[styles.emptySubtext, { color: Colors[colorScheme].tabIconDefault }]}>
            Cuando los partidos finalicen, podrás ver sus reportes aquí.
          </Text>
        </View>
      </SafeAreaView>
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
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.l,
  },
  logo: {
    width: 36,
    height: 36,
  },
});