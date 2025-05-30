import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import MatchTabs from '@/components/MatchTabs';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useConvocatorias } from '@/hooks/useFetchMatches';


export default function MatchesScreen() {
  const { user } = useContext(AuthContext);

  const { data } = useConvocatorias(user?.clubId ?? undefined);

  const colorScheme = useColorScheme();
  const upcomingMatches = data.torneos;
  const pastMatches = data.torneos.slice(1,2);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
            Partidos
          </Text>
        </View>
        
        <MatchTabs 
          upcomingMatches={upcomingMatches}
          pastMatches={pastMatches}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
});