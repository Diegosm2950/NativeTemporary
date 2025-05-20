import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import MatchCard from '@/components/MatchCard';
import { Match } from '@/types/match';
import { AuthContext } from '@/context/AuthContext';

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
  }
];

type TabType = 'upcoming' | 'past';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const { user } = useContext(AuthContext);

  
  const upcomingMatches = mockMatches.filter(match => match.status !== 'finished');
  const pastMatches = mockMatches.filter(match => match.status === 'finished');
  
  const nextMatch = upcomingMatches[0];
  
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: user?.foto || "" }}
              style={styles.profileImage}
            />
          </View>
        </View>
        
        <Text style={[styles.greeting, { color: Colors[colorScheme].text }]}>
          ¡Hola, {user?.nombre}!
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].textSecondary }]}>
          Listo para tu próximo partido?
        </Text>
        
        {nextMatch && (
          <View style={styles.nextMatchContainer}>
            <MatchCard match={nextMatch} variant="large" />
          </View>
        )}
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && styles.activeTab,
              { borderBottomColor: Colors[colorScheme].tint }
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'upcoming' && { color: Colors[colorScheme].tint }
            ]}>
              Próximos Partidos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'past' && styles.activeTab,
              { borderBottomColor: Colors[colorScheme].tint }
            ]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'past' && { color: Colors[colorScheme].tint }
            ]}>
              Partidos Pasados
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.matchesContainer}>
          {activeTab === 'upcoming' ? (
            upcomingMatches.slice(1).map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            pastMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
  },
  logo: {
    width: 36,
    height: 36,
  },
  profileContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: Layout.spacing.l,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    textAlign: "center"
  },
  nextMatchContainer: {
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  matchesContainer: {
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.xxl,
  },
});