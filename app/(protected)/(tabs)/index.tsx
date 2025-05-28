import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import MatchCard from '@/components/MatchCard';
import { Match } from '@/types/match';
import { AuthContext } from '@/context/AuthContext';
import MatchTabs from '@/components/MatchTabs';
import Button from '@/components/Button';
import { router } from 'expo-router';

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
        
        <MatchTabs 
          upcomingMatches={upcomingMatches.slice(1)}
          pastMatches={pastMatches}
        />
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
    width: 60,
    height: 60,
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
  }
});