import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import MatchTabs from '@/components/MatchTabs';
import { Match } from '@/types/match';

// Mock data - you might want to move this to a shared file or fetch real data
const mockMatches: Match[] = [
  {
    id: '1',
    homeTeam: {
      id: 'warriors',
      name: 'Rugby Club Warriors',
      shortName: 'Warriors',
      logo: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg'
    },
    awayTeam: {
      id: 'rivals',
      name: 'Rugby Rivals',
      shortName: 'Rivals',
      logo: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg'
    },
    date: '2024-02-10T15:00:00Z',
    league: 'Liga Nacional',
    status: 'live',
    homeScore: 0,
    awayScore: 0,
    matchDay: 5
  },
  {
    id: '2',
    homeTeam: {
      id: 'warriors',
      name: 'Rugby Club Warriors',
      shortName: 'Warriors',
      logo: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg'
    },
    awayTeam: {
      id: 'rivals',
      name: 'Rugby Rivals',
      shortName: 'Rivals',
      logo: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg'
    },
    date: '2024-02-17T15:00:00Z',
    league: 'Liga Nacional',
    status: 'scheduled',
    matchDay: 6
  },
  {
    id: '3',
    homeTeam: {
      id: 'warriors',
      name: 'Rugby Club Warriors',
      shortName: 'Warriors',
      logo: 'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg'
    },
    awayTeam: {
      id: 'legends',
      name: 'Rugby Legends',
      shortName: 'Legends',
      logo: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg'
    },
    date: '2024-01-20T15:00:00Z',
    league: 'Liga Nacional',
    status: 'finished',
    homeScore: 24,
    awayScore: 18,
    matchDay: 4
  }
];

export default function MatchesScreen() {
  const colorScheme = useColorScheme();
  const upcomingMatches = mockMatches.filter(match => match.status !== 'finished');
  const pastMatches = mockMatches.filter(match => match.status === 'finished');

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