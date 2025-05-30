// app/reportes/partidos/[matchId].tsx
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function MatchReportScreen() {
  // Get the matchId from route params
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Report</Text>
      <Text style={styles.matchId}>Match ID: {matchId}</Text>
      {/* Add your match report content here */}
    </View>
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
  matchId: {
    fontSize: 18,
  },
});